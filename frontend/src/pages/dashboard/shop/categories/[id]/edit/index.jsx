import { useRouter } from "next/router";
// آدرس را بر اساس ساختار Pages Router خود تنظیم کنید
import EditCategoryForm from "./EditCategoryForm"; 

export default function EditCategoryPage() {
  // 1. دریافت ID از Pages Router
  const router = useRouter();
  const { id } = router.query;

  // تا زمانی که ID دریافت نشده، حالت Loading را نشان دهید
  if (!id) {
    return (
      <div className="text-center p-8 text-gray-400">
        در حال بارگذاری شناسه مسیر...
      </div>
    );
  }

  // 2. ارسال ID با نام صحیح (categoryId) به کامپوننت فرم
  return <EditCategoryForm categoryId={id} />;
}