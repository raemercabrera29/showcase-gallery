// VITE_API_URL should be your Render backend URL
// in production, without /api/products at the end.

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

async function request(path = "", options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}/api/products${path}`, {
      ...options,
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the product API. Check your backend URL, Render status, and CORS configuration."
    );
  }

  const raw = await response.text();
  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error(
        "The server returned an invalid JSON response."
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        `Request failed (${response.status}).`
    );
  }

  return data;
}

// GET ALL PRODUCTS
export function getProducts() {
  return request();
}

// ADD PRODUCT
export function createProduct(product) {
  return request("", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

// UPDATE PRODUCT
export function updateProduct(id, product) {
  return request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

// DELETE PRODUCT
export function deleteProduct(id) {
  return request(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}