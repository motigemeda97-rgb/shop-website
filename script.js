// script.js - all the shop's behaviour lives here.
// It uses the "products" array from products.js (loaded before this file).

// =====================================================================
// STEP 1: Grab the HTML elements we need to control
// document.getElementById("x") finds the element with id="x" in index.html
// =====================================================================
const productGrid    = document.getElementById("product-grid");
const noResults      = document.getElementById("no-results");
const searchInput    = document.getElementById("search");
const categorySelect = document.getElementById("category");
const cartButton     = document.getElementById("cart-button");
const cartCount      = document.getElementById("cart-count");
const cartPanel      = document.getElementById("cart-panel");
const closeCartBtn   = document.getElementById("close-cart");
const cartItemsEl    = document.getElementById("cart-items");
const cartTotalEl    = document.getElementById("cart-total");
const checkoutBtn    = document.getElementById("checkout-btn");
const overlay        = document.getElementById("overlay");
const checkoutModal  = document.getElementById("checkout-modal");
const checkoutForm   = document.getElementById("checkout-form");
const cancelCheckout = document.getElementById("cancel-checkout");
const orderSummary   = document.getElementById("order-summary");
const successMessage = document.getElementById("success-message");
const successText    = document.getElementById("success-text");
const closeSuccess   = document.getElementById("close-success");

// =====================================================================
// STEP 2: The cart "state"
// The cart is an array of small objects like { id: 3, qty: 2 }
// (product id 3, quantity 2). We store only ids and quantities, and look
// up the rest (name, price) from the products array when we need it.
// =====================================================================

// Read the saved cart from the browser's localStorage (so it survives
// a page refresh). localStorage only stores text, so we turn the text back
// into an array with JSON.parse. If nothing is saved yet, use an empty array [].
let cart = JSON.parse(localStorage.getItem("shop-cart")) || [];

// Save the cart: JSON.stringify turns the array into text for storage.
function saveCart() {
  localStorage.setItem("shop-cart", JSON.stringify(cart));
}

// Turn a number like 59.9 into the text "$59.90" (always 2 decimals).
function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}

// =====================================================================
// STEP 3: Show the products on the page
// =====================================================================

// Fill the category dropdown with "All" plus each unique category.
function setupCategories() {
  // products.map(...) builds a new array of just the category names.
  // new Set(...) removes duplicates. [... ] turns the Set back into an array.
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // For each category, create <option>text</option> and join them into one string.
  categorySelect.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");
}

// Draw the product cards. It re-runs every time the search or category changes.
function renderProducts() {
  // Read what the user typed (lowercase so the search ignores capital letters)
  const searchText = searchInput.value.toLowerCase().trim();
  // Read which category is chosen
  const chosenCategory = categorySelect.value;

  // filter keeps only the products that pass BOTH tests below
  const visible = products.filter(p => {
    // Does the name contain the search text?
    const matchesSearch = p.name.toLowerCase().includes(searchText);
    // Is the category "All", or does it equal the chosen one?
    const matchesCategory = chosenCategory === "All" || p.category === chosenCategory;
    return matchesSearch && matchesCategory;
  });

  // Build the HTML for each card, then put it all inside the grid.
  // data-id="..." stores the product id on the button so we know which was clicked.
  productGrid.innerHTML = visible.map(p => `
    <div class="product-card">
      <div class="product-emoji">${p.emoji}</div>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-category">${p.category}</p>
      <p class="product-price">${formatPrice(p.price)}</p>
      <button class="primary-btn add-btn" data-id="${p.id}">Add to cart</button>
    </div>
  `).join("");

  // Show the "no results" message only when the list is empty.
  noResults.hidden = visible.length > 0;
}

// =====================================================================
// STEP 4: Cart actions (add, change quantity, remove)
// =====================================================================

// Add one of a product to the cart.
function addToCart(productId) {
  // Is this product already in the cart? find returns the item or undefined.
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty += 1;                       // already there: increase quantity
  } else {
    cart.push({ id: productId, qty: 1 });    // new: add it with quantity 1
  }

  saveCart();     // remember the change
  renderCart();   // update the cart on screen
}

// Change a product's quantity by +1 or -1.
function changeQty(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;                // safety: do nothing if not found

  item.qty += change;

  // If the quantity drops to 0 or below, remove the item entirely.
  if (item.qty <= 0) {
    // filter keeps every item EXCEPT this one
    cart = cart.filter(i => i.id !== productId);
  }

  saveCart();
  renderCart();
}

// Remove an item completely, no matter its quantity.
function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

// Work out the total price of everything in the cart.
function getCartTotal() {
  // reduce adds things up: it starts at 0 and adds each item's cost.
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);  // look up the price
    return sum + product.price * item.qty;
  }, 0);
}

// Draw the cart panel and update the number on the Cart button.
function renderCart() {
  // Total number of items = sum of all quantities
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = itemCount;

  // If the cart is empty, show a friendly message and disable checkout.
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
    checkoutBtn.disabled = true;
  } else {
    checkoutBtn.disabled = false;

    // Build one row per cart item.
    cartItemsEl.innerHTML = cart.map(item => {
      const p = products.find(prod => prod.id === item.id);  // get full product info
      return `
        <div class="cart-row">
          <span class="emoji">${p.emoji}</span>
          <div class="info">
            <strong>${p.name}</strong><br />
            <small>${formatPrice(p.price)} each</small>
          </div>
          <div class="qty-controls">
            <button data-action="minus" data-id="${p.id}">−</button>
            <span>${item.qty}</span>
            <button data-action="plus" data-id="${p.id}">+</button>
          </div>
          <button class="icon-btn" data-action="remove" data-id="${p.id}" aria-label="Remove">🗑️</button>
        </div>
      `;
    }).join("");
  }

  cartTotalEl.textContent = formatPrice(getCartTotal());
}

// =====================================================================
// STEP 5: Open and close the cart and checkout popup
// =====================================================================

function openCart() {
  cartPanel.classList.add("open");   // the CSS .open class slides the panel in
  overlay.hidden = false;            // show the dark layer
}

function closeAll() {
  cartPanel.classList.remove("open");
  checkoutModal.hidden = true;
  overlay.hidden = true;
}

function openCheckout() {
  cartPanel.classList.remove("open");           // hide the cart panel
  // Show a short summary of the order inside the popup
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  orderSummary.textContent = `${itemCount} item(s) · Total ${formatPrice(getCartTotal())}`;

  checkoutForm.hidden = false;       // make sure the form is visible
  successMessage.hidden = true;      // and the success message is hidden
  checkoutModal.hidden = false;      // show the popup
  overlay.hidden = false;
}

// =====================================================================
// STEP 6: Connect buttons and inputs to the functions (event listeners)
// addEventListener("click", fn) runs fn whenever the element is clicked.
// =====================================================================

// Typing in the search box or changing the category redraws the products.
searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);

// One listener on the whole grid handles every "Add to cart" button.
// This is called "event delegation": we listen on the parent and check
// which child was actually clicked (event.target).
productGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-btn");   // did they click an add button?
  if (!button) return;                               // if not, ignore
  addToCart(Number(button.dataset.id));              // dataset.id is text, so convert to a Number
});

// Same delegation idea for the +, − and 🗑️ buttons inside the cart.
cartItemsEl.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const id = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "plus")   changeQty(id, 1);
  if (action === "minus")  changeQty(id, -1);
  if (action === "remove") removeFromCart(id);
});

cartButton.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeAll);
overlay.addEventListener("click", closeAll);          // clicking outside closes things
checkoutBtn.addEventListener("click", openCheckout);
cancelCheckout.addEventListener("click", closeAll);

// When the form is submitted ("Place Order" button)
checkoutForm.addEventListener("submit", event => {
  event.preventDefault();   // stop the browser from reloading the page

  const name = document.getElementById("name").value;
  const total = formatPrice(getCartTotal());

  // textContent (not innerHTML) is safe: it never runs HTML typed by the user.
  successText.textContent = `Thank you, ${name}! Your order of ${total} has been received.`;

  // NOTE: a real shop would send the order to a server here.
  cart = [];            // empty the cart
  saveCart();
  renderCart();
  checkoutForm.reset(); // clear the form fields

  checkoutForm.hidden = true;     // swap the form for the success message
  successMessage.hidden = false;
});

closeSuccess.addEventListener("click", closeAll);

// =====================================================================
// STEP 7: Start the app. These run once when the page loads.
// =====================================================================
setupCategories();
renderProducts();
renderCart();
