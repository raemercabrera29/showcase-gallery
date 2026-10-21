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
  deleteProduct as removeProduct,
} from "./api.js";

export default function App() {
  const [products, setProducts] = useState([]);
  const [view, setView] = useState("gallery");
  const [editingProduct, setEditingProduct] =
    useState(null);
  const [productToDelete, setProductToDelete] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // LOAD PRODUCTS FROM MONGODB WHEN WEBSITE OPENS
  useEffect(() => {
    let active = true;

    getProducts()
      .then((data) => {
        if (active) {
          if (!Array.isArray(data)) {
            throw new Error(
              "The products API did not return a list."
            );
          }

          setProducts(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err.message || "Could not load products."
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // REFRESH PRODUCTS
  async function refreshProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();

      if (!Array.isArray(data)) {
        throw new Error(
          "The products API did not return a list."
        );
      }

      setProducts(data);
    } catch (err) {
      setError(
        err.message || "Could not load products."
      );
    } finally {
      setLoading(false);
    }
  }

  // ADD OR UPDATE PRODUCT IN MONGODB
  async function saveProduct(data) {
    const wasEditing = Boolean(editingProduct);

    const saved = wasEditing
      ? await updateProduct(
          editingProduct._id,
          data
        )
      : await createProduct(data);

    setProducts((current) =>
      wasEditing
        ? current.map((item) =>
            item._id === saved._id ? saved : item
          )
        : [saved, ...current]
    );

    setEditingProduct(null);
    setError("");

    setMessage(
      wasEditing
        ? "Product updated successfully!"
        : "Product added successfully!"
    );
  }

  // EDIT PRODUCT
  function editProduct(product) {
    setEditingProduct(product);
    setMessage("");
    setError("");
    setView("manage");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // DELETE PRODUCT FROM MONGODB
  async function confirmDelete() {
    if (!productToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await removeProduct(productToDelete._id);

      setProducts((current) =>
        current.filter(
          (item) =>
            item._id !== productToDelete._id
        )
      );

      if (
        editingProduct?._id ===
        productToDelete._id
      ) {
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

  // CHANGE BETWEEN GALLERY AND MANAGE
  function changeView(nextView) {
    setView(nextView);
    setMessage("");
  }

  function askDelete(product) {
    setProductToDelete(product);
    setDeleteError("");
  }

  return (
    <div className="flex min-h-screen flex-col">
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

        {/* API ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
          >
            <span className="flex items-start gap-2">
              <AlertCircle
                className="mt-0.5 shrink-0"
                size={18}
              />
              {error}
            </span>

            <button
              type="button"
              onClick={refreshProducts}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Retry
            </button>
          </div>
        )}

        {/* PAGE CONTENT */}
        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-white py-16 text-sm font-semibold text-slate-600">
            <LoaderCircle
              className="animate-spin text-indigo-600"
              size={22}
            />
            Loading products from MongoDB...
          </div>
        ) : view === "gallery" ? (
          <GalleryPage
            products={products}
            onManage={() =>
              changeView("manage")
            }
          />
        ) : (
          <ManagePage
            products={products}
            editingProduct={editingProduct}
            onSave={saveProduct}
            onCancel={() =>
              setEditingProduct(null)
            }
            onEdit={editProduct}
            onDelete={askDelete}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-5 text-center text-xs text-slate-400">
        Made by{" "}
        <strong className="text-slate-600">
          [Your Name]
        </strong>{" "}
        · [Section] · ShowCase Product Gallery
      </footer>

      {/* DELETE CONFIRMATION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-heading"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600">
              <Trash2 size={22} />
            </span>

            <h2
              id="delete-heading"
              className="mt-4 text-xl font-extrabold text-slate-900"
            >
              Delete this product?
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Remove “{productToDelete.name}”
              from your MongoDB database?
            </p>

            {deleteError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700"
              >
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() =>
                  setProductToDelete(null)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {deleting && (
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}