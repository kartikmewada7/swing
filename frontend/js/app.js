const CART_KEY = "foodie_cart";
const USER_KEY = "foodie_user";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cartItems) {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    updateCartCount();
}

function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
}

function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function formatMoney(value) {
    return "₹" + Number(value).toFixed(2);
}

async function updateCartCount() {
    const element = document.getElementById("cartCount");
    if (!element) return;

    try {
        // Supabase is loaded after app.js in the current HTML files, so this
        // function intentionally checks for it when DOMContentLoaded fires.
        if (typeof supabaseClient !== "undefined") {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                const { data, error } = await supabaseClient
                    .from("cart_items")
                    .select("quantity")
                    .eq("user_id", user.id);

                if (!error) {
                    const count = (data || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
                    element.textContent = count;
                    return;
                }
            }
        }
    } catch (e) {
        console.warn("Supabase cart count unavailable:", e);
    }

    // Fallback only for old/local data.
    const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    element.textContent = count;
}

async function logout() {
    try {
        if (typeof supabaseClient !== "undefined") {
            await supabaseClient.auth.signOut();
        }
    } catch (e) {
        console.warn("Supabase logout error:", e);
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
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    let user = getUser();

    try {
        if (typeof supabaseClient !== "undefined") {
            const result = await supabaseClient.auth.getUser();
            if (result.data && result.data.user) {
                user = result.data.user;
                const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
                setUser({ id: user.id, email: user.email, name });
            }
        }
    } catch (e) {
        console.warn("Unable to read Supabase session:", e);
    }

    const account = user ? `
        <span>Hi, ${escapeHtml(user.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User")}</span>
        <button class="logout-button" onclick="logout()">Logout</button>
    ` : `
        <a href="login.html">Login</a>
    `;

    navbar.innerHTML = `
        <header>
            <a href="index.html" class="logo">🍔 Foodie Express</a>
            <nav class="nav">
                <a href="index.html">Home</a>
                <a href="menu.html">Menu</a>
                <a href="cart.html" class="cart-link">Cart <span id="cartCount">0</span></a>
                <a href="orders.html">Orders</a>
                ${account}
            </nav>
        </header>
    `;

    await updateCartCount();
}

document.addEventListener("DOMContentLoaded", renderNavbar);
