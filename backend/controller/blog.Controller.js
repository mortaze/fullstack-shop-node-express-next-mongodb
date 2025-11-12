// backend/controller/blog.Controller.js

const blogService = require("../services/blog.Service"); // توجه: نام فایل درست باشه "blogService.js"

// 🟩 ایجاد بلاگ جدید
const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlogService(req.body);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// 🟦 دریافت همه بلاگ‌ها
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getAllBlogsService(req.query);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟨 دریافت بلاگ تکی بر اساس ID
const getSingleBlog = async (req, res, next) => {
  try {
    const blog = await blogService.getBlogByIdService(req.params.id);
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || "Blog not found",
    });
  }
};

// 🟧 دریافت بلاگ‌ها بر اساس دسته‌بندی
const getBlogsByCategory = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogsByCategoryService(req.params.category);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 دریافت بلاگ‌ها بر اساس نویسنده
const getBlogsByAuthor = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogsByAuthorService(req.params.authorId);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟥 دریافت بلاگ‌های مرتبط
const getRelatedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getRelatedBlogsService(req.params.blogId);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 بروزرسانی بلاگ
const updateBlog = async (req, res, next) => {
  try {
    const updated = await blogService.updateBlogService(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// 🟦 حذف بلاگ
const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlogService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// 🟨 افزودن کامنت به بلاگ
const addComment = async (req, res, next) => {
  try {
    const comment = await blogService.addCommentService(req.params.blogId, req.body);
    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

// 🟧 پاسخ به کامنت
const replyToComment = async (req, res, next) => {
  try {
    const reply = await blogService.replyToCommentService(
      req.params.blogId,
      req.params.commentId,
      req.body
    );
    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: reply,
    });
  } catch (error) {
    next(error);
  }
};

// 🟥 بلاگ‌های ویژه
const getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getFeaturedBlogsService();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟦 بلاگ‌های پر بازدید
const getPopularBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getMostViewedBlogsService();
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 افزایش شمارش اشتراک‌گذاری در شبکه اجتماعی
const incrementShare = async (req, res, next) => {
  try {
    const blog = await blogService.incrementShareService(req.params.id, req.params.platform);
    res.status(200).json({
      success: true,
      message: "Share count incremented",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// 🟨 جستجوی بلاگ‌ها
const searchBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.searchBlogsService(req.query.q);
    res.status(200).json({
      success: true,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// 🟦 افزایش بازدید بلاگ
const incrementViews = async (req, res, next) => {
  try {
    const blog = await blogService.incrementViewsService(req.params.blogId);
    res.status(200).json({
      success: true,
      message: "Views incremented",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Export همه فانکشن‌ها
module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  getFeaturedBlogs,
  getPopularBlogs,
  searchBlogs,
  getRelatedBlogs,
  incrementViews,
  incrementShare,
  addComment,
  replyToComment,
};
