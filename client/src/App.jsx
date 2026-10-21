import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import Navbar from "./components/Navbar.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import ManagePage from "./pages/ManagePage.jsx";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct as deleteProductAPI,
} from "./api.js";

export default function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("gallery");

  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // LOAD PRODUCTS FROM MONGODB
  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (active) {
          if (!Array.isArray(data)) {
            throw new Error("Invalid product list.");
          }

          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message || "Could not load products.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  // RELOAD PRODUCTS
  async function reloadProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error("Invalid product list.");
      }

      setProducts(data);
    } catch (err) {
      setError(err.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  // ADD OR UPDATE PRODUCT
  async function saveProduct(data) {
    const isEditing = Boolean(editingProduct);

    const savedProduct = isEditing
      ? await updateProduct(editingProduct._id, data)
      : await createProduct(data);

    if (isEditing) {
      setProducts((previous) =>
        previous.map((product) =>
          product._id === savedProduct._id
            ? savedProduct
            : product
        )
      );

      setMessage("Product updated successfully!");
    } else {
      setProducts((previous) => [
        savedProduct,
        ...previous,
      ]);

      setMessage("Product added successfully!");
    }

    setEditingProduct(null);
    setError("");
  }

  // SELECT PRODUCT TO EDIT
  function startEdit(product) {
    setEditingProduct(product);
    setView("manage");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // OPEN DELETE CONFIRMATION
  function startDelete(product) {
    setProductToDelete(product);
    setDeleteError("");
  }

  // DELETE PRODUCT FROM MONGODB
  async function confirmDelete() {
    if (!productToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteProductAPI(productToDelete._id);

      setProducts((previous) =>
        previous.filter(
          (product) =>
            product._id !== productToDelete._id
        )
      );

      if (editingProduct?._id === productToDelete._id) {
        setEditingProduct(null);
      }

      setProductToDelete(null);
      setMessage("Product deleted successfully!");
      setError("");
    } catch (err) {
      setDeleteError(
        err.message || "Could not delete product."
      );
    } finally {
      setDeleting(false);
    }
  }

  // SWITCH BETWEEN GALLERY AND MANAGE
  function changeView(nextView) {
    setView(nextView);
    setMessage("");
  }

  return (
    <div className="flex min-h-screen flex-col">

      {/* NAVIGATION */}
      <Navbar
        view={view}
        onChangeView={changeView}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-9 sm:px-8 sm:py-11">

        {/* SUCCESS MESSAGE */}
        {message && (
          <div
            role="status"
            className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              {message}
            </span>

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span className="flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </span>

            <button
              type="button"
              onClick={reloadProducts}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-semibold hover:bg-red-100"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {/* PAGE CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white py-16 text-sm font-semibold text-slate-600">
            <LoaderCircle
              size={22}
              className="animate-spin text-indigo-600"
            />

            Loading products from MongoDB...
          </div>
        ) : view === "gallery" ? (
          <GalleryPage
            products={products}
            onManage={() => changeView("manage")}
          />
        ) : (
          <ManagePage
            products={products}
            editingProduct={editingProduct}
            onSave={saveProduct}
            onCancel={() => setEditingProduct(null)}
            onEdit={startEdit}
            onDelete={startDelete}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-400">
        Made by{" "}
        <strong className="text-slate-600">
          [John Raemer Cabrera]
        </strong>
        {" "}· [INF239] · ShowCase Product Gallery
      </footer>

      {/* DELETE CONFIRMATION */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 size={22} />
            </span>

            <h2
              id="delete-title"
              className="mt-4 text-xl font-bold text-slate-900"
            >
              Delete Product?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{" "}
              <strong>{productToDelete.name}</strong>?
            </p>

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setProductToDelete(null)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}