// Supabase is configured in js/supabase-config.js

const CART_KEY = "foodie_cart";
const USER_KEY = "foodie_user";

function getCart() {
    return JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
    );
}

function saveCart(cartItems) {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cartItems)
    );

    updateCartCount();
}

function getUser() {
    return JSON.parse(
        localStorage.getItem(USER_KEY) || "null"
    );
}

function setUser(user) {
    localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
    );
}

function formatMoney(value) {
    return "₹" + Number(value).toFixed(2);
}

function updateCartCount() {
    const element =
        document.getElementById("cartCount");

    if (!element) {
        return;
    }

    const count = getCart().reduce(
        (sum, item) =>
            sum + item.quantity,
        0
    );

    element.textContent = count;
}

async function logout() {
    try {
        if (typeof signOutUser === "function") {
            await signOutUser();
            return;
        }
    } catch (error) {
        console.error("Logout error:", error);
    }

    localStorage.removeItem(USER_KEY);
    window.location.href = "index.html";
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

async function renderNavbar() {
    const navbar =
        document.getElementById("navbar");

    if (!navbar) {
        return;
    }

    let user = getUser();

    try {
        if (typeof getCurrentUser === "function") {
            const supabaseUser =
                await getCurrentUser();

            if (supabaseUser) {
                user = {
                    id: supabaseUser.id,
                    email: supabaseUser.email,
                    name:
                        supabaseUser.user_metadata?.full_name ||
                        supabaseUser.email,
                    phone:
                        supabaseUser.user_metadata?.phone ||
                        ""
                };

                setUser(user);
            } else {
                localStorage.removeItem(USER_KEY);
                user = null;
            }
        }
    } catch (error) {
        console.error("Unable to read login session:", error);
    }

    const account =
        user
            ? `
                <span>
                    Hi, ${escapeHtml(user.name)}
                </span>

                <button
                    class="logout-button"
                    onclick="logout()"
                >
                    Logout
                </button>
              `
            : `
                <a href="login.html">
                    Login
                </a>
              `;

    navbar.innerHTML = `
        <header>

            <a
                href="index.html"
                class="logo"
            >
                🍔 Foodie Express
            </a>

            <nav class="nav">

                <a href="index.html">
                    Home
                </a>

                <a href="menu.html">
                    Menu
                </a>

                <a
                    href="cart.html"
                    class="cart-link"
                >
                    Cart
                    <span id="cartCount">
                        0
                    </span>
                </a>

                <a href="orders.html">
                    Orders
                </a>

                ${account}

            </nav>

        </header>
    `;

    updateCartCount();
}

async function apiRequest(
    endpoint,
    options = {}
) {
    const response =
        await fetch(
            API_BASE_URL + endpoint,
            {
                headers: {
                    "Content-Type":
                        "application/json",

                    ...(options.headers || {})
                },

                ...options
            }
        );

    const data =
        await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ||
            "API request failed."
        );
    }

    return data;
}

document.addEventListener(
    "DOMContentLoaded",
    renderNavbar
);
