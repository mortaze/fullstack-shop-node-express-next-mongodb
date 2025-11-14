const BlogCategory = require("../model/BlogCategory");

// ایجاد دسته‌بندی جدید
exports.createCategory = async (data) => {
  const category = new BlogCategory(data);
  return await category.save();
};

// دریافت همه دسته‌بندی‌ها
exports.getAllCategories = async () => {
  return await BlogCategory.find().populate("parent", "name slug");
};

// دریافت دسته خاص
exports.getCategoryById = async (id) => {
  return await BlogCategory.findById(id).populate("parent", "name slug");
};

// به‌روزرسانی
exports.updateCategory = async (id, data) => {
  return await BlogCategory.findByIdAndUpdate(id, data, { new: true });
};

// حذف
exports.deleteCategory = async (id) => {
  return await BlogCategory.findByIdAndDelete(id);
};
