const ApiError = require('../errors/api-error');
const Category = require('../model/Category');
const Products = require('../model/Products');

// create category service
exports.createCategoryService = async (data) => {
  const category = await Category.create(data);
  return category;
}

// create all category service
exports.addAllCategoryService = async (data) => {
  await Category.deleteMany()
  const category = await Category.insertMany(data);
  return category;
}

// get all show category service
exports.getShowCategoryServices = async () => {
  const category = await Category.find({status:'Show'}).populate('products');
  return category;
}

// get all category 
exports.getAllCategoryServices = async () => {
  const category = await Category.find({})
  return category;
}

// get type of category service
exports.getCategoryTypeService = async (param) => {
  const categories = await Category.find({productType:param}).populate('products');
  return categories;
}

// get type of category service
exports.deleteCategoryService = async (id) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
}

// update category
// exports.updateCategoryService = async (id, payload) => {
//   const isExist = await Category.findById(id);
//   if (!isExist) {
//     throw new ApiError(404, 'Category not found !');
//   }

//   const updated = await Category.findByIdAndUpdate(id, payload, { new: true });
//   return updated;
// };

exports.updateCategoryService = async (id, data) => {
  try {
    const updated = await Category.findByIdAndUpdate(id, data, {
      new: true, // بعد از بروزرسانی مقدار جدید برگردد
      runValidators: true, // اعتبارسنجی مدل اعمال شود
    });
    return updated;
  } catch (error) {
    console.error("❌ Error in updateCategoryService:", error);
    throw error;
  }
};



// get single category
exports.getSingleCategoryService = async (id) => {
  const result = await Category.findById(id);
  return result;
}