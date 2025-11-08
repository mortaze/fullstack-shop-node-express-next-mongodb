'use client';

import DashboardLayout from '../../../../layout';
import React, { useState, useCallback, useEffect } from 'react';
import { useGetShowCategoryQuery } from '../../../../../../redux/features/categoryApi';
import { useGetActiveBrandsQuery } from '../../../../../../redux/features/brandApi';
import { useRouter } from 'next/router';
import CategoryBrandSelector from '../../../../components/products/CategoryBrandSelector';
import ProductTagsBox from '../../../../components/products/ProductTagsBox';
import ProductPublishBox from '../../../../components/products/ProductPublishBox';
import ProductShortDescriptionBox from '../../../../components/products/ProductShortDescriptionBox';
import ProductHeader from '../../../../components/products/ProductHeader';
import ProductDescriptionBox from '../../../../components/products/ProductDescriptionBox';
import ProductTitleBox from '../../../../components/products/ProductTitleBox';
import ProductDataTabs from '../../../../components/products/ProductDataTabs';
import axios from 'axios';

const EditProductDashboard = () => {
  const router = useRouter();
  const { id } = router.query; // گرفتن id از query
  const { data: categories = [], isLoading: loadingCategories } = useGetShowCategoryQuery();
  const { data: brands = [], isLoading: loadingBrands } = useGetActiveBrandsQuery();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // واکشی محصول برای ویرایش
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:7000/api/product/single-product/${id}`);
        const data = res.data;

        // تبدیل داده‌ها به ساختار frontend
        setProduct({
          title: data.title || '',
          slug: data.slug || '',
          description: data.description || '',
          sku: data.sku || '',
          productType: data.productType || 'simple',
          stockStatus: data.status || 'in-stock',
          isFeatured: data.featured || false,
          price: data.price || '',
          salePrice: data.discount || '',
          quantity: data.quantity || '',
          saleStartDate: data.offerDate?.startDate || '',
          saleEndDate: data.offerDate?.endDate || '',
          mainImage: data.img ? [data.img] : [],
          galleryImages: data.imageURLs || [],
          videoUrl: data.videoId || '',
          category: { id: data.category?.id || '', name: data.category?.name || '' },
          brand: { id: data.brand?.id || '', name: data.brand?.name || '' },
          tags: data.tags || [],
          sizes: data.sizes || [],
          colors: [],
          additionalInfo: data.additionalInformation || [{ key: '', value: '' }],
          parentProduct: data.parent || '',
          childProduct: data.children || ''
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setMessage({ type: 'error', text: 'خطا در دریافت محصول.' });
      }
    };
    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validateForm = useCallback(() => {
    if (!product) return [];
    const errors = [];
    if (!product.title || product.title.length < 3 || product.title.length > 200) errors.push('عنوان محصول نامعتبر است.');
    if (!product.price || Number(product.price) < 0) errors.push('قیمت نامعتبر است.');
    if (!product.quantity || Number(product.quantity) < 0) errors.push('تعداد نامعتبر است.');
    if (!product.mainImage?.length) errors.push('تصویر اصلی الزامی است.');
    if (!product.category?.id) errors.push('دسته‌بندی الزامی است.');
    if (!product.brand?.id) errors.push('برند الزامی است.');
    return errors;
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;

    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ type: 'error', text: 'خطاهای فرم را اصلاح کنید.' });
      console.error(errors);
      return;
    }

    setIsLoading(true);

    const payload = {
      ...product,
      price: Number(product.price),
      discount: product.salePrice ? Number(product.salePrice) : 0,
      quantity: Number(product.quantity),
      img: product.mainImage?.[0] || '',
      imageURLs: [
        ...(product.mainImage || []).map(img => ({ img: typeof img === "string" ? img : img.url || "", color: {}, sizes: [] })),
        ...(product.galleryImages || []).map(img => ({ img: typeof img === "string" ? img : img.url || "", color: {}, sizes: [] }))
      ]
    };

    try {
      const res = await axios.patch(`http://localhost:7000/api/product/edit-product/${id}`, payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'محصول با موفقیت بروزرسانی شد!' });
      } else {
        setMessage({ type: 'error', text: res.data.message || 'خطا در بروزرسانی محصول' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'خطا در ارتباط با سرور' });
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

  if (loadingCategories || loadingBrands || !product) return <div>در حال بارگذاری...</div>;

  return (
    <DashboardLayout>
      <div dir="rtl" className="min-h-screen bg-[#1e2939] text-gray-100 p-4 sm:p-6 lg:p-8 font-vazirmatn">
        <div className="max-w-7xl mx-auto">
          <ProductHeader editMode={true} />
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

export default EditProductDashboard;
