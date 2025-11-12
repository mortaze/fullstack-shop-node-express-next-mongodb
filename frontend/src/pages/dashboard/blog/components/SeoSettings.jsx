"use client";

import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Switch } from "../../components/ui/switch";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";

const schemaTypes = [
  "مقاله",
  "محصول",
  "نقد",
  "دستور غذا",
  "رویداد",
  "شخص",
  "سازمان",
  "سوال و جواب",
];

const SeoSettings = () => {
  // States عمومی
  const [mainKeyword, setMainKeyword] = useState("");
  // States پیشرفته
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [breadcrumbTitle, setBreadcrumbTitle] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [metaSettings, setMetaSettings] = useState({
    index: true,
    follow: true,
    noarchive: false,
    noimageindex: false,
    nosnippet: false,
  });
  // States اسکیما
  const [selectedSchema, setSelectedSchema] = useState(schemaTypes[0]);
  const [schemaJson, setSchemaJson] = useState("");

  const toggleMeta = (key) => {
    setMetaSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // مدیریت تب‌ها
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className=" mx-auto p-6 rounded shadow ">
      {/* هدر تب‌ها */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={` text-gray-300 flex-1 py-3 text-center font-semibold ${
            activeTab === 1
              ? "border-b-4 border-green-500 text-green-600"
              : "text-gray-600 hover:text-green-500"
          }`}
          onClick={() => setActiveTab(1)}
        >
          عمومی
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            activeTab === 2
              ? "border-b-4 border-orange-500 text-orange-600"
              : "text-gray-600 hover:text-orange-500"
          }`}
          onClick={() => setActiveTab(2)}
        >
          پیشرفته
        </button>
        <button
          className={`flex-1 py-3 text-center font-semibold ${
            activeTab === 3
              ? "border-b-4 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-blue-500"
          }`}
          onClick={() => setActiveTab(3)}
        >
          اسکیما
        </button>
      </div>

      {/* محتوای تب فعال */}
      <div>
        {/* بخش عمومی */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-green-500 pl-3">
              عمومی
            </h2>

            <div className="space-y-4">
              {/* کلمه کلیدی اصلی */}
              <div className="space-y-1">
                <Label>کلمه کلیدی اصلی</Label>
                <Input
                  placeholder="مثلاً: خرید سرور مجازی"
                  value={mainKeyword}
                  onChange={(e) => setMainKeyword(e.target.value)}
                />
              </div>

              {/* چک‌لیست سئو */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">چک‌لیست سئو</h3>
                <ul className="space-y-1 text-sm max-h-48 overflow-y-auto pr-3">
                  {[
                    "کلمه کلیدی در عنوان مقاله",
                    "کلمه کلیدی در توضیحات متا",
                    "کلمه کلیدی در URL",
                    "کلمه کلیدی در اولین پاراگراف",
                    "کلمه کلیدی در متن مقاله",
                    "کلمه کلیدی در تگ‌های H2 یا H3",
                    "کلمه کلیدی در alt تصاویر",
                    "چگالی مناسب کلمه کلیدی (1%)",
                    "استفاده از لینک داخلی",
                    "استفاده از لینک خارجی DoFollow",
                    "طول مقاله بیش از ۶۰۰ کلمه",
                    "استفاده از تصویر یا ویدیو",
                    "استفاده از جدول محتوا (TOC)",
                    "پاراگراف‌های کوتاه و قابل خواندن",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* بخش پیشرفته */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-3">
              پیشرفته
            </h2>

            {/* تنظیمات Meta Robots */}
            <div className="space-y-4 mb-6">
              <h3 className="font-semibold text-lg mb-3">
                تنظیمات Meta Robots
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: "index", label: "Index / NoIndex" },
                  { key: "follow", label: "Follow / NoFollow" },
                  { key: "noarchive", label: "NoArchive" },
                  { key: "noimageindex", label: "NoImageIndex" },
                  { key: "nosnippet", label: "NoSnippet" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <Switch
                      checked={metaSettings[item.key]}
                      onCheckedChange={() => toggleMeta(item.key)}
                    />
                    <Label>{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* آدرس‌های پیشرفته */}
            <div className="space-y-4 max-w-lg">
              <h3 className="font-semibold text-lg mb-3">آدرس‌های پیشرفته</h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>URL متعارف (Canonical)</Label>
                  <Input
                    placeholder="https://example.com/blog/sample-post"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label>عنوان مسیر راهنما (Breadcrumb Title)</Label>
                  <Input
                    value={breadcrumbTitle}
                    onChange={(e) => setBreadcrumbTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label>تغییر مسیر 301 (Redirect)</Label>
                  <Input
                    placeholder="https://example.com/new-post-url"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* بخش اسکیما */}
        {activeTab === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 border-l-4 border-blue-500 pl-3">
              اسکیما
            </h2>

            {/* انتخاب نوع اسکیما */}
            <div className="max-w-sm mb-6">
              <Label>نوع اسکیما</Label>
              <select
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
              >
                {schemaTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* نمایش پیش‌نمایش JSON-LD */}
            <div>
              <Label>پیش‌نمایش JSON-LD</Label>
              <Textarea
                rows={8}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "${selectedSchema}",
  ...
}`}
                value={schemaJson}
                onChange={(e) => setSchemaJson(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeoSettings;
