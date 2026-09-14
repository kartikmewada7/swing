async function getLoggedInUser() {
    if (typeof getCurrentUser !== "function") {
        return null;
    }

    return await getCurrentUser();
}

async function changeQuantity(
    cartItemId,
    quantity
) {
    try {
        await updateCartQuantity(
            cartItemId,
            quantity
        );

        await renderCart();
    } catch (error) {
        alert(error.message);
    }
}

async function removeItem(cartItemId) {
    try {
        await removeCartItem(cartItemId);

        await renderCart();
    } catch (error) {
        alert(error.message);
    }
}

async function renderCart() {
    const container =
        document.getElementById("cartContainer");

    if (!container) {
        return;
    }

    const user = await getLoggedInUser();

    if (!user) {
        container.innerHTML = `
            <div class="empty">
                <h2>Please login first.</h2>
                <br>
                <a href="login.html" class="btn">
                    Login
                </a>
            </div>
        `;

        return;
    }

    try {
        const items =
            await getUserCartItems(user.id);

        if (items.length === 0) {
            container.innerHTML = `
                <div class="empty">
                    <h2>Your cart is empty 🛒</h2>
                    <p class="muted">
                        Add something delicious.
                    </p>
                    <br>
                    <a href="menu.html" class="btn">
                        Browse Menu
                    </a>
                </div>
            `;

            return;
        }

        const total = items.reduce(
            (sum, item) => {
                return sum +
                    Number(item.food_items.price) *
                    item.quantity;
            },
            0
        );

        container.innerHTML = `
            <div class="cart-layout">
                <div class="panel">
                    ${items.map(item => `
                        <div class="cart-row">
                            <div class="cart-thumb">
                                ${getFoodEmoji(item.food_items.name)}
                            </div>

                            <div>
                                <strong>
                                    ${escapeHtml(item.food_items.name)}
                                </strong>
                                <p class="muted">
                                    ${formatMoney(item.food_items.price)} each
                                </p>
                            </div>

                            <div class="quantity-buttons">
                                <button
                                    class="quantity-button"
                                    onclick="changeQuantity(${item.id}, ${item.quantity - 1})"
                                >
                                    −
                                </button>

                                <strong>${item.quantity}</strong>

                                <button
                                    class="quantity-button"
                                    onclick="changeQuantity(${item.id}, ${item.quantity + 1})"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                class="remove-button"
                                onclick="removeItem(${item.id})"
                            >
                                Remove
                            </button>
                        </div>
                    `).join("")}
                </div>

                <aside class="panel">
                    <h2>Order Summary</h2>
                    <div class="summary-line">
                        <span>Subtotal</span>
                        <strong>${formatMoney(total)}</strong>
                    </div>
                    <div class="summary-line">
                        <span>Delivery</span>
                        <strong>Free</strong>
                    </div>
                    <div class="summary-line total-line">
                        <span>Total</span>
                        <strong>${formatMoney(total)}</strong>
                    </div>
                    <br>
                    <a href="checkout.html" class="btn full-width">
                        Proceed to Checkout
                    </a>
                </aside>
            </div>
        `;

        updateCartCountFromDatabase(items);
    } catch (error) {
        container.innerHTML = `
            <div class="empty">
                ${escapeHtml(error.message)}
            </div>
        `;
    }
}

function getFoodEmoji(name) {
    const lower = String(name).toLowerCase();

    let imageUrl = "";

    if (lower.includes("pizza")) {
        imageUrl = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("burger")) {
        imageUrl = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("pasta")) {
        imageUrl = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("fries")) {
        imageUrl = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("sandwich")) {
        imageUrl = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("wrap")) {
        imageUrl = "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("coffee") || lower.includes("shake")) {
        imageUrl = "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("soda")) {
        imageUrl = "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("bread")) {
        imageUrl = "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80";
    } else if (lower.includes("brownie") || lower.includes("ice cream") || lower.includes("gulab")) {
        imageUrl = "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=500&q=80";
    }

    if (!imageUrl) {
        return "🍽️";
    }

    return `
        <img
            src="${imageUrl}"
            alt="${escapeHtml(name)}"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;"
            onerror="this.style.display='none';this.parentElement.textContent='🍽️';"
        >
    `;
}

function updateCartCountFromDatabase(items) {
    const element =
        document.getElementById("cartCount");

    if (!element) {
        return;
    }

    const count = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    element.textContent = count;
}

document.addEventListener(
    "DOMContentLoaded",
    renderCart
);
