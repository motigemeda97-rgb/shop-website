// products.js
// This file is our tiny "database". It only holds data, no logic.
// To add a product to the shop, copy one line and change the values.

// "const" creates a variable that cannot be reassigned.
// The square brackets [ ] make an array (a list) of products.
// Each { ... } is an object: a bundle of named values (id, name, ...).
const products = [
  // id       = a unique number so the cart can find the product later
  // name     = the title shown on the card
  // category = used by the category filter
  // price    = a number (no $ sign, we add that when displaying)
  // emoji    = used as the product picture, so we need no image files
  { id: 1,  name: "Wireless Headphones", category: "Electronics", price: 59.99, emoji: "" img src="" alt="headphones" width="30" height="30"> },
  { id: 2,  name: "Smart Watch",         category: "Electronics", price: 129.5, emoji: "⌚" },
  { id: 3,  name: "Laptop Backpack",     category: "Fashion",     price: 39.0,  emoji: "🎒" },
  { id: 4,  name: "Running Shoes",       category: "Fashion",     price: 74.99, emoji: "👟" },
  { id: 5,  name: "Sunglasses",          category: "Fashion",     price: 24.5,  emoji: "🕶️" },
  { id: 6,  name: "Coffee Mug",          category: "Home",        price: 9.99,  emoji: "☕" },
  { id: 7,  name: "Desk Lamp",           category: "Home",        price: 21.0,  emoji: "💡" },
  { id: 8,  name: "Plant Pot",           category: "Home",        price: 14.25, emoji: "🪴" },
  { id: 9,  name: "Novel Collection",    category: "Books",       price: 18.0,  emoji: "📚" },
  { id: 10, name: "Notebook Set",        category: "Books",       price: 7.5,   emoji: "📓" },
  { id: 11, name: "Bluetooth Speaker",   category: "Electronics", price: 45.0,  emoji: "🔊" },
  { id: 12, name: "Football",            category: "Sports",      price: 19.99, emoji: "⚽" }
];
