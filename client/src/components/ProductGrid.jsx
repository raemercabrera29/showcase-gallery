import { PackageOpen } from "lucide-react";

import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({
  products,
  showActions = false,
  onEdit,
  onDelete,
}) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 px-6 py-14 text-center">
        <PackageOpen
          size={37}
          className="text-slate-300"
        />

        <h3 className="mt-3 font-bold text-slate-700">
          No products yet
        </h3>

        <p className="mt-1 max-w-xs text-sm text-slate-400">
          Go to Manage and add your first product
          with a photo, name, price, and description.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}