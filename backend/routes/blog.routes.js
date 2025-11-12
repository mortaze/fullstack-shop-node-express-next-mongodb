
// routes/blog.routes.js

const express = require('express');
const router = express.Router();
const blogController = require('../controller/blog.Controller');

// CRUD Routes
router.post('/create', blogController.createBlog);
router.patch('/update/:id', blogController.updateBlog);
router.delete('/delete/:id', blogController.deleteBlog);
router.get('/all', blogController.getAllBlogs);
router.get('/get/:id', blogController.getSingleBlog);

// Category, Author, and Featured Routes
router.get('/category/:category', blogController.getBlogsByCategory);
router.get('/author/:authorId', blogController.getBlogsByAuthor);
router.get('/featured', blogController.getFeaturedBlogs);
router.get('/popular', blogController.getPopularBlogs);

// Search and Related Blogs
router.get('/search', blogController.searchBlogs);
router.get('/related/:blogId', blogController.getRelatedBlogs);

// Increment views
router.patch('/views/:blogId', blogController.incrementViews);

module.exports = router;