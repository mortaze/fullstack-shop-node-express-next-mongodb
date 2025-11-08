"use client";

import React from "react";
import { FaTag, FaBoxes, FaImage, FaRulerCombined, FaCog, FaPlus, FaTrash } from "react-icons/fa";
import MetaBox from "../MetaBox";
import MediaUploader from "./MediaUploader";

export default function ProductDataTabs({ product = {}, setProduct = () => {}, activeTab, setActiveTab }) {

  const TABS = [
    { id: 'general', title: 'عمومی', icon: FaTag },
    { id: 'inventory', title: 'موجودی', icon: FaBoxes },
    { id: 'media', title: 'رسانه‌ها', icon: FaImage },
    { id: 'attributes', title: 'ویژگی‌ها', icon: FaRulerCombined },
    { id: 'advanced', title: 'پیشرفته', icon: FaCog },
  ];

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">اطلاعات پایه و قیمت</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-300 block mb-1">قیمت عادی (تومان) <span className="text-red-500">*</span></span>
                <input type="number" name="price" value={product.price || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: ۱۲۰۰۰۰۰" min="0" />
              </label>
              <label className="block">
                <span className="text-gray-300 block mb-1">قیمت تخفیف (تومان)</span>
                <input type="number" name="salePrice" value={product.salePrice || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: ۱۰۰۰۰۰۰" min="0" />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className="text-gray-300 block mb-1">تاریخ شروع تخفیف</span>
                <input type="text" name="saleStartDate" value={product.saleStartDate || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: ۱۴۰۳/۰۵/۰۱" />
              </label>
              <label className="block">
                <span className="text-gray-300 block mb-1">تاریخ پایان تخفیف</span>
                <input type="text" name="saleEndDate" value={product.saleEndDate || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="مثال: ۱۴۰۳/۰۵/۳۱" />
              </label>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تنظیمات موجودی</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-300 block mb-1">کد کالا (SKU)</span>
                <input type="text" name="sku" value={product.sku || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="یک کد منحصربه‌فرد برای محصول" />
              </label>
              <label className="block">
                <span className="text-gray-300 block mb-1">وضعیت موجودی <span className="text-red-500">*</span></span>
                <select name="stockStatus" value={product.stockStatus || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">انتخاب کنید</option>
                  <option value="in-stock">موجود</option>
                  <option value="out-of-stock">ناموجود</option>
                  <option value="discontinued">متوقف‌شده</option>
                </select>
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-300 block mb-1">تعداد موجود در انبار <span className="text-red-500">*</span></span>
              <input type="number" name="quantity" value={product.quantity || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" placeholder="تعداد کالا" min="0" />
            </label>
          </div>
        );

      case 'media':
        return (
  <div dir="rtl">
    <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تصاویر و ویدیو</h4>

    {/* تصویر شاخص با لینک */}
    <MetaBox title="تصویر اصلی محصول" defaultOpen={true}>
      <label className="block">
        <span className="text-gray-300 block mb-1">لینک تصویر اصلی</span>
        <input
          type="url"
          value={product.mainImage?.[0] || ""}
          onChange={(e) =>
            setProduct((prev) => ({
              ...prev,
              mainImage: [e.target.value], // ذخیره به عنوان آرایه شامل یک لینک
            }))
          }
          placeholder="مثال: https://example.com/image.jpg"
          className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
        />
      </label>
    </MetaBox>

    {/* گالری تصاویر */}
    <MetaBox title="گالری تصاویر" defaultOpen={true}>
      <MediaUploader
        title="گالری"
        files={product.galleryImages || []}
        setFiles={(files) => setProduct((prev) => ({ ...prev, galleryImages: files }))}
        isGallery={true}
      />
    </MetaBox>

    {/* آدرس ویدیو */}
    <label className="block mt-4">
      <span className="text-gray-300 block mb-1">آدرس ویدیو (URL)</span>
      <input
        type="url"
        name="videoUrl"
        value={product.videoUrl || ""}
        onChange={handleProductChange}
        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="مثال: https://www.aparat.com/v/XXXXX"
      />
    </label>
  </div>
);


      case 'attributes':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">ویژگی‌ها و اطلاعات اضافی</h4>
            {/* اطلاعات اضافی کلید-مقدار */}
            <MetaBox title="اطلاعات اضافی" defaultOpen={true}>
              {(product.additionalInfo || []).map((info, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={info.key} onChange={(e) => {
                    const newInfo = [...product.additionalInfo];
                    newInfo[idx].key = e.target.value;
                    setProduct(prev => ({ ...prev, additionalInfo: newInfo }));
                  }} className="flex-1 p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="نام ویژگی" />
                  <input type="text" value={info.value} onChange={(e) => {
                    const newInfo = [...product.additionalInfo];
                    newInfo[idx].value = e.target.value;
                    setProduct(prev => ({ ...prev, additionalInfo: newInfo }));
                  }} className="flex-1 p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="مقدار ویژگی" />
                  <button onClick={() => setProduct(prev => ({ ...prev, additionalInfo: prev.additionalInfo.filter((_, i) => i !== idx) }))} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700">
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button onClick={() => setProduct(prev => ({ ...prev, additionalInfo: [...(prev.additionalInfo || []), { key: '', value: '' }] }))} className="mt-2 text-indigo-400 hover:text-indigo-300 flex items-center">
                <FaPlus className="ml-1" /> افزودن اطلاعات جدید
              </button>
            </MetaBox>

            {/* رنگ‌ها و سایزها */}
            <MetaBox title="رنگ‌ها و سایزها" defaultOpen={true}>
              <label className="block mb-4">
                <span className="text-gray-300 block mb-1">رنگ‌ها</span>
                <input type="text" value={(product.colors || []).join(', ')} onChange={(e) => setProduct(prev => ({ ...prev, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="قرمز، آبی، مشکی" />
              </label>
              <label className="block">
                <span className="text-gray-300 block mb-1">سایزها</span>
                <input type="text" value={(product.sizes || []).join(', ')} onChange={(e) => setProduct(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="S، M، L، XL" />
              </label>
            </MetaBox>
          </div>
        );

      case 'advanced':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تنظیمات پیشرفته</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-300 block mb-1">محصول والد (ID)</span>
                <input type="text" name="parentProduct" value={product.parentProduct || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="شناسه محصول والد" />
              </label>
              <label className="block">
                <span className="text-gray-300 block mb-1">محصول فرزند (ID)</span>
                <input type="text" name="childProduct" value={product.childProduct || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white" placeholder="شناسه محصول فرزند" />
              </label>
            </div>
            <label className="block mt-4">
              <span className="text-gray-300 block mb-1">نوع محصول</span>
              <select name="productType" value={product.productType || ''} onChange={handleProductChange} className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white">
                <option value="simple">ساده</option>
                <option value="variable">متغیر</option>
                <option value="grouped">گروه‌بندی شده</option>
              </select>
            </label>
          </div>
        );

      default:
        return <div className="text-red-400">تب نامعتبر است.</div>;
    }
  };

  return (
    <MetaBox title="داده‌های محصول" defaultOpen={true}>
      <div className="flex flex-col md:flex-row border-t border-gray-700/50 -mt-4 pt-4">
        {/* نوار تب‌ها */}
        <div className="w-full md:w-1/4 flex-shrink-0 border-b md:border-b-0 md:border-l border-gray-700/50 md:pl-4 mb-4 md:mb-0">
          <nav className="flex md:flex-col overflow-x-auto whitespace-nowrap md:whitespace-normal">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center p-3 text-sm transition-all duration-200 ${activeTab === tab.id ? 'text-white bg-[#374151] font-semibold border-r-4 border-indigo-500' : 'text-gray-400 hover:text-white hover:bg-[#374151]'} md:border-r-4 border-transparent`} dir="rtl">
                <tab.icon className="ml-2" />
                {tab.title}
              </button>
            ))}
          </nav>
        </div>

        {/* محتوای تب */}
        <div className="w-full md:w-3/4 md:pr-4">
          <TabContent />
        </div>
      </div>
    </MetaBox>
  );
}
