const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const BlogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام دسته‌بندی الزامی است"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "اسلاگ الزامی است"],
      trim: true,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    parent: {
      type: ObjectId,
      ref: "BlogCategory",
      default: null,
    },
    status: {
      type: String,
      enum: ["Show", "Hide"],
      default: "Show",
    },
    blogs: [
      {
        type: ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const BlogCategory = mongoose.model("BlogCategory", BlogCategorySchema);
module.exports = BlogCategory;
