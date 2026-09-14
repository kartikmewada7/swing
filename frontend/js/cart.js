async function getLoggedInUser() {
    if (typeof getCurrentUser !== "function") throw new Error("Authentication module is not loaded.");
    return await getCurrentUser();
}

async function loadCartDirect(userId) {
    const result = await supabaseClient
        .from("cart_items")
        .select("id, quantity, food_id")
        .eq("user_id", userId)
        .order("id");
    if (result.error) throw result.error;

    const rows = result.data || [];
    if (!rows.length) return [];

    const ids = [...new Set(rows.map(r => r.food_id))];
    const foodsResult = await supabaseClient
        .from("food_items")
        .select("id, name, price, image_url")
        .in("id", ids);
    if (foodsResult.error) throw foodsResult.error;

    const foodMap = new Map((foodsResult.data || []).map(f => [f.id, f]));
    return rows.map(r => ({ ...r, food: foodMap.get(r.food_id) })).filter(r => r.food);
}

function getFoodVisual(food) {
    if (food.image_url) {
        return `<img src="${escapeHtml(food.image_url)}" alt="${escapeHtml(food.name)}" style="width:72px;height:72px;object-fit:cover;border-radius:12px;display:block;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';"><span style="display:none;font-size:42px">🍽️</span>`;
    }
    const n = String(food.name || "").toLowerCase();
    if (n.includes("pizza")) return "🍕";
    if (n.includes("burger")) return "🍔";
    if (n.includes("pasta")) return "🍝";
    if (n.includes("fries")) return "🍟";
    if (n.includes("sandwich")) return "🥪";
    if (n.includes("wrap")) return "🌯";
    if (n.includes("coffee")) return "☕";
    if (n.includes("brownie")) return "🍫";
    return "🍽️";
}

async function changeQuantity(cartItemId, quantity) {
    try {
        if (quantity <= 0) await removeCartItem(cartItemId);
        else await updateCartQuantity(cartItemId, quantity);
        await renderCart();
        await updateCartCount();
    } catch (e) { alert(e.message); }
}

async function removeItem(cartItemId) {
    try {
        await removeCartItem(cartItemId);
        await renderCart();
        await updateCartCount();
    } catch (e) { alert(e.message); }
}

async function renderCart() {
    const container = document.getElementById("cartContainer");
    if (!container) return;
    container.innerHTML = `<div class="empty"><h2>Loading cart...</h2></div>`;

    try {
        const user = await getLoggedInUser();
        if (!user) {
            container.innerHTML = `<div class="empty"><h2>Please login first.</h2><br><a href="login.html" class="btn">Login</a></div>`;
            return;
        }

        const items = await loadCartDirect(user.id);
        if (!items.length) {
            container.innerHTML = `<div class="empty"><h2>Your cart is empty 🛒</h2><p class="muted">Add something delicious.</p><br><a href="menu.html" class="btn">Browse Menu</a></div>`;
            return;
        }

        const total = items.reduce((sum, i) => sum + Number(i.food.price) * Number(i.quantity), 0);
        container.innerHTML = `<div class="cart-layout"><div class="panel">${items.map(i => `
            <div class="cart-row">
                <div class="cart-thumb">${getFoodVisual(i.food)}</div>
                <div><strong>${escapeHtml(i.food.name)}</strong><p class="muted">${formatMoney(i.food.price)} each</p></div>
                <div class="quantity-buttons">
                    <button class="quantity-button" onclick="changeQuantity(${i.id}, ${Number(i.quantity)-1})">−</button>
                    <strong>${i.quantity}</strong>
                    <button class="quantity-button" onclick="changeQuantity(${i.id}, ${Number(i.quantity)+1})">+</button>
                </div>
                <button class="remove-button" onclick="removeItem(${i.id})">Remove</button>
            </div>`).join("")}</div>
            <aside class="panel"><h2>Order Summary</h2><div class="summary-line"><span>Subtotal</span><strong>${formatMoney(total)}</strong></div><div class="summary-line"><span>Delivery</span><strong>Free</strong></div><div class="summary-line total-line"><span>Total</span><strong>${formatMoney(total)}</strong></div><br><a href="checkout.html" class="btn full-width">Proceed to Checkout</a></aside></div>`;
        await updateCartCount();
    } catch (e) {
        console.error("Cart error:", e);
        container.innerHTML = `<div class="empty"><h2>Unable to load cart</h2><p>${escapeHtml(e.message)}</p><br><button class="btn" onclick="renderCart()">Retry</button></div>`;
    }
}

document.addEventListener("DOMContentLoaded", renderCart);
