const express = require("express");
const {
  createPaymentIntent,
  addOrder,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
} = require("../controller/order.controller");

const router = express.Router();

// ------------------------
// 🧾 مدیریت سفارش
// ------------------------

// دریافت همه سفارش‌ها
router.get("/", getOrders);

// دریافت سفارش تکی
router.get("/:id", getSingleOrder);

// ایجاد سفارش (کاربر)
router.post("/", addOrder);

// ویرایش کامل سفارش (برای داشبورد)
router.put("/:id", updateOrder);

// تغییر وضعیت سفارش (Pending → Completed...)
router.patch("/:id/status", updateOrderStatus);

// حذف سفارش (داشبورد)
router.delete("/:id", deleteOrder);

// پرداخت Stripe
router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;
