const API = "https://fakestoreapi.com/products";
const list = document.querySelector("#list");
const filterBtn = document.querySelector("#filter-btn");
const searchInput = document.querySelector("#search-input");
const cartContainer = document.querySelector(".cart-container");
const cartNumber = document.querySelector(".cart-number-container");
const cartModal = document.querySelector("#cart-modal");
const cartList = document.querySelector("#cart-list");
const cartTotal = document.querySelector("#cart-total");
const closeBtn = document.querySelector(".close");

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Fetch products
async function fetchProducts() {
    try {
        const res = await fetch(API);
        products = await res.json();
        displayProducts(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Display products
function displayProducts(arr) {
    list.innerHTML = "";
    arr.forEach((product) => {
        const li = document.createElement("li");
        li.classList.add("product");
        li.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h4>${product.title}</h4>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        list.appendChild(li);
    });
}

// Add to cart
function addToCart(id) {
    const item = products.find(p => p.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
}

// Update cart UI and storage
function updateCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    cartNumber.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    displayCart();
}

// Display cart in modal
function displayCart() {
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${item.title} - $${item.price.toFixed(2)} x ${item.quantity}</span>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Remove from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Filter products
filterBtn.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "all") return displayProducts(products);
    const filtered = products.filter(p => p.category === value + "'s clothing" || p.category === value); // Adjust for API categories
    displayProducts(filtered);
});

// Search products
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const searched = products.filter(p => p.title.toLowerCase().includes(value));
    displayProducts(searched);
});

// Open/close cart modal
cartContainer.addEventListener("click", () => cartModal.classList.remove("hide"));
closeBtn.addEventListener("click", () => cartModal.classList.add("hide"));

// Initial fetch
fetchProducts();
updateCart();
