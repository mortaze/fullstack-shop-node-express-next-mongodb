const {
  createCategoryService,
  addAllCategoryService,
  getShowCategoryServices,
  getAllCategoryServices,
  getCategoryTypeService,
  deleteCategoryService,
  updateCategoryService,
  getSingleCategoryService,
} = require("../services/category.service");

const Category = require("../model/Category");

// 🟢 Add a new category
exports.addCategory = async (req, res, next) => {
  try {
    const result = await createCategoryService(req.body);
    res.status(200).json({
      status: "success",
      message: "Category created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// 🟢 Add multiple categories
exports.addAllCategory = async (req, res, next) => {
  try {
    const result = await addAllCategoryService(req.body);
    res.status(200).json({
      status: "success",
      message: "All categories added successfully!",
      result,
    });
  } catch (error) {
    next(error);
  }
};


// 🟢 Get categories for front-end (show)
exports.getShowCategory = async (req, res, next) => {
  try {
    const result = await getShowCategoryServices();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};


// 🟢 Get all categories (for admin dashboard)
exports.getAllCategory = async (req, res, next) => {
  try {
    const result = await getAllCategoryServices();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};


// 🟢 Get categories by product type
exports.getProductTypeCategory = async (req, res, next) => {
  try {
    const result = await getCategoryTypeService(req.params.type);
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};


// 🔴 Delete a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const result = await deleteCategoryService(req.params.id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      result,
    });
  } catch (error) {
    next(error);
  }
};


// 🟡 Update a category (handles both text & image updates)
exports.updateCategory = async (req, res) => {
  try {
    console.log("--- updateCategory request ---");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { parent, parentId, children, productType, status } = req.body;

    const updateData = {
      parent,
      parentId,
      productType,
      status,
      children: children ? JSON.parse(children) : [],
    };

    if (req.file) {
      // اگر فایلی ارسال شده
      updateData.img = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: "دسته مورد نظر یافت نشد." });
    }

    res.json({ success: true, result: updatedCategory });
  } catch (error) {
    console.error("❌ updateCategory error:", error);
    res.status(500).json({ success: false, message: "خطا در بروزرسانی دسته‌بندی" });
  }
};



// 🟢 Get single category by ID
exports.getSingleCategory = async (req, res, next) => {
  try {
    const result = await getSingleCategoryService(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
};
