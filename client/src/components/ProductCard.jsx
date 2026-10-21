import {
  Pencil,
  Trash2,
} from "lucide-react";

const pesos = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

export default function ProductCard({
  product,
  showActions = false,
  onEdit,
  onDelete,
}) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/80">
      <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-cyan-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-indigo-700 shadow-sm">
          {pesos.format(product.price)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-sm font-bold text-slate-900 sm:text-base">
          {product.name}
        </h3>

        <p className="mt-2 line-clamp-3 min-h-[3.8rem] text-xs leading-relaxed text-slate-500">
          {product.description}
        </p>

        {showActions && (
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => onEdit(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              onClick={() => onDelete(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}