// services/blogService.js

const Blog = require("../model/blog");
const User = require("../model/User");
const Category = require("../model/BlogCategory");
const Product = require("../model/Products");

const mongoose = require("mongoose");

exports.createBlogService = async (data) => {
  try {
    let { category, author, status } = data;

    // تبدیل status به lowercase
    if (status) {
      status = status.toLowerCase();
    }
console.log("📦 دریافت از فرانت‌اند:", data);
console.log("🟡 مقدار category قبل از پردازش:", category);
    // اگر category یک object باشد، id بگیریم
    if (typeof category === "object" && category?._id) {
      category = category._id;
    }
console.log("🟢 مقدار category بعد از پردازش:", category);
    // بررسی معتبر بودن ObjectId
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      console.warn("❌ Category ID نامعتبر است:", category);
      category = null;
    }

    const blog = await Blog.create({
      ...data,
      category: category || null,
      status: status || "draft",
    });

    console.log("✅ بلاگ ساخته شد:", blog);

    // اضافه کردن بلاگ به category
    if (category) {
      await Category.updateOne(
        { _id: category },
        { $push: { blogs: blog._id } }
      );
    }

    // اضافه کردن بلاگ به author
    if (author) {
      await User.updateOne(
        { _id: author },
        { $push: { blogs: blog._id } }
      );
    }

    return blog;

  } catch (error) {
    console.error("❌ Error creating blog:", error);
    throw new Error("خطا در ایجاد بلاگ جدید");
  }
};


// 🟦 Get all blogs
exports.getAllBlogsService = async (query = {}) => {
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.featured) filters.featured = query.featured === "true";

  return await Blog.find(filters)
    .populate("author", "name email imageURL")
    .populate("category", "name slug parent children")
    .sort({ createdAt: -1 });
};

// 🟨 Get blog by ID
exports.getBlogByIdService = async (id) => {
  try {
    const blog = await Blog.findById(id)
      .populate("author", "name email imageURL")
      .populate("category", "name slug parent children")
      .populate("relatedProducts", "title price img slug")
      .populate("relatedPosts", "title slug coverImage");

    if (!blog) throw new Error("Blog not found");

    blog.views += 1;
    await blog.save();

    return blog;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw new Error("خطا در واکشی بلاگ");
  }
};

// 🟧 Get blogs by category
exports.getBlogsByCategoryService = async (categoryId) => {
  return await Blog.find({
    category: categoryId,
    status: "published",
  })
    .populate("author", "name email imageURL")
    .sort({ createdAt: -1 });
};

// 🟥 Get related blogs
exports.getRelatedBlogsService = async (blogId) => {
  const currentBlog = await Blog.findById(blogId);
  if (!currentBlog) throw new Error("Blog not found");

  return await Blog.find({
    tags: { $in: currentBlog.tags },
    _id: { $ne: blogId },
    status: "published",
  })
    .limit(6)
    .populate("author", "name");
};

// 🟦 Update blog
exports.updateBlogService = async (id, updatedData) => {
  return await Blog.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
};

// 🟥 Delete blog
exports.deleteBlogService = async (id) => {
  return await Blog.findByIdAndDelete(id);
};

// 🟨 Add comment
exports.addCommentService = async (blogId, commentData) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  blog.comments.push(commentData);
  await blog.save();

  return blog.comments[blog.comments.length - 1];
};

// 🟧 Reply to comment
exports.replyToCommentService = async (blogId, commentId, replyData) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  const comment = blog.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  comment.replies.push(replyData);
  await blog.save();

  return comment.replies[comment.replies.length - 1];
};

// 🟥 Get featured blogs
exports.getFeaturedBlogsService = async () => {
  return await Blog.find({
    featured: true,
    status: "published",
  })
    .sort({ publishDate: -1 })
    .limit(6);
};

// 🟩 Get most viewed blogs
exports.getMostViewedBlogsService = async () => {
  return await Blog.find({
    status: "published",
  })
    .sort({ views: -1 })
    .limit(10);
};

// 🟦 Increment social share
exports.incrementShareService = async (id, platform) => {
  const validPlatforms = ["facebook", "twitter", "linkedin", "instagram"];
  if (!validPlatforms.includes(platform))
    throw new Error("Invalid platform");

  return await Blog.findByIdAndUpdate(
    id,
    { $inc: { [`socialShare.${platform}`]: 1 } },
    { new: true }
  );
};
