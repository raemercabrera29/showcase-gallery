import ProductForm from "../components/ProductForm.jsx";
import ProductGrid from "../components/ProductGrid.jsx";

export default function ManagePage({
  products,
  editingProduct,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}) {
  return (
    <div className="animate-appear">
      <div className="mb-7">
        <span className="text-xs font-bold uppercase tracking-[.18em] text-indigo-500">
          Your workspace
        </span>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Manage Products
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Add a new product, update details, or
          remove an item from your gallery.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">
        <ProductForm
          key={editingProduct?._id || "new"}
          initialProduct={editingProduct}
          onSave={onSave}
          onCancel={onCancel}
        />

        <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900">
              Your Products{" "}
              <span className="ml-1 text-indigo-600">
                ({products.length})
              </span>
            </h2>

            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              Live gallery
            </span>
          </div>

          <div className="[&>div.grid]:lg:grid-cols-2">
            <ProductGrid
              products={products}
              showActions
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </section>
      </div>
    </div>
  );
}