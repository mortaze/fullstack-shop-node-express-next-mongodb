// controllers/blogController.js

const Blog = require('../model/blog');
const {
  createBlogService,
  updateBlogService,
  deleteBlogService,
  getAllBlogsService,
  getSingleBlogService,
  getBlogsByCategoryService,
  getBlogsByAuthorService,
  getPopularBlogsService,
  getFeaturedBlogsService,
  searchBlogsService,
  getRelatedBlogsService,
  incrementBlogViewsService,
} = require('../services/blog.Service');

// ✅ Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const blog = await createBlogService(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const blog = await updateBlogService(req.params.id, req.body);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const result = await deleteBlogService(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await getAllBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get a single blog
exports.getSingleBlog = async (req, res) => {
  try {
    const blog = await getSingleBlogService(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get blogs by category
exports.getBlogsByCategory = async (req, res) => {
  try {
    const blogs = await getBlogsByCategoryService(req.params.category);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get blogs by author
exports.getBlogsByAuthor = async (req, res) => {
  try {
    const blogs = await getBlogsByAuthorService(req.params.authorId);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get popular blogs
exports.getPopularBlogs = async (req, res) => {
  try {
    const blogs = await getPopularBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get featured blogs
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await getFeaturedBlogsService();
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Search blogs
exports.searchBlogs = async (req, res) => {
  try {
    const { keyword } = req.query;
    const blogs = await searchBlogsService(keyword);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get related blogs
exports.getRelatedBlogs = async (req, res) => {
  try {
    const blogs = await getRelatedBlogsService(req.params.blogId);
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Increment views
exports.incrementViews = async (req, res) => {
  try {
    const updated = await incrementBlogViewsService(req.params.blogId);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


