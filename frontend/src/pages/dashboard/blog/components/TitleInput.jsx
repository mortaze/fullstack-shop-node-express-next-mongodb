export default function TitleInput({ form, setForm, generateSlug }) {
  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-1">عنوان مقاله</label>
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={form.title}
        onChange={(e) => {
          const newTitle = e.target.value;
          setForm((prev) => ({
            ...prev,
            title: newTitle,
            slug: generateSlug(newTitle),
          }));
        }}
      />
    </div>
  );
}
