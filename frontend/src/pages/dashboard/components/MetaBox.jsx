"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const MetaBox = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#2d3748] border border-gray-700/50 rounded-lg shadow-xl mb-6 overflow-hidden">
      {/* هدر متاباکس */}
      <div
        className="flex justify-between items-center p-3 cursor-pointer border-b border-gray-700/50 select-none"
        onClick={() => setIsOpen(!isOpen)}
        dir="rtl"
      >
        <h3 className="text-white text-base font-semibold">{title}</h3>
        <button className="text-gray-400 hover:text-white transition">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* محتوای متاباکس */}
      {isOpen && (
        <div className="p-4 text-sm text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default MetaBox;
