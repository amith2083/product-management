//  Frontend page protection
(function checkAuth() {
  const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (isLoggedIn !== "true") {
    window.location.href = "/login";
  }
})();
// Global state
let currentPage = 1;
let searchTerm = "";
let isEditMode = false;
let currentProductId = null;

// DOM Elements
const elements = {

//logout
  logoutBtn: document.getElementById("logoutBtn"),
 

  // Statistics
  totalProducts: document.getElementById("totalProducts"),
  totalValue: document.getElementById("totalValue"),
  totalQuantity: document.getElementById("totalQuantity"),
  avgPrice: document.getElementById("avgPrice"),

  // Product management
  searchInput: document.getElementById("searchInput"),
  addProductBtn: document.getElementById("addProductBtn"),
  productsTableBody: document.getElementById("productsTableBody"),
  pagination: document.getElementById("pagination"),

  // Modal
  productModal: document.getElementById("productModal"),
  modalTitle: document.getElementById("modalTitle"),
  closeModal: document.getElementById("closeModal"),
  cancelBtn: document.getElementById("cancelBtn"),
  productForm: document.getElementById("productForm"),
  saveProductBtn: document.getElementById("saveProductBtn"),

  // Form fields
  productId: document.getElementById("productId"),
  productName: document.getElementById("productName"),
  productDescription: document.getElementById("productDescription"),
  productPrice: document.getElementById("productPrice"),
  productQuantity: document.getElementById("productQuantity"),
  productCategory: document.getElementById("productCategory"),
  productImage: document.getElementById("productImage"),
  imagePreview: document.getElementById("imagePreview"),
  productStatus: document.getElementById("productStatus"),
  statusGroup: document.getElementById("statusGroup"),

  // Toast
  toast: document.getElementById("toast"),
};

// Initialize dashboard on page load

document.addEventListener("DOMContentLoaded", async function () {
 
  initializeEventListeners();
  loadProducts();
  loadStatistics();
});



//Initialize all event listeners
function initializeEventListeners() {
  // Logout
  elements.logoutBtn.addEventListener("click", handleLogout);

  // Search
  elements.searchInput.addEventListener("input", debounce(handleSearch, 500));

  // Add product
  elements.addProductBtn.addEventListener("click", openAddProductModal);

  // Modal close
  elements.closeModal.addEventListener("click", closeModal);
  elements.cancelBtn.addEventListener("click", closeModal);

  // Form submission
  elements.productForm.addEventListener("submit", handleProductSubmit);

  // Close modal on backdrop click
  elements.productModal.addEventListener("click", (e) => {
    if (e.target === elements.productModal) {
      closeModal();
    }
  });
}



async function handleLogout() {
  localStorage.removeItem("isAdminLoggedIn");
  localStorage.removeItem("adminUser");
  window.location.href = "/login";
}

//Load statistics

async function loadStatistics() {
  try {
   const response = await fetch("/api/reports/summary");

    if (!response.success) throw new Error("Failed to fetch stats");

    const data = await response.json();

    const stats = data?.data || {};

    elements.totalProducts.textContent = stats.totalProducts ?? 0;
    elements.totalQuantity.textContent = stats.totalQuantity ?? 0;
    elements.totalValue.textContent =
      "₹" + Number(stats.totalValue ?? 0).toLocaleString("en-IN");

  } catch (error) {
    console.error("Statistics error:", error);
      //  Fallback UI
    elements.totalProducts.textContent = "—";
    elements.totalQuantity.textContent = "—";
    elements.totalValue.textContent = "₹—";
  
  }
}

// Load products with pagination

async function loadProducts() {
  try {
    const params = new URLSearchParams({
      page: currentPage,
      limit: 10,
      search: searchTerm,
    });

    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();

    if (data.success) {
      displayProducts(data.data);
      displayPagination(data.pagination);
    }
  } catch (error) {
    console.error("Load products error:", error);
    elements.productsTableBody.innerHTML = `
            <tr><td colspan="8" class="text-center">Error loading products</td></tr>
        `;
  }
}

function displayProducts(products=[]) {
  if (products.length === 0) {
    elements.productsTableBody.innerHTML = `
            <tr><td colspan="8" class="text-center">No products found</td></tr>
        `;
    return;
  }

  elements.productsTableBody.innerHTML = products
    .map((product, index) => {
      const stockBadge =
        product.stock_quantity < 10
          ? '<span class="badge badge-danger">Low Stock</span>'
          : product.stock_quantity < 50
            ? '<span class="badge badge-warning">Medium</span>'
            : '<span class="badge badge-success">Good</span>';
      const statusBadge = product.is_active
        ? '<span class="badge badge-success">Active</span>'
        : '<span class="badge badge-danger">Inactive</span>';

      return `
          <tr class="${!product.is_active ? "row-inactive" : ""}">
                <td>${index + 1}</td>
                <td>${escapeHtml(product.name)}</td>
                <td>  <img 
                    src="${product.image}" 
                    alt="${escapeHtml(product.name)}"
                    width="60"
                    height="60"
                    style="object-fit:cover;border-radius:8px;"
                /></td>
              
                <td>₹${parseFloat(product.price).toFixed(2)}</td>
                
                <td>${product.category || "-"}</td>
                <td>${product.stock_quantity} ${stockBadge}</td>
                <td> ${statusBadge}</td>
                
                <td>
                    <div class="action-buttons">
                       ${
                         product.is_active
                           ? `
            <button class="btn-icon btn-edit" onclick="editProduct(${product.id})">✏️</button>
            <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})">🗑️</button>
          `
                           : `
            <button class="btn-icon btn-edit" onclick="editProduct(${product.id})">✏️</button>
          `
                       }
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");
}

//Display pagination controls

function displayPagination(pagination) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) {
    elements.pagination.innerHTML = "";
    return;
  }

  let html = `
        <button onclick="goToPage(${page - 1})" ${page === 1 ? "disabled" : ""}>
            ← Previous
        </button>
    `;

  // Show page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
      html += `
                <button 
                    onclick="goToPage(${i})" 
                    class="${i === page ? "active" : ""}"
                >
                    ${i}
                </button>
            `;
    } else if (i === page - 3 || i === page + 3) {
      html += "<span>...</span>";
    }
  }

  html += `
        <button onclick="goToPage(${page + 1})" ${page === totalPages ? "disabled" : ""}>
            Next →
        </button>
    `;

  elements.pagination.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  loadProducts();
}

// Handle search input

function handleSearch() {
  searchTerm = elements.searchInput.value.trim();
  currentPage = 1;
  loadProducts();
}

// Open add product modal

function openAddProductModal() {
  isEditMode = false;
  currentProductId = null;
  elements.modalTitle.textContent = "Add Product";
  elements.productForm.reset();

  //  RESET IMAGE PREVIEW
  elements.imagePreview.src = "";
  elements.imagePreview.style.display = "none";

  //  RESET FILE INPUT (important)
  elements.productImage.value = "";
  elements.statusGroup.style.display = "none";
  elements.productModal.classList.add("active");
}

//Edit product

async function editProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();

    if (data.success) {
      const product = data.data;

      isEditMode = true;
      currentProductId = id;
      elements.modalTitle.textContent = "Edit Product";

      elements.productName.value = product.name;
      elements.productDescription.value = product.description || "";
      elements.productPrice.value = product.price;
      elements.productQuantity.value = product.stock_quantity;
      elements.productCategory.value = product.category || "";
      elements.statusGroup.style.display = "block";
      elements.productStatus.value = product.is_active ? 1 : 0;

      if (product.image) {
        elements.imagePreview.src = product.image;
        elements.imagePreview.style.display = "block";
      }
      elements.productModal.classList.add("active");
    }
  } catch (error) {
    console.error("Edit product error:", error);
    showToast("Error loading product", "error");
  }
}

// Delete product

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: {
    "x-admin-auth": localStorage.getItem("isAdminLoggedIn"),
  },
    });

    const data = await response.json();

    if (data.success) {
      showToast("Product deleted successfully", "success");
      loadProducts();
      loadStatistics();
    } else {
      showToast(data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error("Delete product error:", error);
    showToast("Error deleting product", "error");
  }
}

//Handle product form submission

async function handleProductSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  const formData = new FormData();

  formData.append("name", elements.productName.value.trim());
  formData.append("description", elements.productDescription.value.trim());
  formData.append("price", elements.productPrice.value);
  formData.append("stock_quantity", elements.productQuantity.value);
  formData.append("category", elements.productCategory.value.trim());

  if (elements.productImage.files.length > 0) {
    formData.append("image", elements.productImage.files[0]);
  }
  if (isEditMode) {
    formData.append("is_active", elements.productStatus.value);
  }

  // Show loading state
  elements.saveProductBtn.classList.add("loading");
  elements.saveProductBtn.disabled = true;

  try {
    const url = isEditMode
      ? `/api/products/${currentProductId}`
      : "/api/products";

    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
    "x-admin-auth": localStorage.getItem("isAdminLoggedIn"),
  },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      showToast(
        isEditMode
          ? "Product updated successfully"
          : "Product created successfully",
        "success",
      );
      closeModal();
      loadProducts();
      loadStatistics();
    } else {
      showToast(data.message || "Operation failed", "error");
    }
  } catch (error) {
    console.error("Save product error:", error);
    showToast("Error saving product", "error");
  } finally {
    // Remove loading state
    elements.saveProductBtn.classList.remove("loading");
    elements.saveProductBtn.disabled = false;
  }
}

// Close modal

function closeModal() {
  elements.productModal.classList.remove("active");
  elements.productForm.reset();
  //  RESET IMAGE PREVIEW
  elements.imagePreview.src = "";
  elements.imagePreview.style.display = "none";

  //  RESET FILE INPUT
  elements.productImage.value = "";
}



//Show toast notification

function showToast(message, type = "success") {
  elements.toast.textContent = message;
  elements.toast.className = `toast ${type}`;
  elements.toast.classList.add("show");

  setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 3000);
}

//Debounce function for search

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

//Escape HTML to prevent XSS

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Make functions available globally for inline event handlers
window.goToPage = goToPage;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
