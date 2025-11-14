
// blogcategory.route.js
const express = require("express");
const router = express.Router();
const {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controller/blogCategory.controller");

// مسیرهای CRUD
router.post("/create", createBlogCategory);
router.get("/show", getAllBlogCategories);
router.get("/get/:id", getBlogCategoryById);
router.patch("/update/:id", updateBlogCategory);
router.delete("/delete/:id", deleteBlogCategory);

module.exports = router;
