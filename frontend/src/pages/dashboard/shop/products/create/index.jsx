'use client';
import DashboardLayout from "../../../layout";
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CategoryBrandSelector from '../../../components/products/CategoryBrandSelector';
import CategoryBrandBox from '../../../components/products/CategoryBrandBox';






// استفاده از Fa icons مطابق درخواست
import { 
  FaPlus, 
  FaTrash, 
  FaUpload, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaChevronDown, 
  FaChevronUp,
  FaTag, // برای برچسب
  FaBoxes, // برای موجودی
  FaMoneyBillAlt, // برای قیمت
  FaTruck, // برای حمل و نقل
  FaCog, // برای پیشرفته
  FaRulerCombined, // برای ویژگی ها
  FaImage, // برای رسانه
  FaStore // برای برند/دسته
} from 'react-icons/fa';

// --- ابزارهای کمکی (Mock Functions) ---

// شبیه‌سازی تولید خودکار Slug
const generateSlug = (title) => {
  if (!title) return '';
  // تبدیل حروف فارسی به حروف انگلیسی/شماره و جایگزینی فاصله با خط تیره
  const transliterationMap = {
    'آ': 'a', 'ا': 'a', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ث': 's', 'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh',
    'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'z', 'ط': 't',
    'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'gh', 'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n',
    'و': 'v', 'ه': 'h', 'ی': 'y', ' ': '-',
  };

  let slug = title.toLowerCase();
  for (const [farsi, latin] of Object.entries(transliterationMap)) {
    slug = slug.split(farsi).join(latin);
  }

  return slug.replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
};

// --- کامپوننت‌های فرعی ---

// کامپوننت باز شونده (شبیه متا باکس‌های وردپرس)
const MetaBox = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#2d3748] border border-gray-700/50 rounded-lg shadow-xl mb-6 overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 cursor-pointer border-b border-gray-700/50"
        onClick={() => setIsOpen(!isOpen)}
        dir="rtl" // مطمئن می‌شویم که عنوان راست‌چین است
      >
        <h3 className="text-white text-base font-semibold">{title}</h3>
        <button className="text-gray-400 hover:text-white transition">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isOpen && (
        <div className="p-4 text-sm text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

// بخش آپلود رسانه (تصویر شاخص و گالری)
const MediaUploader = ({ title, files, setFiles, isGallery = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const newFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    if (isGallery) {
      setFiles((prev) => [...prev, ...newFiles.map(file => ({ file, url: URL.createObjectURL(file) }))]);
    } else if (newFiles.length > 0) {
      setFiles([{ file: newFiles[0], url: URL.createObjectURL(newFiles[0]) }]);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
    
    if (isGallery) {
      setFiles((prev) => [...prev, ...newFiles.map(file => ({ file, url: URL.createObjectURL(file) }))]);
    } else if (newFiles.length > 0) {
      setFiles([{ file: newFiles[0], url: URL.createObjectURL(newFiles[0]) }]);
    }
  };
  
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-dashed border-gray-600 p-4 rounded-lg bg-[#374151]">
      <div 
        className={`text-center py-8 transition-all duration-300 ${isDragging ? 'bg-indigo-900 border-indigo-500' : 'bg-[#374151]'}`}
        onDragOver={handleDragEnter}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
        <p className="text-gray-300">
          {files.length === 0 ? `تصویر/تصاویر را اینجا بکشید و رها کنید یا ` : `${files.length} فایل انتخاب شده است.`}
          <label className="text-indigo-400 cursor-pointer hover:text-indigo-300 mr-1">
             بارگذاری کنید
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple={isGallery}
              onChange={handleFileChange}
            />
          </label>
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.map((fileObj, index) => (
          <div key={index} className="relative group overflow-hidden rounded-md shadow-md">
            <img 
              src={fileObj.url} 
              alt={`پیش‌نمایش ${index + 1}`} 
              className="w-full h-24 object-cover"
            />
            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 left-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="حذف"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          </div>
        ))}
        {files.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-2">
            هنوز تصویری انتخاب نشده است.
          </div>
        )}
      </div>
    </div>
  );
};


// بخش اصلی داده‌های محصول (تب‌ها)
const ProductDataTabs = ({ product, setProduct, activeTab, setActiveTab }) => {
  
  const TABS = [
    { id: 'general', title: 'عمومی', icon: FaTag },
    { id: 'inventory', title: 'موجودی', icon: FaBoxes },
    { id: 'media', title: 'رسانه‌ها', icon: FaImage },
    { id: 'attributes', title: 'ویژگی‌ها', icon: FaRulerCombined },
    { id: 'advanced', title: 'پیشرفته', icon: FaCog },
  ];

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">اطلاعات پایه و قیمت</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* قیمت عادی */}
              <label className="block">
                <span className="text-gray-300 block mb-1">قیمت عادی (تومان) <span className="text-red-500">*</span></span>
                <input 
                  type="number" 
                  name="price"
                  value={product.price || ''}
                  onChange={handleProductChange}
                  className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="مثال: ۱۲۰۰۰۰۰"
                  min="0"
                />
              </label>
              {/* قیمت تخفیف */}
              <label className="block">
                <span className="text-gray-300 block mb-1">قیمت تخفیف (تومان)</span>
                <input 
                  type="number" 
                  name="salePrice"
                  value={product.salePrice || ''}
                  onChange={handleProductChange}
                  className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="مثال: ۱۰۰۰۰۰۰"
                  min="0"
                />
              </label>
            </div>
            {/* تاریخ شروع/پایان تخفیف (تقویم فارسی Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <label className="block">
                    <span className="text-gray-300 block mb-1">تاریخ شروع تخفیف</span>
                    <input 
                        type="text" // استفاده از نوع متنی برای شبیه‌سازی تقویم فارسی
                        name="saleStartDate"
                        value={product.saleStartDate || ''}
                        onChange={handleProductChange}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="انتخاب تاریخ (مثال: ۱۴۰۳/۰۵/۰۱)"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-300 block mb-1">تاریخ پایان تخفیف</span>
                    <input 
                        type="text" 
                        name="saleEndDate"
                        value={product.saleEndDate || ''}
                        onChange={handleProductChange}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="انتخاب تاریخ (مثال: ۱۴۰۳/۰۵/۳۱)"
                    />
                </label>
            </div>
          </div>
        );
      case 'inventory':
        return (
        
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تنظیمات موجودی</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* SKU */}
              <label className="block">
                <span className="text-gray-300 block mb-1">کد کالا (SKU)</span>
                <input 
                  type="text" 
                  name="sku"
                  value={product.sku || ''}
                  onChange={handleProductChange}
                  className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                  placeholder="یک کد منحصربه‌فرد برای محصول"
                />
              </label>
              {/* وضعیت موجودی */}
              <label className="block">
                <span className="text-gray-300 block mb-1">وضعیت موجودی <span className="text-red-500">*</span></span>
                <select 
                  name="stockStatus"
                  value={product.stockStatus}
                  onChange={handleProductChange}
                  className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="in-stock">موجود</option>
                  <option value="out-of-stock">ناموجود</option>
                  <option value="discontinued">متوقف‌شده</option>
                </select>
              </label>
            </div>
            {/* تعداد */}
            <label className="block mt-4">
              <span className="text-gray-300 block mb-1">تعداد موجود در انبار <span className="text-red-500">*</span></span>
              <input 
                type="number" 
                name="quantity"
                value={product.quantity || ''}
                onChange={handleProductChange}
                className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                placeholder="تعداد کالا"
                min="0"
              />
            </label>
          </div>
        );
      case 'media':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تصاویر و ویدیو</h4>
            <MetaBox title="تصویر اصلی محصول" defaultOpen={true}>
                <MediaUploader 
                    title="تصویر اصلی" 
                    files={product.mainImage} 
                    setFiles={(files) => setProduct(prev => ({ ...prev, mainImage: files }))} 
                    isGallery={false}
                />
            </MetaBox>
            <MetaBox title="گالری تصاویر" defaultOpen={true}>
                <MediaUploader 
                    title="گالری" 
                    files={product.galleryImages} 
                    setFiles={(files) => setProduct(prev => ({ ...prev, galleryImages: files }))} 
                    isGallery={true}
                />
            </MetaBox>
            <label className="block mt-4">
                <span className="text-gray-300 block mb-1">آدرس ویدیو (URL)</span>
                <input 
                    type="url" 
                    name="videoUrl"
                    value={product.videoUrl || ''}
                    onChange={handleProductChange}
                    className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="مثال: https://www.aparat.com/v/XXXXX"
                />
            </label>
          </div>
        );
      case 'attributes':
        // شبیه‌سازی افزودن ویژگی‌های کلید-مقدار و سایز/رنگ
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">رنگ، سایز و ویژگی‌های کلیدی</h4>
            {/* ویژگی‌های کلید-مقدار (اطلاعات اضافی) */}
            <MetaBox title="اطلاعات اضافی (کلید و مقدار)" defaultOpen={true}>
                <p className="text-xs text-gray-500 mb-3">برای ثبت اطلاعات فنی و مشخصات محصول استفاده می‌شود.</p>
                {product.additionalInfo.map((info, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={info.key}
                            onChange={(e) => {
                                const newInfo = [...product.additionalInfo];
                                newInfo[index].key = e.target.value;
                                setProduct(prev => ({ ...prev, additionalInfo: newInfo }));
                            }}
                            className="flex-1 p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white"
                            placeholder="نام ویژگی (مثال: جنس)"
                        />
                        <input
                            type="text"
                            value={info.value}
                            onChange={(e) => {
                                const newInfo = [...product.additionalInfo];
                                newInfo[index].value = e.target.value;
                                setProduct(prev => ({ ...prev, additionalInfo: newInfo }));
                            }}
                            className="flex-1 p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white"
                            placeholder="مقدار (مثال: چرم طبیعی)"
                        />
                        <button
                            onClick={() => setProduct(prev => ({ ...prev, additionalInfo: prev.additionalInfo.filter((_, i) => i !== index) }))}
                            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700"
                            title="حذف"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
                <button
                    onClick={() => setProduct(prev => ({ ...prev, additionalInfo: [...prev.additionalInfo, { key: '', value: '' }] }))}
                    className="mt-2 text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                    <FaPlus className="ml-1" /> افزودن اطلاعات جدید
                </button>
            </MetaBox>

            {/* رنگ‌ها و سایزها (ورودی چندگانه شبیه‌سازی شده) */}
            <MetaBox title="رنگ‌ها و سایزهای موجود" defaultOpen={true}>
                <p className="text-xs text-gray-500 mb-3">هر مورد را با کاما (،) جدا کنید.</p>
                <label className="block mb-4">
                    <span className="text-gray-300 block mb-1">رنگ‌ها</span>
                    <input 
                        type="text" 
                        name="colors"
                        value={product.colors.join(', ')}
                        onChange={(e) => setProduct(prev => ({ ...prev, colors: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="قرمز، آبی، مشکی"
                    />
                </label>
                <label className="block">
                    <span className="text-gray-300 block mb-1">سایزها</span>
                    <input 
                        type="text" 
                        name="sizes"
                        value={product.sizes.join(', ')}
                        onChange={(e) => setProduct(prev => ({ ...prev, sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) }))}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="S، M، L، XL"
                    />
                </label>
            </MetaBox>
          </div>
        );
      case 'advanced':
        return (
          <div dir="rtl">
            <h4 className="text-lg text-white mb-4 border-b border-gray-700 pb-2">تنظیمات پیشرفته و والد/فرزند</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* محصول والد */}
                <label className="block">
                    <span className="text-gray-300 block mb-1">محصول والد (ID)</span>
                    <input 
                        type="text" 
                        name="parentProduct"
                        value={product.parentProduct || ''}
                        onChange={handleProductChange}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="شناسه محصول والد"
                    />
                </label>
                {/* محصول فرزند */}
                <label className="block">
                    <span className="text-gray-300 block mb-1">محصول فرزند (ID)</span>
                    <input 
                        type="text" 
                        name="childProduct"
                        value={product.childProduct || ''}
                        onChange={handleProductChange}
                        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                        placeholder="شناسه محصول فرزند"
                    />
                </label>
            </div>
            {/* نوع محصول */}
            <label className="block mt-4">
              <span className="text-gray-300 block mb-1">نوع محصول</span>
              <select 
                name="productType"
                value={product.productType}
                onChange={handleProductChange}
                className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
              >
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
        {/* نوار کناری تب‌ها (سمت راست در RTL) */}
        <div className="w-full md:w-1/4 flex-shrink-0 border-b md:border-b-0 md:border-l border-gray-700/50 md:pl-4 mb-4 md:mb-0">
          <nav className="flex md:flex-col overflow-x-auto whitespace-nowrap md:whitespace-normal">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center p-3 text-sm transition-all duration-200 
                  ${activeTab === tab.id 
                    ? 'text-white bg-[#374151] font-semibold border-r-4 border-indigo-500' 
                    : 'text-gray-400 hover:text-white hover:bg-[#374151]'
                  } md:border-r-4 border-transparent`}
                dir="rtl"
              >
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
};


// --- کامپوننت اصلی داشبورد ---

const AddProductDashboard = () => {
  // --- State مدیریت محصول و UI ---
  const [product, setProduct] = useState({
    title: '',
    slug: '',
    description: '',
    sku: '',
    productType: 'simple',
    stockStatus: 'in-stock',
    isFeatured: false,
    price: null,
    salePrice: null,
    quantity: null,
    saleStartDate: '', // تاریخ فارسی Placeholder
    saleEndDate: '',   // تاریخ فارسی Placeholder
    mainImage: [], // [{file, url}]
    galleryImages: [], // [{file, url}]
    videoUrl: '',
    category: '', // ID
    brand: '', // ID
    tags: [], // ['برچسب۱', 'برچسب۲']
    sizes: [], // ['S', 'M']
    colors: [], // ['قرمز', 'آبی']
    additionalInfo: [{ key: '', value: '' }], // کلید-مقدار
    parentProduct: '',
    childProduct: '',
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'/'error', text: '' }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // برای ریسپانسیو
  
  // شبیه‌سازی داده‌های دریافتی از بک‌اند
  const [categories, setCategories] = useState([
    { id: '1', name: 'لباس' }, { id: '2', name: 'لوازم جانبی' }, { id: '3', name: 'دیجیتال' }
  ]);
  const [brands, setBrands] = useState([
    { id: 'b1', name: 'سامسونگ' }, { id: 'b2', name: 'نایکی' }, { id: 'b3', name: 'آدیداس' }
  ]);

  // --- Effect برای تولید خودکار Slug ---
  useEffect(() => {
    if (!product.slug && product.title) {
      const newSlug = generateSlug(product.title);
      setProduct(prev => ({ ...prev, slug: newSlug }));
    }
  }, [product.title]);

  // --- توابع هندلینگ ---

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // اگر کاربر خودش Slug را پاک کرد، دیگر تولید خودکار انجام نمی‌شود
    if (name === 'slug' && value === '') {
        // برای جلوگیری از لوپ: از عنوان استفاده نمی‌کنیم
    }
  };

  const validateForm = useCallback(() => {
    const errors = [];

    if (!product.title || product.title.length < 3 || product.title.length > 200) {
      errors.push('عنوان محصول الزامی است و باید بین ۳ تا ۲۰۰ کاراکتر باشد.');
    }
    if (!product.price || isNaN(Number(product.price)) || Number(product.price) < 0) {
      errors.push('قیمت عادی الزامی و باید یک عدد مثبت باشد.');
    }
    if (!product.quantity || isNaN(Number(product.quantity)) || Number(product.quantity) < 0) {
      errors.push('تعداد موجودی الزامی و باید یک عدد غیر منفی باشد.');
    }
    if (product.mainImage.length === 0) {
        errors.push('تصویر اصلی محصول الزامی است.');
    }
    if (!product.category) {
        errors.push('انتخاب دسته‌بندی الزامی است.');
    }
    if (!product.brand) {
        errors.push('انتخاب برند الزامی است.');
    }

    return errors;
  }, [product]);

  const handleSubmit = async (e, action = 'publish') => {
    e.preventDefault();
    setMessage(null);
    const errors = validateForm();

    if (errors.length > 0) {
      setMessage({ type: 'error', text: 'لطفاً خطاهای اعتبارسنجی زیر را برطرف کنید:' });
      // خطاهای کامل را در کنسول نمایش می‌دهیم
      console.error('Validation Errors:', errors); 
      return;
    }

    setIsLoading(true);

    // شبیه‌سازی ارسال داده‌ها به بک‌اند
    try {
      // در دنیای واقعی: آپلود تصاویر و سپس ارسال فرم اصلی
      const payload = {
        ...product,
        mainImage: product.mainImage.map(img => img.url),
        galleryImages: product.galleryImages.map(img => img.url),
        action: action, // 'publish' or 'draft'
      };

      // شبیه‌سازی فراخوانی API
      // const response = await fetch('/api/products/create', { method: 'POST', body: JSON.stringify(payload) });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1500)); // تأخیر شبیه‌سازی

      if (action === 'publish') {
          setMessage({ type: 'success', text: 'محصول جدید با موفقیت منتشر شد!' });
      } else {
          setMessage({ type: 'success', text: 'پیش‌نویس محصول با موفقیت ذخیره شد!' });
      }

      // ریست کردن فرم پس از موفقیت
      // setProduct(initialState); 

    } catch (error) {
      setMessage({ type: 'error', text: 'خطا در برقراری ارتباط با سرور. لطفا دوباره تلاش کنید.' });
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

  // --- رندرینگ ---
  return (  <DashboardLayout>
    <div dir="rtl" className="min-h-screen bg-[#1e2939] text-gray-100 p-4 sm:p-6 lg:p-8 font-['Inter', 'Vazirmatn', sans-serif]">
      <div className="max-w-7xl mx-auto">
        
        {/* هدر صفحه */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white mb-3 sm:mb-0">افزودن محصول جدید</h1>
          <div className="flex space-x-2 space-x-reverse">
            <button 
              onClick={(e) => handleSubmit(e, 'draft')}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-500 rounded-lg hover:bg-gray-700 transition"
              disabled={isLoading}
            >
              ذخیره پیش‌نویس
            </button>
            <button 
              onClick={(e) => handleSubmit(e, 'publish')}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-500/50 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? 'در حال ثبت...' : 'انتشار محصول'}
              <FaCheckCircle className="mr-2" />
            </button>
          </div>
        </header>

        {/* پیام‌های وضعیت (توست شبیه‌سازی شده) */}
        {message && (
          <div 
            className={`p-4 rounded-lg mb-6 flex items-center text-sm ${message.type === 'success' 
              ? 'bg-green-600 border border-green-700 text-white' 
              : 'bg-red-600 border border-red-700 text-white'
            }`}
          >
            {message.type === 'success' ? <FaCheckCircle className="ml-2 text-xl" /> : <FaExclamationTriangle className="ml-2 text-xl" />}
            <span>{message.text}</span>
            {message.type === 'error' && (
                <ul className="list-disc pr-5 mt-2 text-xs">
                    {validateForm().map((error, index) => <li key={index}>{error}</li>)}
                </ul>
            )}
          </div>
        )}
        
        {/* ساختار اصلی (شبیه به ساختار دو ستونی وردپرس) */}
        <div className="flex flex-col lg:flex-row lg:space-x-8 lg:space-x-reverse">
          
          {/* ستون اصلی محتوا (راست) */}
          <div className="flex-1 lg:w-3/4">
            
            {/* ۱. بخش عنوان محصول */}
            <div className="mb-6">
              <input
                type="text"
                name="title"
                value={product.title}
                onChange={handleInputChange}
                className="w-full p-3 text-2xl font-bold bg-[#2d3748] border-r-4 border-indigo-600 rounded-lg shadow-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="عنوان محصول را اینجا وارد کنید"
                maxLength="200"
              />
              <p className="text-xs text-gray-500 mt-2 pr-1">
                آدرس کوتاه (Slug): 
                <span className="text-indigo-400 font-mono text-left inline-block mr-1">{product.slug || 'slug-placeholder'}</span>
              </p>
            </div>

            {/* ۲. ویرایشگر متن توضیحات (شبیه‌سازی TinyMCE) */}
            <MetaBox title="توضیحات محصول" defaultOpen={true}>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="w-full h-48 p-3 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                placeholder="جزئیات و توضیحات کامل محصول (شبیه ویرایشگر پیشرفته)"
              ></textarea>
            </MetaBox>

            {/* ۳. داده‌های محصول (بخش Tabbed) */}
            <ProductDataTabs 
              product={product} 
              setProduct={setProduct} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />

            {/* ۴. اطلاعات اضافی (Bottom) - می‌توانید اینجا نیز از MetaBox استفاده کنید */}
            <MetaBox title="توضیحات کوتاه محصول" defaultOpen={true}>
                <textarea
                    name="shortDescription"
                    value={product.shortDescription || ''}
                    onChange={handleInputChange}
                    className="w-full h-24 p-3 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
                    placeholder="توضیحات مختصر محصول برای نمایش در بالای صفحه"
                ></textarea>
            </MetaBox>
          </div>

          {/* ستون کناری (چپ) */}
          <div className={`lg:w-1/4 mt-6 lg:mt-0 ${!isSidebarOpen && 'hidden lg:block'}`}>
            
            {/* دکمه جمع شدن سایدبار در موبایل */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-full p-3 mb-4 bg-indigo-600 text-white rounded-lg flex justify-center items-center hover:bg-indigo-700 transition"
            >
                {isSidebarOpen ? 'جمع کردن نوار کناری' : 'باز کردن نوار کناری'}
                {isSidebarOpen ? <FaChevronUp className="mr-2" /> : <FaChevronDown className="mr-2" />}
            </button>


            {/* ۱. باکس انتشار */}
            <MetaBox title="انتشار" defaultOpen={true}>
              <div className="space-y-3">
                <p>
                  <span className="font-semibold ml-1">وضعیت:</span> 
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stockStatus === 'in-stock' ? 'bg-green-700 text-green-100' : 'bg-red-700 text-red-100'}`}>
                    {product.stockStatus === 'in-stock' ? 'منتشر شده' : 'پیش‌نویس'}
                  </span>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("در محیط واقعی، این گزینه فعال می‌شود.");}} className="text-indigo-400 hover:text-indigo-300 mr-2 text-xs">ویرایش</a>
                </p>
                <label className="flex items-center space-x-2 space-x-reverse">
                  <input 
                    type="checkbox" 
                    name="isFeatured"
                    checked={product.isFeatured}
                    onChange={handleInputChange}
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-[#1e2939] border-gray-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-300">ویژگی ویژه (Featured)</span>
                </label>
                <div className="flex justify-between border-t border-gray-700 pt-3">
                    <button 
                        type="button" 
                        className="text-red-500 hover:text-red-400 transition text-sm"
                        onClick={() => alert("در محیط واقعی، محصول حذف خواهد شد.")}
                    >
                        انتقال به زباله‌دان
                    </button>
                    <button 
                        onClick={(e) => handleSubmit(e, 'publish')}
                        className="px-4 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? '...' : 'انتشار'}
                    </button>
                </div>
              </div>
            </MetaBox>

            {/* ۲. باکس دسته‌بندی‌ها */}

               <CategoryBrandSelector/>
  
            {/* ۳. باکس برچسب‌ها */}

            {/* <CategoryBrandBox
  product={product}
  setProduct={setProduct}
  categories={categoriesData}
  brands={brandsData}
  isLoading={isLoading}
  error={error}
/> */}

            <MetaBox title="برچسب‌های محصول" defaultOpen={true}>
                <input 
                    type="text" 
                    onKeyDown={handleTagAdd}
                    className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500" 
                    placeholder="برچسب را تایپ کنید و Enter بزنید"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                    {product.tags.map((tag, index) => (
                        <span 
                            key={index} 
                            className="flex items-center bg-indigo-700 text-indigo-100 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-600 transition"
                            onClick={() => removeTag(tag)}
                        >
                            {tag}
                            <FaTrash className="mr-1 w-3 h-3 text-indigo-200" />
                        </span>
                    ))}
                    {product.tags.length === 0 && <p className="text-gray-500 text-xs">برچسبی اضافه نشده است.</p>}
                </div>
            </MetaBox>

          </div>
        </div>
      </div>
    </div></DashboardLayout>
  );
};

export default AddProductDashboard;