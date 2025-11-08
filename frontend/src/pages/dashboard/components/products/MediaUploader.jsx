import React, { useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";

// --- کامپوننت پیش‌نمایش فایل ---
const FilePreview = ({ fileObj, index, removeFile }) => (
  <div className="relative group overflow-hidden rounded-md shadow-md">
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
);

// --- کامپوننت DropZone ---
const DropZone = ({ isDragging, handleDragEnter, handleDragLeave, handleDrop, files, handleFileChange, isGallery }) => (
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
);

// --- کامپوننت اصلی MediaUploader ---
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
      <DropZone 
        isDragging={isDragging}
        handleDragEnter={handleDragEnter}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        files={files}
        handleFileChange={handleFileChange}
        isGallery={isGallery}
      />

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {files.length > 0 ? (
          files.map((fileObj, index) => (
            <FilePreview key={index} fileObj={fileObj} index={index} removeFile={removeFile} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 mt-2">
            هنوز تصویری انتخاب نشده است.
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
