const express = require('express');
const router = express.Router();

// نمونه route ساده برای تست
router.post('/', (req, res) => {
  res.json({ success: true, message: "Upload route works!" });
});

module.exports = router;
