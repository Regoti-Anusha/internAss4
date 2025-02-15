const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartIcon = document.getElementById("cart-icon");
const cartCount = document.getElementById("cart-count");
const cart = document.getElementById("cart");
const emptyCartBtn = document.getElementById("empty-cart");
const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const dashboard = document.getElementById("dashboard");
const userName = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

let cartData = JSON.parse(localStorage.getItem("cart")) || [];

async function fetchProducts(category = "all") {
  const url =
    category === "all"
      ? "https://fakestoreapi.com/products"
      : `https://fakestoreapi.com/products/category/${category}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}


async function renderProducts(category = "all") {
  const products = await fetchProducts(category);
  productList.innerHTML = products
    .map(
      (product) => `
      <div class="product">
        <img src="${product.image}" alt="${product.title}" width="100">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `
    )
    .join("");
}


async function addToCart(productId) {
  const products = await fetchProducts();
  const product = products.find((p) => p.id === productId);
  const existingItem = cartData.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartData.push({ ...product, quantity: 1 });
  }
  updateCart();
}


function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cartData));
  cartItems.innerHTML = cartData
    .map(
      (item) => `
      <div class="cart-item">
        <h4>${item.title}</h4>
        <p>$${item.price} x ${item.quantity}</p>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `
    )
    .join("");
  cartTotal.textContent = cartData.reduce((total, item) => total + item.price * item.quantity, 0);
  cartCount.textContent = cartData.reduce((count, item) => count + item.quantity, 0);
}


function removeFromCart(productId) {
  cartData = cartData.filter((item) => item.id !== productId);
  updateCart();
}


emptyCartBtn.addEventListener("click", () => {
  cartData = [];
  updateCart();
});


cartIcon.addEventListener("click", () => {
  cart.classList.toggle("active");
});


authModal.style.display = "flex";
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  userName.textContent = username;
  authModal.style.display = "none";
  dashboard.classList.remove("hidden");
});


logoutBtn.addEventListener("click", () => {
  dashboard.classList.add("hidden");
  authModal.style.display = "flex";
});


renderProducts();
updateCart();