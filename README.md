# QuickCart Shop

A simple online shopping website built with plain HTML, CSS and JavaScript.
No installs, no build tools, no internet needed.

## How to run it (3 steps)

1. Unzip the folder.
2. Double-click `index.html`.
3. Your browser opens the shop. Try searching, filtering, adding items and checking out.

## What it can do

- Product grid with search and category filter
- Shopping cart (add, increase, decrease, remove)
- Cart is saved in the browser, so it survives a refresh
- Checkout form with an order confirmation message

## The files and what each one does

| File | Job |
|------|-----|
| `index.html` | The page structure (header, product grid, cart panel, checkout popup) |
| `style.css` | Colours, layout and animations |
| `products.js` | The list of products (edit this to change what you sell) |
| `script.js` | All behaviour: showing products, cart logic, checkout |

Every line in the code has a comment. A good way to learn is to read the
files in this order: `products.js` → `index.html` → `style.css` → `script.js`
(`script.js` is split into numbered steps).

## Try changing things (practice ideas)

1. Add a new product in `products.js`.
2. Change `--brand` in `style.css` to a new colour.
3. Add a "Sort by price" dropdown in `index.html` and use `.sort()` inside `renderProducts()`.
4. Show a discount when the total is over $100.

## Important note

This is a front-end demo. The checkout does **not** take real payments or send
orders anywhere. To make it a real store you would add a backend (for example
Node.js with a database) and a payment provider such as Stripe.
