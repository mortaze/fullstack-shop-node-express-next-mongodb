'use client';

import DashboardLayout from '../../../layout';
import React, { useState, useCallback, useEffect } from 'react';
import { useGetShowCategoryQuery } from '../../../../../redux/features/categoryApi';
import { useGetActiveBrandsQuery } from '../../../../../redux/features/brandApi';
import CategoryBrandSelector from '../../../components/products/CategoryBrandSelector';
import ProductTagsBox from '../../../components/products/ProductTagsBox';
import ProductPublishBox from '../../../components/products/ProductPublishBox';
import ProductShortDescriptionBox from '../../../components/products/ProductShortDescriptionBox';
import ProductHeader from '../../../components/products/ProductHeader';
import ProductDescriptionBox from '../../../components/products/ProductDescriptionBox';
import ProductTitleBox from '../../../components/products/ProductTitleBox';
import ProductDataTabs from '../../../components/products/ProductDataTabs';

const generateSlug = (title) => {
  if (!title) return '';
  const transliterationMap = {
    'آ': 'a','ا': 'a','ب': 'b','پ': 'p','ت': 't','ث': 's','ج': 'j','چ': 'ch','ح': 'h','خ': 'kh',
    'د': 'd','ذ': 'z','ر': 'r','ز': 'z','ژ': 'zh','س': 's','ش': 'sh','ص': 's','ض': 'z','ط': 't',
    'ظ': 'z','ع': 'a','غ': 'gh','ف': 'f','ق': 'gh','ک': 'k','گ': 'g','ل': 'l','م': 'm','ن': 'n',
    'و': 'v','ه': 'h','ی': 'y',' ': '-'
  };
  let slug = title.toLowerCase();
  for (const [farsi, latin] of Object.entries(transliterationMap)) {
    slug = slug.split(farsi).join(latin);
  }
  return slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

const AddProductDashboard = () => {
  const { data: categories = [], isLoading: loadingCategories } = useGetShowCategoryQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetActiveBrandsQuery();

  const [product, setProduct] = useState({
    title: '', slug: '', description: '', sku: '', productType: 'simple', stockStatus: 'in-stock', isFeatured: false,
    price: '', salePrice: '', quantity: '', saleStartDate: '', saleEndDate: '', mainImage: [], galleryImages: [],
    videoUrl: '', category: { id: '', name: '' }, brand: { id: '', name: '' }, tags: [], sizes: [], colors: [], additionalInfo: [{ key: '', value: '' }],
    parentProduct: '', childProduct: ''
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!product.slug && product.title) {
      setProduct(prev => ({ ...prev, slug: generateSlug(product.title) }));
    }
  }, [product.title]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = useCallback(() => {
    const errors = [];
    if (!product.title || product.title.length < 3 || product.title.length > 200) errors.push('عنوان محصول الزامی است و باید بین ۳ تا ۲۰۰ کاراکتر باشد.');
    if (!product.price || Number(product.price) < 0) errors.push('قیمت عادی الزامی و باید یک عدد مثبت باشد.');
    if (!product.quantity || Number(product.quantity) < 0) errors.push('تعداد موجودی الزامی و باید یک عدد غیر منفی باشد.');
    if (product.mainImage.length === 0) errors.push('تصویر اصلی محصول الزامی است.');
    if (!product.category.id) errors.push('انتخاب دسته‌بندی الزامی است.');
    if (!product.brand.id) errors.push('انتخاب برند الزامی است.');
    return errors;
  }, [product]);

  const handleSubmit = async (e, action = 'publish') => {
    e.preventDefault();
    setMessage(null);

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ type: 'error', text: 'لطفاً خطاهای اعتبارسنجی زیر را برطرف کنید:' });
      console.error('Validation Errors:', errors);
      return;
    }

    setIsLoading(true);

    try {
    const payload = {
  title: product.title,
  slug: product.slug,
  description: product.description,
  sku: product.sku,
  productType: product.productType,
  status: product.stockStatus,
  featured: product.isFeatured,
  price: Number(product.price),
  discount: product.salePrice ? Number(product.salePrice) : 0,
  quantity: Number(product.quantity),
  unit: "عدد",
  videoId: product.videoUrl || '',
  tags: product.tags,
  sizes: product.sizes,
  additionalInformation: product.additionalInfo,
  parent: product.parentProduct || 'none',
  children: product.childProduct || 'none',
  category: { name: product.category.name, id: product.category.id },
  brand: { name: product.brand.name, id: product.brand.id },
  offerDate: {
    startDate: product.saleStartDate || null,
    endDate: product.saleEndDate || null
  },
  img: product.mainImage?.[0] || "", // ← این خط برای فیلد الزامی img
  imageURLs: [
    ...(product.mainImage || []).map(img => ({ img: typeof img === "string" ? img : img.url || "", color: {}, sizes: [] })),
    ...(product.galleryImages || []).map(img => ({ img: typeof img === "string" ? img : img.url || "", color: {}, sizes: [] }))
  ]
};


      console.log('Payload قبل از ارسال: ', payload);

      const response = await fetch('http://localhost:7000/api/product/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: action === 'publish' ? 'محصول منتشر شد!' : 'پیش‌نویس ذخیره شد!' });
        setProduct({
          title: '', slug: '', description: '', sku: '', productType: 'simple', stockStatus: 'in-stock', isFeatured: false,
          price: '', salePrice: '', quantity: '', saleStartDate: '', saleEndDate: '', mainImage: [], galleryImages: [],
          videoUrl: '', category: { id: '', name: '' }, brand: { id: '', name: '' }, tags: [], sizes: [], colors: [], additionalInfo: [{ key: '', value: '' }],
          parentProduct: '', childProduct: ''
        });
      } else {
        setMessage({ type: 'error', text: data.message || 'خطا در ثبت محصول' });
      }

    } catch (error) {
      console.error('Error submitting product:', error);
      setMessage({ type: 'error', text: 'خطا در برقراری ارتباط با سرور.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!product.tags.includes(newTag)) {
        setProduct(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setProduct(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  if (loadingCategories || loadingBrands) return <div>در حال بارگذاری...</div>;

  return (
    <DashboardLayout>
      <div dir="rtl" className="min-h-screen bg-[#1e2939] text-gray-100 p-4 sm:p-6 lg:p-8 font-vazirmatn">
        <div className="max-w-7xl mx-auto">
          <ProductHeader />
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-3 space-y-6">
              <ProductTitleBox product={product} setProduct={setProduct} onChange={handleInputChange} />
              <ProductDescriptionBox product={product} setProduct={setProduct} onChange={handleInputChange} />
              <ProductDataTabs product={product} setProduct={setProduct} activeTab={activeTab} setActiveTab={setActiveTab} />
              <ProductShortDescriptionBox product={product} setProduct={setProduct} onChange={handleInputChange} />
            </div>
            <div className="lg:col-span-1 space-y-6 mt-6 lg:mt-0">
              <ProductPublishBox product={product} setProduct={setProduct} handleSubmit={handleSubmit} isLoading={isLoading} message={message} />
              <CategoryBrandSelector product={product} setProduct={setProduct} categories={categories} brands={brands} />
              <ProductTagsBox product={product} setProduct={setProduct} onTagAdd={handleTagAdd} removeTag={removeTag} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddProductDashboard;
