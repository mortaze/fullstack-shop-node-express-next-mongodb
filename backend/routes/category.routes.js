
const express = require('express'); // ← این خط باید بالای فایل باشه
const router = express.Router();
const multer = require('multer');






const { updateCategory } = require("../controller/category.controller");

// 📦 پیکربندی multer برای دریافت FormData
const storage = multer.memoryStorage();
const upload = multer({ storage });

// // internal
const categoryController = require('../controller/category.controller');

// --- مسیرها ---
// get single category
router.get('/get/:id', categoryController.getSingleCategory);

// add new category
router.post('/add', upload.single('img'), categoryController.addCategory);

// add all categories
router.post('/add-all', categoryController.addAllCategory);

// get all categories
router.get('/all', categoryController.getAllCategory);

// get categories by product type
router.get('/show/:type', categoryController.getProductTypeCategory);

// get all show categories
router.get('/show', categoryController.getShowCategory);

// delete category
router.delete('/delete/:id', categoryController.deleteCategory);

router.patch("/edit/:id", upload.single("img"), updateCategory);

module.exports = router;
