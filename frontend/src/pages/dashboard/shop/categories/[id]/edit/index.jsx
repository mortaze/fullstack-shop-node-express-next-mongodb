import { useRouter } from "next/router";
import EditCategoryForm from "./EditCategoryForm";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = router.query; // ← اینطوری مقدار id رو بگیر

  if (!id) return <p>در حال بارگذاری...</p>;

  return <EditCategoryForm categoryId={id} />;
}
