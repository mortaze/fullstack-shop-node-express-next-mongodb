// services/blogService.js

const Blog = require("../model/blog");
const User = require("../model/User");
const Category = require("../model/Category");
const Product = require("../model/Products");

// 🟩 Create a new blog post
exports.createBlogService = async (data) => {
  const blog = await Blog.create(data);
  const { _id: blogId, author, category } = blog;

  // Optionally, connect blog to category or author
  if (category) {
    await Category.updateOne(
      { _id: category },
      { $push: { blogs: blogId } }
    );
  }

  if (author) {
    await User.updateOne(
      { _id: author },
      { $push: { blogs: blogId } }
    );
  }

  return blog;
};

// 🟦 Get all blogs
exports.getAllBlogsService = async (query = {}) => {
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.featured) filters.featured = query.featured === "true";

  const blogs = await Blog.find(filters)
    .populate("author", "name email imageURL")
    .populate("category", "parent children")
    .sort({ createdAt: -1 });
  return blogs;
};

// 🟨 Get single blog by ID
exports.getBlogByIdService = async (id) => {
  const blog = await Blog.findById(id)
    .populate("author", "name email imageURL")
    .populate("relatedProducts", "title price img slug")
    .populate("relatedPosts", "title slug coverImage")
    .populate("category", "parent children");

  if (!blog) throw new Error("Blog not found");
  blog.views += 1;
  await blog.save();
  return blog;
};

// 🟧 Get blogs by category
exports.getBlogsByCategoryService = async (categoryId) => {
  const blogs = await Blog.find({ category: categoryId, status: "published" })
    .populate("author", "name email imageURL")
    .sort({ createdAt: -1 });
  return blogs;
};

// 🟥 Get related blogs
exports.getRelatedBlogsService = async (blogId) => {
  const currentBlog = await Blog.findById(blogId);
  if (!currentBlog) throw new Error("Blog not found");

  const relatedBlogs = await Blog.find({
    tags: { $in: currentBlog.tags },
    _id: { $ne: blogId },
    status: "published",
  })
    .limit(6)
    .populate("author", "name");

  return relatedBlogs;
};

// 🟩 Update blog
exports.updateBlogService = async (id, updatedData) => {
  const blog = await Blog.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });
  return blog;
};

// 🟦 Delete blog
exports.deleteBlogService = async (id) => {
  const blog = await Blog.findByIdAndDelete(id);
  return blog;
};

// 🟨 Add comment to blog
exports.addCommentService = async (blogId, commentData) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");

  blog.comments.push(commentData);
  await blog.save();
  return blog.comments[blog.comments.length - 1];
};

// 🟧 Reply to a comment
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
  const blogs = await Blog.find({ featured: true, status: "published" })
    .sort({ publishDate: -1 })
    .limit(6);
  return blogs;
};

// 🟩 Get most viewed blogs
exports.getMostViewedBlogsService = async () => {
  const blogs = await Blog.find({ status: "published" })
    .sort({ views: -1 })
    .limit(10);
  return blogs;
};

// 🟦 Increment social share counter
exports.incrementShareService = async (id, platform) => {
  const validPlatforms = ["facebook", "twitter", "linkedin", "instagram"];
  if (!validPlatforms.includes(platform)) throw new Error("Invalid platform");

  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { [`socialShare.${platform}`]: 1 } },
    { new: true }
  );
  return blog;
};
