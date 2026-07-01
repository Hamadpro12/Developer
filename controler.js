/* =============================================================
   SCRIPT.JS — Main Application Logic
   Sections:
     1. Mobile Menu
     2. Contact Form
     3. Registration Form
     4. To-Do List
     5. Product Catalogue (Display, Filter, Search)
     6. Shopping Cart (Quantity, Remove, Auto Totals)
   ============================================================= */


/* -------------------------------------------------------------
   1. MOBILE MENU
   Toggles the nav links when the hamburger button is clicked.
   ------------------------------------------------------------- */

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn) {
    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}


/* -------------------------------------------------------------
   2. CONTACT FORM
   Validates name is not empty, shows success, then resets.
   ------------------------------------------------------------- */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();

        if (name === "") {
            alert("Please enter your name.");
            return;
        }

        alert("Message submitted successfully!");
        contactForm.reset();
    });
}


/* -------------------------------------------------------------
   3. REGISTRATION FORM
   Validates all fields and saves to localStorage on success.
   ------------------------------------------------------------- */

const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Clear all previous error messages
        document.querySelectorAll(".error").forEach(el => {
            el.textContent = "";
        });

        let isValid = true;

        // Collect field values
        const fullname        = document.getElementById("fullname").value.trim();
        const email           = document.getElementById("email").value.trim();
        const mobile          = document.getElementById("mobile").value.trim();
        const password        = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const city            = document.getElementById("city").value;
        const gender          = document.querySelector('input[name="gender"]:checked');

        // Full Name
        if (fullname === "") {
            document.getElementById("nameError").textContent = "Full name is required.";
            isValid = false;
        }

        // Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById("emailError").textContent = "Enter a valid email address.";
            isValid = false;
        }

        // Mobile (10 digits)
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(mobile)) {
            document.getElementById("mobileError").textContent = "Enter a valid 10-digit mobile number.";
            isValid = false;
        }

        // Password
        if (password.trim() === "") {
            document.getElementById("passwordError").textContent = "Password is required.";
            isValid = false;
        } else if (password.length < 6) {
            document.getElementById("passwordError").textContent = "Password must be at least 6 characters.";
            isValid = false;
        }

        // Confirm Password
        if (confirmPassword.trim() === "") {
            document.getElementById("confirmPasswordError").textContent = "Please confirm your password.";
            isValid = false;
        } else if (password !== confirmPassword) {
            document.getElementById("confirmPasswordError").textContent = "Passwords do not match.";
            isValid = false;
        }

        // Gender
        if (!gender) {
            document.getElementById("genderError").textContent = "Please select a gender.";
            isValid = false;
        }

        // City
        if (city === "") {
            document.getElementById("cityError").textContent = "Please select a city.";
            isValid = false;
        }

        // Save & redirect on success
        if (isValid) {
            localStorage.setItem("fullname", fullname);
            localStorage.setItem("email",    email);
            localStorage.setItem("mobile",   mobile);
            localStorage.setItem("gender",   gender.value);
            localStorage.setItem("city",     city);

            window.open("success.html", "_blank");
            registrationForm.reset();
        }
    });
}


/* -------------------------------------------------------------
   4. TO-DO LIST
   Add, edit, complete, and delete tasks.
   ------------------------------------------------------------- */

const taskInput = document.getElementById("taskInput");

if (taskInput) {

    /**
     * addTask — Reads the input, creates a list item,
     * appends it to the Pending Tasks list.
     */
    function addTask() {
        const taskText = taskInput.value.trim();
        const error    = document.getElementById("error");

        if (taskText === "") {
            error.textContent = "Please enter a task.";
            return;
        }

        error.textContent = "";

        const li = document.createElement("li");
        li.innerHTML = `
            <span>${taskText}</span>
            <div class="actions">
                <button class="edit"     onclick="editTask(this)">Edit</button>
                <button class="complete" onclick="completeTask(this)">Complete</button>
                <button class="delete"   onclick="deleteTask(this)">Delete</button>
            </div>
        `;

        document.getElementById("pendingTasks").appendChild(li);
        taskInput.value = "";
    }

    window.addTask = addTask;
}

/**
 * editTask — Prompts for new text and updates the task label.
 */
function editTask(button) {
    const taskLabel   = button.parentElement.previousElementSibling;
    const updatedText = prompt("Edit task:", taskLabel.innerText);

    if (updatedText !== null && updatedText.trim() !== "") {
        taskLabel.innerText = updatedText.trim();
    }
}

/**
 * deleteTask — Removes the task item from the list.
 */
function deleteTask(button) {
    button.parentElement.parentElement.remove();
}

/**
 * completeTask — Moves task from Pending to Completed list.
 */
function completeTask(button) {
    const taskItem = button.parentElement.parentElement;
    button.remove();
    document.getElementById("completedTasks").appendChild(taskItem);
}


/* -------------------------------------------------------------
   5. PRODUCT CATALOGUE
   Only runs on pages that have the product grid.
   Supports live search + category filtering.
   ------------------------------------------------------------- */

const productGrid = document.getElementById("productGrid");

if (productGrid) {

    /* --- Product Data --- */
    const products = [
        { name: "HP Laptop",           price: "₹55,000", category: "Electronics", image: "https://placehold.co/300x230?text=HP+Laptop" },
        { name: "iPhone 15",           price: "₹79,999", category: "Electronics", image: "https://placehold.co/300x230?text=iPhone+15" },
        { name: "Smart Watch",         price: "₹8,999",  category: "Electronics", image: "https://placehold.co/300x230?text=Smart+Watch" },
        { name: "Wireless Headphones", price: "₹3,999",  category: "Electronics", image: "https://placehold.co/300x230?text=Headphones" },
        { name: "Men T-Shirt",         price: "₹799",    category: "Clothing",    image: "https://placehold.co/300x230?text=T-Shirt" },
        { name: "Winter Jacket",       price: "₹2,499",  category: "Clothing",    image: "https://placehold.co/300x230?text=Winter+Jacket" },
        { name: "Running Shoes",       price: "₹3,499",  category: "Shoes",       image: "https://placehold.co/300x230?text=Running+Shoes" },
        { name: "Sneakers",            price: "₹2,999",  category: "Shoes",       image: "https://placehold.co/300x230?text=Sneakers" },
        { name: "Backpack",            price: "₹1,299",  category: "Accessories", image: "https://placehold.co/300x230?text=Backpack" },
        { name: "Travel Bag",          price: "₹2,299",  category: "Accessories", image: "https://placehold.co/300x230?text=Travel+Bag" },
    ];

    const searchInput    = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    /**
     * displayProducts — Clears the grid and renders one card per product.
     * Shows a "no results" message if the list is empty.
     */
    function displayProducts(productList) {
        productGrid.innerHTML = "";

        if (productList.length === 0) {
            productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;padding:40px 0;font-size:18px;">No products found.</p>`;
            return;
        }

        productList.forEach(product => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}"
                     onerror="this.style.background='#ddd';this.style.height='230px';">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <span class="category">${product.category}</span>
                <br><br>
                <button onclick="addToCart('${product.name}', '${product.price}', '${product.category}', '${product.image}')">Add to Cart</button>
            `;
            productGrid.appendChild(card);
        });
    }

    /**
     * filterProducts — Reads search box + dropdown together,
     * then re-renders only the matching products.
     */
    function filterProducts() {
        const searchValue   = searchInput ? searchInput.value.toLowerCase() : "";
        const categoryValue = categoryFilter ? categoryFilter.value : "All";

        const filtered = products.filter(product => {
            const matchesName     = product.name.toLowerCase().includes(searchValue);
            const matchesCategory = categoryValue === "All" || product.category === categoryValue;
            return matchesName && matchesCategory;
        });

        displayProducts(filtered);
    }

    /**
     * addToCart — Saves product to localStorage cart and confirms.
     * Cart is stored as a JSON array under the key "cart".
     */
    function addToCart(name, price, category, image) {

        // Load existing cart from localStorage (or start empty)
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        // Check if this product is already in the cart
        const existing = cart.find(function (item) { return item.name === name; });

        if (existing) {
            // Already in cart — just increase quantity
            existing.qty += 1;
        } else {
            // New item — add it with qty 1
            // Convert price string "₹55,000" to plain number 55000
            const numericPrice = parseInt(price.replace(/[₹,]/g, ""), 10);

            cart.push({
                id:       Date.now(),   // unique id based on timestamp
                name:     name,
                price:    numericPrice,
                category: category,
                image:    image,
                qty:      1
            });
        }

        // Save updated cart back to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));

        alert(`"${name}" added to cart! ✅\nGo to Shopping Cart to view.`);
    }

    window.addToCart = addToCart;

    if (searchInput)    searchInput.addEventListener("keyup",  filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

    displayProducts(products);

}   // end if (productGrid)


/* -------------------------------------------------------------
   6. SHOPPING CART
   Only runs on cart.html.
   Features:
     - 8 pre-loaded products
     - Increase / Decrease quantity (min 1)
     - Remove item
     - Auto-calculate Subtotal, 10% Discount, ₹99 Delivery
     - Grand Total updates live
     - Empty cart state with link back to products
   ------------------------------------------------------------- */

const cartItemsEl = document.getElementById("cartItems");

if (cartItemsEl) {

    /* --- Load cart from localStorage (filled by product page) --- */
    let cartData = JSON.parse(localStorage.getItem("cart")) || [];

    /* --- Constants --- */
    const DELIVERY_FEE  = 99;    // flat ₹99 delivery
    const DISCOUNT_RATE = 0.10;  // 10% discount on subtotal

    /* --- DOM References --- */
    const emptyMsgEl     = document.getElementById("emptyMsg");
    const cartSummaryEl  = document.getElementById("cartSummary");
    const cartHeaderEl   = document.querySelector(".cart-table-header");
    const summaryItemsEl = document.getElementById("summaryItems");
    const summarySubEl   = document.getElementById("summarySubtotal");
    const summaryDelEl   = document.getElementById("summaryDelivery");
    const summaryDiscEl  = document.getElementById("summaryDiscount");
    const summaryGrandEl = document.getElementById("summaryGrand");
    const checkoutBtnEl  = document.getElementById("checkoutBtn");

    /**
     * toINR — Converts a plain number into Indian Rupee format.
     * Example: 55000 → "₹55,000"
     */
    function toINR(amount) {
        return "₹" + amount.toLocaleString("en-IN");
    }

    /**
     * renderCart — Clears and rebuilds all cart rows,
     * then recalculates and displays all totals.
     */
    function renderCart() {
        cartItemsEl.innerHTML = "";

        /* ---- Empty cart state ---- */
        if (cartData.length === 0) {
            if (cartHeaderEl)   cartHeaderEl.style.display  = "none";
            if (emptyMsgEl)     emptyMsgEl.style.display    = "block";
            if (cartSummaryEl)  cartSummaryEl.style.display = "none";
            return;
        }

        /* ---- Cart has items ---- */
        if (cartHeaderEl)   cartHeaderEl.style.display  = "grid";
        if (emptyMsgEl)     emptyMsgEl.style.display    = "none";
        if (cartSummaryEl)  cartSummaryEl.style.display = "block";

        let subtotal   = 0;
        let totalItems = 0;

        /* Build one row per item */
        cartData.forEach(function (item) {
            const lineTotal = item.price * item.qty;
            subtotal   += lineTotal;
            totalItems += item.qty;

            const row = document.createElement("div");
            row.className = "cart-item";
            row.innerHTML = `

                <!-- Product: image + name + category -->
                <div class="item-product">
                    <img src="${item.image}" alt="${item.name}"
                         onerror="this.style.background='#eee';">
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <span class="item-category">${item.category}</span>
                    </div>
                </div>

                <!-- Unit price -->
                <div class="item-price">${toINR(item.price)}</div>

                <!-- Quantity selector -->
                <div class="qty-wrap">
                    <button class="qty-btn"
                            onclick="changeQty(${item.id}, -1)"
                            aria-label="Decrease quantity">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn"
                            onclick="changeQty(${item.id}, +1)"
                            aria-label="Increase quantity">+</button>
                </div>

                <!-- Line total -->
                <div class="item-total">${toINR(lineTotal)}</div>

                <!-- Remove button -->
                <button class="item-remove"
                        onclick="removeItem(${item.id})"
                        title="Remove item">✕</button>
            `;

            cartItemsEl.appendChild(row);
        });

        /* ---- Calculate totals ---- */
        const discount   = Math.round(subtotal * DISCOUNT_RATE);
        const grandTotal = subtotal - discount + DELIVERY_FEE;

        /* ---- Update summary panel ---- */
        if (summaryItemsEl) summaryItemsEl.textContent = totalItems + " item" + (totalItems !== 1 ? "s" : "");
        if (summarySubEl)   summarySubEl.textContent   = toINR(subtotal);
        if (summaryDelEl)   summaryDelEl.textContent   = toINR(DELIVERY_FEE);
        if (summaryDiscEl)  summaryDiscEl.textContent  = "− " + toINR(discount);
        if (summaryGrandEl) summaryGrandEl.textContent = toINR(grandTotal);
    }

    /**
     * changeQty — Increase or decrease quantity for one item.
     * Quantity cannot go below 1 — use Remove to delete the item.
     *
     * @param {number} id    — Cart item id
     * @param {number} delta — +1 to increase, -1 to decrease
     */
    function changeQty(id, delta) {
        const item = cartData.find(function (i) { return i.id === id; });
        if (!item) return;

        item.qty = Math.max(1, item.qty + delta); // never below 1
        localStorage.setItem("cart", JSON.stringify(cartData)); // save
        renderCart();
    }

    /**
     * removeItem — Delete one item from the cart entirely.
     *
     * @param {number} id — Cart item id to remove
     */
    function removeItem(id) {
        cartData = cartData.filter(function (i) { return i.id !== id; });
        localStorage.setItem("cart", JSON.stringify(cartData)); // save
        renderCart();
    }

    /* Checkout button handler */
    if (checkoutBtnEl) {
        checkoutBtnEl.addEventListener("click", function () {
            if (cartData.length === 0) {
                alert("Your cart is empty! Add some products first.");
                return;
            }
            localStorage.removeItem("cart");
            cartData = [];
            renderCart();
            alert("✅ Order placed successfully!\nThank you for shopping with My Store.");
        });
    }

    /* Expose to global scope so inline onclick attributes work */
    window.changeQty  = changeQty;
    window.removeItem = removeItem;

    /* Initial render on page load */
    renderCart();

}   // end if (cartItemsEl)
