"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaChartBar,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaCogs,
  FaComments,
  FaFileAlt,
  FaFlask,
  FaHome,
  FaMoneyCheckAlt,
  FaPercent,
  FaPlusCircle,
  FaRegDotCircle,
  FaRegEdit,
  FaShoppingBag,
  FaShoppingBasket,
  FaStore,
  FaTags,
  FaThList,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { MdFeaturedPlayList } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
const menuItems = [
  { label: "داشبورد", icon: <FaHome />, href: "/dashboard" },
  {
    label: "فروشگاه",
    icon: <FaShoppingBag />,
    href: "/dashboard/shop",
    subMenu: [
      {
        label: "سفارشات",
        icon: <FaClipboardList />,
        href: "/dashboard/shop/orders",
      },
      {
        label: "مشتریان",
        icon: <FaUsers />,
        href: "/dashboard/shop/customers",
      },
      {
        label: "فرم پرداخت",
        icon: <FaMoneyCheckAlt />,
        href: "/dashboard/shop/payment-form",
      },
      {
        label: "گزارشات",
        icon: <FaChartBar />,
        href: "/dashboard/shop/reports",
      },
      {
        label: "پیکربندی",
        icon: <FaCogs />,
        href: "/dashboard/shop/settings",
      },
    ],
  },
  {
    label: "محصولات",
    icon: <FaBoxOpen />,
    href: "/dashboard/shop/products",
    subMenu: [
      {
        label: "افزودن محصول جدید",
        icon: <FaPlusCircle />,
        href: "/dashboard/shop/products/create",
      },
      {
        label: "همه محصولات",
        icon: <FaThList />,
        href: "/dashboard/shop/products",
      },
      {
        label: "دسته‌بندی‌ها",
        icon: <TbCategoryFilled />,
        href: "/dashboard/shop/categories",
      },
      {
        label: "برچسب‌ها",
        icon: <FaTags />,
        href: "/dashboard/shop/tags",
      },
      {
        label: "ویژگی‌ها",
        icon: <MdFeaturedPlayList />,
        href: "/dashboard/shop/features",
      },
      {
        label: "دیدگاه‌ها",
        icon: <FaComments />,
        href: "/dashboard/shop/comments",
      },
      {
        label: "کدهای تخفیف",
        icon: <FaPercent />,
        href: "/dashboard/shop/discounts",
      },
    ],
  },
  {
    label: "وبلاگ",
    icon: <IoNewspaperOutline />,
    href: "/dashboard/blog",
    subMenu: [
      {
        label: "همه مقاله‌ها",
        icon: <FaThList />,
        href: "/dashboard/blog",
      },
      {
        label: "مقاله جدید",
        icon: <FaPlusCircle />,
        href: "/dashboard/blog/create",
      },
      {
        label: "دسته‌ها",
        icon: <TbCategoryFilled />,
        href: "/dashboard/blog/categories",
      },
      {
        label: "برچسب‌ها",
        icon: <FaTags />,
        href: "/dashboard/blog/tags",
      },
    ],
  },
  {
    label: "صفحات سفارشی",
    icon: <FaFileAlt />,
    href: "/dashboard/pages",
  },
  {
    label: "بنرها / اسلایدر",
    icon: <FaShoppingBasket />,
    href: "/dashboard/banners",
  },
  {
    label: "اعلان‌ها",
    icon: <FaRegDotCircle />,
    href: "/dashboard/notifications",
  },
  {
    label: "پیام‌ها / درخواست‌ها",
    icon: <MdFeaturedPlayList />,
    href: "/dashboard/messages",
  },
  {
    label: "نقش‌ها و ادمین‌ها",
    icon: <FaUsers />,
    href: "/dashboard/roles",
  },
  {
    label: "تنظیمات سایت",
    icon: <FaCogs />,
    href: "/dashboard/settings",
  },
  
];

 


function MenuItem({ item, pathname, onClose, level = 0 }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (item.subMenu) {
      const matchSub = item.subMenu.some(
        (sub) => pathname === sub.href || pathname.startsWith(sub.href)
      );
      if (matchSub) setOpen(true);
    }
  }, [pathname, item.subMenu]);

  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  const paddingRight = 16 + level * 12;
  const fontSize = `${Math.max(14 - level * 2, 10)}px`;

  if (item.subMenu) {
    return (
      <li>
        <div
          className={`flex items-center justify-between rounded-lg p-2 hover:bg-gray-700 ${
            isActive ? "bg-gray-800 text-green-400" : "text-gray-300"
          }`}
          style={{ paddingRight }}
        >
          {/* لینک اصلی که کاربر رو هدایت می‌کنه */}
          <Link
            href={item.href}
            className="flex items-center gap-3 flex-1"
            onClick={onClose}
          >
            {item.icon}
            <span className="text-sm font-medium" style={{ fontSize }}>
              {item.label}
            </span>
          </Link>

          {/* آیکن باز/بستن زیرمنو فقط اینجا */}
          <button
            type="button"
            className="text-gray-400 hover:text-green-400 p-1"
            onClick={() => setOpen(!open)}
          >
            {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>

        {open && (
          <ul className="mt-1 space-y-1">
            {item.subMenu.map((sub, i) => (
              <MenuItem
                key={i}
                item={sub}
                pathname={pathname}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // حالت بدون زیرمنو
  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg p-2 hover:bg-gray-700 ${
          isActive ? "bg-gray-800 text-green-400" : "text-gray-300"
        }`}
        style={{ paddingRight }}
        onClick={onClose}
      >
        {item.icon}
        <span className="text-sm font-medium" style={{ fontSize }}>
          {item.label}
        </span>
      </Link>
    </li>
  );
}

export default function Sidebar({ isMobileOpen, onClose }) {
  const pathname = usePathname();

  useEffect(() => {
    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    const toggleSidebar = () => {
      if (window.innerWidth >= 1024) {
        sidebar.classList.toggle("lg:w-20");
        sidebar.classList.toggle("lg:w-56");
        mainContent.classList.toggle("lg:mr-20");
        mainContent.classList.toggle("lg:mr-56");
      }
    };

    sidebarLogo?.addEventListener("click", toggleSidebar);
    return () => sidebarLogo?.removeEventListener("click", toggleSidebar);
  }, []);

  return (
    <div
      id="sidebar"
      className={`
        fixed top-0 right-0 h-full w-56 z-50 bg-gray-900 text-white flex-col
        transition-transform duration-300
        transform
        ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        lg:translate-x-0 lg:flex
      `}
    >
      <div className="flex items-center justify-between p-4">
        <div
          id="sidebarLogo"
          className="flex items-center gap-2 cursor-pointer text-green-400 font-bold text-xl"
        >
          <FaStore />
          <span className="sidebar-title">پنل فروشگاه</span>
        </div>

        <button onClick={onClose} className="lg:hidden text-2xl text-gray-300">
          <FaTimes />
        </button>
      </div>

      <ul className="mt-4 space-y-2 px-2">
        {menuItems.map((item, i) => (
          <MenuItem key={i} item={item} pathname={pathname} onClose={onClose} />
        ))}
      </ul>
    </div>
  );
}



















