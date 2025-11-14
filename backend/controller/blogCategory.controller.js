const blogCategoryService = require("../services/blogCategory.service");

// 🟢 ایجاد
exports.createBlogCategory = async (req, res) => {
  try {
    const newCategory = await blogCategoryService.createCategory(req.body);
    res.status(201).json({
      success: true,
      message: "دسته‌بندی با موفقیت ایجاد شد",
      data: newCategory,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "خطا در ایجاد دسته‌بندی",
      error: error.message,
    });
  }
};

// 🟣 دریافت همه
exports.getAllBlogCategories = async (req, res) => {
  try {
    const categories = await blogCategoryService.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در دریافت دسته‌بندی‌ها",
      error: error.message,
    });
  }
};

// 🔵 دریافت یک دسته خاص
exports.getBlogCategoryById = async (req, res) => {
  try {
    const category = await blogCategoryService.getCategoryById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "دسته یافت نشد" });
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟠 ویرایش
exports.updateBlogCategory = async (req, res) => {
  try {
    const updated = await blogCategoryService.updateCategory(
      req.params.id,
      req.body
    );
    if (!updated)
      return res.status(404).json({ success: false, message: "دسته یافت نشد" });
    res.status(200).json({
      success: true,
      message: "دسته‌بندی با موفقیت به‌روزرسانی شد",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "خطا در ویرایش دسته‌بندی",
      error: error.message,
    });
  }
};

// 🔴 حذف
exports.deleteBlogCategory = async (req, res) => {
  try {
    const deleted = await blogCategoryService.deleteCategory(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "دسته یافت نشد" });
    res.status(200).json({
      success: true,
      message: "دسته‌بندی حذف شد",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطا در حذف دسته‌بندی",
      error: error.message,
    });
  }
};
