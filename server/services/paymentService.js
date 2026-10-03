// // FILE: server/services/paymentService.js
// // PURPOSE: All direct communication with Cashfree lives HERE, and only here.
// // The secret key never leaves this file / the server.

// import { Cashfree, CFEnvironment } from "cashfree-pg";
// import crypto from "crypto";

// const isProduction =
//   (process.env.CASHFREE_ENV || "SANDBOX").toUpperCase() === "PRODUCTION";

// let cashfreeClient = null;

// // Lazily create the client so a missing .env key fails with a clear error
// // only when a payment is actually attempted, not at server boot.
// const getClient = () => {
//   if (cashfreeClient) return cashfreeClient;

//   const appId = process.env.CASHFREE_APP_ID;
//   const secretKey = process.env.CASHFREE_SECRET_KEY;

//   if (!appId || !secretKey) {
//     const err = new Error(
//       "Cashfree is not configured. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY in server/.env",
//     );
//     err.statusCode = 500;
//     throw err;
//   }

//   cashfreeClient = new Cashfree(
//     isProduction ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
//     appId,
//     secretKey,
//   );
//   return cashfreeClient;
// };

// const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// // Creates the order on Cashfree's side and returns a payment_session_id —
// // this is the ONLY payment-related value that is safe to send to the
// // browser. The browser never sees the app id, the secret key, or talks to
// // Cashfree's server-side order APIs directly.
// export const createPaymentSession = async (order) => {
//   const cashfree = getClient();

//   const phone = (order.buyerPhone || order.shippingAddress?.alternatePhone || "").replace(
//     /\D/g,
//     "",
//   );

//   const request = {
//     order_id: order.orderNumber,
//     order_amount: order.totalAmount,
//     order_currency: "INR",
//     customer_details: {
//       customer_id: String(order.userId),
//       customer_name: order.buyerName,
//       customer_email: order.buyerEmail,
//       // Cashfree requires a valid-looking phone number; fall back to a
//       // placeholder only if truly nothing was collected.
//       customer_phone: phone && phone.length >= 10 ? phone.slice(-10) : "9999999999",
//     },
//     order_meta: {
//       // Cashfree substitutes {order_id} with the real order id when it
//       // redirects the browser back to us.
//       return_url: `${CLIENT_URL}/my-orders/${order._id}?payment=return`,
//     },
//   };

//   const response = await cashfree.PGCreateOrder(request);
//   return {
//     paymentSessionId: response.data.payment_session_id,
//     cfOrderId: response.data.order_id,
//   };
// };

// // Server-to-server status check — used as a safety-net "verify" call when
// // the browser returns to our site, in case the webhook hasn't arrived yet.
// // This is never the ONLY source of truth (the webhook is), but it lets us
// // give the customer an accurate result immediately instead of "please wait".
// export const fetchCashfreeOrder = async (cfOrderId) => {
//   const cashfree = getClient();
//   const response = await cashfree.PGFetchOrder(cfOrderId);
//   return response.data;
// };

// // Manual HMAC-SHA256 verification of Cashfree's webhook signature, done
// // ourselves rather than relying on an SDK helper so it can't silently break
// // across SDK versions. This is Cashfree's documented algorithm:
// //   signature = base64( HMAC_SHA256(timestamp + rawBody, secretKey) )
// export const verifyWebhookSignature = (signature, rawBody, timestamp) => {
//   const secretKey = process.env.CASHFREE_SECRET_KEY;
//   if (!signature || !rawBody || !timestamp || !secretKey) return false;

//   const expected = crypto
//     .createHmac("sha256", secretKey)
//     .update(timestamp + rawBody)
//     .digest("base64");

//   const expectedBuf = Buffer.from(expected);
//   const receivedBuf = Buffer.from(signature);

//   // Constant-time comparison — a plain === here would leak timing
//   // information an attacker could use to guess a valid signature.
//   if (expectedBuf.length !== receivedBuf.length) return false;
//   return crypto.timingSafeEqual(expectedBuf, receivedBuf);
// };



