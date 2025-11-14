// models/Blog.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

// Blog Schema
const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog title."],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long."],
      maxlength: [200, "Title is too long."],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt is too long."],
    },
    content: {
      type: String,
      required: [true, "Please provide blog content."],
    },
    coverImage: {
      type: String,
      validate: [validator.isURL, "Please provide a valid image URL."],
    },
    gallery: [
      {
        type: String,
        validate: [validator.isURL, "Please provide a valid image URL."],
      },
    ],
    videoUrl: {
      type: String,
      validate: {
        validator: (v) => !v || validator.isURL(v),
        message: "Invalid video URL",
      },
    },

    // SEO Fields
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, trim: true },
      keywords: [String],
      canonicalUrl: {
        type: String,
        validate: {
          validator: (v) => !v || validator.isURL(v),
          message: "Invalid canonical URL",
        },
      },
    },

    
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
   
    
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "BlogCategory", 
      required: true 
    },

    tags: [String],
    relatedProducts: [{ type: ObjectId, ref: "Products" }],
    relatedPosts: [{ type: ObjectId, ref: "Blog" }],

    // Engagement
    readTime: {
      type: Number,
      default: 0, // in minutes
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: { type: ObjectId, ref: "User" },
        name: { type: String, trim: true },
        email: {
          type: String,
          trim: true,
          validate: [validator.isEmail, "Please provide a valid email."],
        },
        text: { type: String, required: true },
        replies: [
          {
            name: { type: String },
            text: { type: String },
            createdAt: { type: Date, default: Date.now },
          },
        ],
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Social Share Count
    socialShare: {
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 },
      instagram: { type: Number, default: 0 },
    },

    // Status and Publishing
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search by slug and tags
BlogSchema.index({ slug: 1, tags: 1 });

const Blog = mongoose.model("Blog", BlogSchema);
module.exports = Blog;
