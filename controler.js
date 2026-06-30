/* =============================================================
   SCRIPT.JS — Main Application Logic
   Sections:
     1. Mobile Menu
     2. Contact Form
     3. Registration Form
     4. To-Do List
     5. Product Catalogue (Display, Filter, Search)
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

// Exit early if this page has no product grid
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

    /* --- Element References (safe — only runs when productGrid exists) --- */
    const searchInput    = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    /**
     * displayProducts — Clears the grid and renders one card per product.
     * Shows a "no results" message if the list is empty.
     */
    function displayProducts(productList) {
        productGrid.innerHTML = "";

        // Show a message if no products match
        if (productList.length === 0) {
            productGrid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#888;">No products found.</p>`;
            return;
        }

        productList.forEach(product => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price}</p>
                <span class="category">${product.category}</span>
                <br><br>
                <button onclick="addToCart('${product.name}', '${product.price}')">Add to Cart</button>
            `;
            productGrid.appendChild(card);
        });
    }

    /**
     * filterProducts — Reads search box + dropdown together,
     * then re-renders only the matching products.
     */
    function filterProducts() {
        // Safe read — both elements are guaranteed to exist on this page
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
     * addToCart — Shows a confirmation when Add to Cart is clicked.
     * Replace this with real cart logic when ready.
     */
    function addToCart(name, price) {
        alert(`"${name}" (${price}) added to cart!`);
    }

    // Expose addToCart globally so inline onclick can reach it
    window.addToCart = addToCart;

    /* --- Event Listeners --- */
    if (searchInput)    searchInput.addEventListener("keyup",  filterProducts);
    if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

    /* --- Initial Render: show all products on page load --- */
    displayProducts(products);

}   // end if (productGrid)