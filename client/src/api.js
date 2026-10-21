const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

async function request(path = "", options = {}) {
  let response;

  try {
    response = await fetch(
      `${API_URL}/api/products${path}`,
      {
        ...options,
        headers: {
          ...(options.body
            ? { "Content-Type": "application/json" }
            : {}),
          ...options.headers,
        },
      }
    );
  } catch {
    throw new Error(
      "Cannot connect to the API. Check your Render URL."
    );
  }

  const raw = await response.text();

  let data = null;

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("Invalid response from server.");
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}

// GET ALL PRODUCTS
export function getProducts() {
  return request("");
}

// CREATE PRODUCT
export function createProduct(data) {
  return request("", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// UPDATE PRODUCT
export function updateProduct(id, data) {
  return request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE PRODUCT
export function deleteProduct(id) {
  return request(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}