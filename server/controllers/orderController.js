// FILE: server/controllers/orderController.js

import * as orderService from "../services/orderService.js";

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const userObj = req.authUser;

    if (userObj.role === "admin" || userObj.role === "staff") {
      return res.status(403).json({
        success: false,
        message: "Admins or staff members cannot place orders.",
      });
    }

    const buyer = {
      name: req.body.buyerName || userObj.name || "",
      email: req.body.buyerEmail || userObj.email,
      phone: req.body.buyerPhone || "",
      company: req.body.buyerCompany || "",
    };

    if (!items || !items.length) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty." });
    }

    const order = await orderService.createOrder(userObj.id, buyer, items);

    return res.status(201).json({ success: true, order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to place order.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.authUser.id);
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch orders.",
    });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    const { role, id: userId } = req.authUser;

    if (role === "customer") {
      const owned = await orderService.isOrderOwnedByUser(
        req.params.id,
        userId,
      );
      if (!owned) {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this order.",
        });
      }
    }

    const order = await orderService.getOrderById(req.params.id);
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error.",
    });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const { page, limit, status, search } = req.query;
    const result = await orderService.getAllOrdersAdmin({
      page,
      limit,
      status,
      search,
    });
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch admin orders.",
    });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body);
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to update order.",
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const stats = await orderService.getOrderAnalytics();
    return res.json({ success: true, stats });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch analytics.",
    });
  }
};



