// backend/controller/blog.Controller.js

const blogService = require("../services/blog.Service"); // نام فایل دقیق باید blogService.js باشد
const Category = require("../model/Category");
const User = require("../model/User");

// 🟩 ایجاد بلاگ جدید
const createBlog = async (req, res, next) => {
  try {
    console.log("📦 دریافت از فرانت‌اند:", req.body);
    const blog = await blogService.createBlogService(req.body);
    console.log("✅ بلاگ ساخته شد:", blog);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    console.error("❌ خطا در ایجاد بلاگ:", error);
    next(error);
  }
};

// 🟨 دریافت بلاگ تکی با populate
const getSingleBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    console.log("🟡 دریافت بلاگ با ID:", blogId);

    let blog = await blogService.getBlogByIdService(blogId);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog = await blog.populate([
      { path: "category", select: "name slug" },
      { path: "author", select: "name email" },
    ]);

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("❌ خطا در دریافت بلاگ:", error);
    res.status(500).json({ success: false, message: error.message || "خطا در دریافت بلاگ" });
  }
};

// 🟦 دریافت همه بلاگ‌ها با populate
const getAllBlogs = async (req, res, next) => {
  try {
    let blogs = await blogService.getAllBlogsService(req.query);
    blogs = await Promise.all(
      blogs.map(async (blog) => blog.populate([
        { path: "category", select: "name slug" },
        { path: "author", select: "name email" },
      ]))
    );
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error("❌ خطا در دریافت همه بلاگ‌ها:", error);
    next(error);
  }
};

// 🟧 دریافت بلاگ‌ها بر اساس دسته‌بندی
const getBlogsByCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.category;
    let blogs = await blogService.getBlogsByCategoryService(categoryId);
    blogs = await Promise.all(
      blogs.map(async (blog) => blog.populate([
        { path: "category", select: "name slug" },
        { path: "author", select: "name email" },
      ]))
    );
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error("❌ خطا در دریافت بلاگ‌ها بر اساس دسته:", error);
    next(error);
  }
};

// 🟩 بروزرسانی بلاگ
const updateBlog = async (req, res, next) => {
  try {
    const updated = await blogService.updateBlogService(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Blog updated successfully", data: updated });
  } catch (error) {
    console.error("❌ خطا در بروزرسانی بلاگ:", error);
    next(error);
  }
};

// 🟦 حذف بلاگ
const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlogService(req.params.id);
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("❌ خطا در حذف بلاگ:", error);
    next(error);
  }
};

// 🟨 افزودن کامنت به بلاگ
const addComment = async (req, res, next) => {
  try {
    const comment = await blogService.addCommentService(req.params.blogId, req.body);
    res.status(201).json({ success: true, message: "Comment added successfully", data: comment });
  } catch (error) {
    next(error);
  }
};

// 🟧 پاسخ به کامنت
const replyToComment = async (req, res, next) => {
  try {
    const reply = await blogService.replyToCommentService(req.params.blogId, req.params.commentId, req.body);
    res.status(201).json({ success: true, message: "Reply added successfully", data: reply });
  } catch (error) {
    next(error);
  }
};

// 🟥 بلاگ‌های ویژه
const getFeaturedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getFeaturedBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// 🟦 بلاگ‌های پر بازدید
const getPopularBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getMostViewedBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// 🟩 افزایش شمارش اشتراک‌گذاری
const incrementShare = async (req, res, next) => {
  try {
    const blog = await blogService.incrementShareService(req.params.id, req.params.platform);
    res.status(200).json({ success: true, message: "Share count incremented", data: blog });
  } catch (error) {
    next(error);
  }
};

// 🟨 جستجوی بلاگ‌ها
const searchBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.searchBlogsService(req.query.q);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// 🟦 افزایش بازدید بلاگ
const incrementViews = async (req, res, next) => {
  try {
    const blog = await blogService.incrementViewsService(req.params.blogId);
    res.status(200).json({ success: true, message: "Views incremented", data: blog });
  } catch (error) {
    next(error);
  }
};

// 🟩 دریافت بلاگ‌ها بر اساس نویسنده
const getBlogsByAuthor = async (req, res, next) => {
  try {
    const blogs = await blogService.getBlogsByAuthorService(req.params.authorId);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

// 🟥 دریافت بلاگ‌های مرتبط
const getRelatedBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getRelatedBlogsService(req.params.blogId);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

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