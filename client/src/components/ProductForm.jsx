import { useState } from "react";

import {
  Check,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

import ImageUpload from "./ImageUpload.jsx";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

export default function ProductForm({
  initialProduct,
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    price: initialProduct?.price?.toString() || "",
    description: initialProduct?.description || "",
    image: initialProduct?.image || "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const editing = Boolean(initialProduct);

  function change(key, value) {
    setForm((old) => ({
      ...old,
      [key]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!form.image) {
      return setError(
        "Please upload a product image."
      );
    }

    if (!name) {
      return setError(
        "Product name is required."
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return setError(
        "Enter a price greater than zero."
      );
    }

    if (!description) {
      return setError(
        "Enter a product description."
      );
    }

    setSaving(true);

    try {
      await onSave({
        name,
        price,
        description,
        image: form.image,
      });

      if (!editing) {
        setForm({
          name: "",
          price: "",
          description: "",
          image: "",
        });
      }
    } catch (err) {
      setError(
        err.message || "Could not save the product."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">
            {editing ? "Edit product" : "Add a product"}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {editing
              ? "Update the selected product."
              : "Fill in all fields below."}
          </p>
        </div>

        <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
          {editing ? (
            <Check size={20} />
          ) : (
            <Plus size={20} />
          )}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700">
            Product image{" "}
            <span className="text-rose-500">*</span>
          </label>

          <div className="mt-1.5">
            <ImageUpload
              image={form.image}
              onChange={(image) =>
                change("image", image)
              }
              onError={setError}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="product-name"
            className="text-xs font-bold text-slate-700"
          >
            Name{" "}
            <span className="text-rose-500">*</span>
          </label>

          <input
            id="product-name"
            className={inputClass}
            type="text"
            maxLength={80}
            placeholder="e.g. Wireless Headphones"
            value={form.name}
            onChange={(event) =>
              change("name", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="product-price"
            className="text-xs font-bold text-slate-700"
          >
            Price (PHP){" "}
            <span className="text-rose-500">*</span>
          </label>

          <input
            id="product-price"
            className={inputClass}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 1499"
            value={form.price}
            onChange={(event) =>
              change("price", event.target.value)
            }
            required
          />
        </div>

        <div>
          <label
            htmlFor="product-desc"
            className="text-xs font-bold text-slate-700"
          >
            Description{" "}
            <span className="text-rose-500">*</span>
          </label>

          <textarea
            id="product-desc"
            className={`${inputClass} min-h-28 resize-y`}
            maxLength={300}
            placeholder="Write 1–2 sentences describing your product."
            value={form.description}
            onChange={(event) =>
              change("description", event.target.value)
            }
            required
          />

          <div className="mt-1 text-right text-[11px] text-slate-400">
            {form.description.length}/300
          </div>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700"
        >
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle
              className="animate-spin"
              size={16}
            />
          ) : (
            <Check size={16} />
          )}

          {saving
            ? "Saving..."
            : editing
            ? "Update product"
            : "Add product"}
        </button>

        {editing && (
          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <X size={15} />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}