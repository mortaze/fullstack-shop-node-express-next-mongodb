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
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    let payload = req.body;

    // اگر تصویر جدید فرستاده شده بود
    if (req.file) {
      payload.img = req.file.path; // یا req.file.filename بسته به تنظیمات شما
    }

    const updatedCategory = await updateCategoryService(id, payload);

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      result: updatedCategory,
    });
  } catch (error) {
    next(error);
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
