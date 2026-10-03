// FILE: server/controllers/paymentController.js

import * as orderService from "../services/orderService.js";
import * as paymentService from "../services/paymentService.js";

// POST /api/payments/session/:orderId
// Called by the frontend right after an order is created, to get a
// payment_session_id it can hand to the Cashfree checkout SDK.
export const createSession = async (req, res) => {
  try {
    const { id: userId, role } = req.authUser;
    const order = await orderService.getOrderById(req.params.orderId);

    // Ownership check — a customer can only pay for their own order.
    if (role === "customer" && String(order.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this order.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already paid." });
    }

    const { paymentSessionId, cfOrderId } =
      await paymentService.createPaymentSession(order);

    // Persist so we can look this order up again from the webhook/verify
    // step, and so a page refresh doesn't need to hit Cashfree again.
    await orderService.savePaymentSession(order._id, {
      paymentSessionId,
      cfOrderId,
    });

    return res.json({ success: true, paymentSessionId, cfOrderId });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to start payment.",
    });
  }
};

// GET /api/payments/verify/:orderId
// Called by the frontend when the customer lands back on our site after
// checkout, as a safety net in case Cashfree's webhook is delayed. This
// makes an authenticated, server-to-server call to Cashfree — it does NOT
// trust anything from the browser's URL/redirect itself.
export const verifyPayment = async (req, res) => {
  try {
    const { id: userId, role } = req.authUser;
    const order = await orderService.getOrderById(req.params.orderId);

    if (role === "customer" && String(order.userId) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this order.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.json({ success: true, paymentStatus: "paid", order });
    }

    if (!order.cfOrderId) {
      return res.json({
        success: true,
        paymentStatus: order.paymentStatus,
        order,
      });
    }

    const cfOrder = await paymentService.fetchCashfreeOrder(order.cfOrderId);

    if (cfOrder.order_status === "PAID") {
      const updated = await orderService.markOrderPaid(order._id, {});
      return res.json({ success: true, paymentStatus: "paid", order: updated });
    }

    if (["EXPIRED", "TERMINATED"].includes(cfOrder.order_status)) {
      const updated = await orderService.markOrderFailed(order._id);
      return res.json({
        success: true,
        paymentStatus: "failed",
        order: updated,
      });
    }

    return res.json({ success: true, paymentStatus: "pending", order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to verify payment.",
    });
  }
};

// POST /api/payments/webhook
// Called directly by Cashfree's servers — no user is logged in here.
// Authenticity comes ONLY from the signature check, not from auth
// middleware. This is the source of truth for payment status.
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];
    const rawBody = req.rawBody; // set by the raw-body middleware in index.js

    const isValid = paymentService.verifyWebhookSignature(
      signature,
      rawBody,
      timestamp,
    );

    if (!isValid) {
      // Do not process anything we can't verify. Respond 400 so Cashfree
      // knows delivery failed (and will retry) instead of silently
      // swallowing a possibly-forged request.
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature." });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.type;
    const cfOrderId = event?.data?.order?.order_id;

    if (!cfOrderId) {
      return res.status(200).json({ success: true }); // nothing to do, ack anyway
    }

    const order = await orderService.getOrderByOrderNumber(cfOrderId);
    if (!order) {
      return res.status(200).json({ success: true }); // unknown order, just ack
    }

    // Defense in depth: even though the signature proves this came from
    // Cashfree, double-check the amount matches what we expect before
    // trusting a "success" event.
    const paidAmount = event?.data?.order?.order_amount;
    const amountMatches =
      typeof paidAmount !== "number" ||
      Math.abs(paidAmount - order.totalAmount) < 1;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK" && amountMatches) {
      await orderService.markOrderPaid(order._id, {
        cfPaymentId: event?.data?.payment?.cf_payment_id
          ? String(event.data.payment.cf_payment_id)
          : undefined,
      });
    } else if (
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      eventType === "PAYMENT_USER_DROPPED_WEBHOOK"
    ) {
      await orderService.markOrderFailed(order._id);
    }

    // Cashfree just needs a 2xx to know delivery succeeded — it retries on
    // anything else, so we always ack once we've safely processed (or
    // safely ignored) the event.
    return res.status(200).json({ success: true });
  } catch (error) {
    // Returning 500 makes Cashfree retry the webhook later, which is what
    // we want if something on our end (e.g. DB) briefly failed.
    return res.status(500).json({ success: false });
  }
};
