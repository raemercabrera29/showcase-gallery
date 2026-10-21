import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import ProductGrid from "../components/ProductGrid.jsx";

export default function GalleryPage({
  products,
  onManage,
}) {
  return (
    <div className="animate-appear space-y-7">
      <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-600 to-cyan-500 px-7 py-10 text-white shadow-xl shadow-indigo-100 sm:px-10 sm:py-14">
        <div className="absolute -right-8 -top-24 -z-10 h-64 w-64 rounded-full border-[50px] border-white/10" />

        <div className="absolute bottom-[-8rem] right-[20%] -z-10 h-60 w-60 rounded-full bg-fuchsia-400/20 blur-2xl" />

        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.25em] text-indigo-100">
          <Sparkles size={14} />
          Our collection
        </div>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
          Discover our products
          <span className="text-cyan-200">.</span>
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100">
          Explore carefully selected products,
          browse their details, and find something
          you love.
        </p>

        <button
          onClick={onManage}
          className="mt-7 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-indigo-700 shadow-lg shadow-indigo-900/10 hover:bg-indigo-50"
        >
          Manage collection
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-[.18em] text-indigo-500">
            Browse the gallery
          </div>

          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            Our Products
          </h2>
        </div>

        <span className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
          {products.length}{" "}
          {products.length === 1
            ? "product"
            : "products"}
        </span>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}