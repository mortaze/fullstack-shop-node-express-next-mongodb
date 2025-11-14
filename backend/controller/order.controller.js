const { secret } = require("../config/secret");
const stripe = require("stripe")(secret.stripe_key);
const Order = require("../model/Order");

// ------------------------------
// 🎧 ایجاد Intent پرداخت
// ------------------------------
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const price = Number(req.body?.price || 0);
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: price * 100,
      payment_method_types: ["card"],
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// 🧾 ایجاد سفارش
// ------------------------------
exports.addOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      message: "Order added successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// 📌 دریافت همه سفارش‌ها برای داشبورد
// ------------------------------
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// 📌 دریافت سفارش تکی
// ------------------------------
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// ✏️ ویرایش کامل سفارش (Dashboard)
// ------------------------------
exports.updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// 🔄 فقط تغییر وضعیت سفارش
// ------------------------------
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json({
      success: true,
      message: "Status updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------
// ❌ حذف سفارش
// ------------------------------
exports.deleteOrder = async (req, res, next) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
