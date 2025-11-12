import EditCategoryForm from "./EditCategoryForm";

export default function EditCategoryPage({ params }) {
  return <EditCategoryForm categoryId={params.id} />;
}
