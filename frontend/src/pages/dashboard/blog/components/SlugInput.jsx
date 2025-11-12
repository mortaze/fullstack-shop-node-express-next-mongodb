export default function SlugInput({ form, setForm }) {
  return (
    <div className="bg-gray-700 p-4 rounded-xl mt-2">
      <label className="block text-gray-300 mb-1">لینک مقاله</label>
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={form.slug}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, slug: e.target.value }))
        }
      />
    </div>
  );
}
