
async function loadCheckout() {
    const user = await currentUser();

    if (!user) {
        location.href = "login.html?next=checkout.html";
        return;
    }

    document.getElementById("customerName").value =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "";

    document.getElementById("customerPhone").value =
        user.user_metadata?.phone || "";

    const summary = document.getElementById("checkoutSummary");

    try {
        const cartItems = await getCartItems(user.id);

        if (!cartItems.length) {
            summary.innerHTML = `
                <div class="empty-state">
                    <h2>Cart is empty</h2>
                    <p>Add some delicious food before checkout.</p>
                    <a class="btn" href="menu.html">Browse Menu</a>
                </div>
            `;

            document.getElementById("placeBtn").disabled = true;
            return;
        }

        const total = cartItems.reduce(
            (sum, item) =>
                sum +
                Number(item.food_items.price) *
                Number(item.quantity),
            0
        );

        summary.innerHTML = `
            <h2>Your Order</h2>

            ${cartItems.map(item => `
                <div class="summary-line">
                    <span>
                        ${escapeHtml(item.food_items.name)}
                        × ${item.quantity}
                    </span>

                    <b>
                        ${formatMoney(
                            Number(item.food_items.price) *
                            Number(item.quantity)
                        )}
                    </b>
                </div>
            `).join("")}

            <div class="summary-line total">
                <span>Total</span>
                <b>${formatMoney(total)}</b>
            </div>
        `;

    } catch (e) {
        summary.innerHTML = `
            <div class="notice">
                ${escapeHtml(e.message)}
            </div>
        `;
    }
}


async function placeOrder(e) {
    e.preventDefault();

    const msg = document.getElementById("checkoutMessage");
    const btn = document.getElementById("placeBtn");

    const user = await currentUser();

    if (!user) {
        location.href = "login.html";
        return;
    }

    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const address =
        document.getElementById("customerAddress").value.trim();

    const paymentElement =
        document.querySelector("input[name=payment]:checked");

    if (!paymentElement) {
        msg.textContent = "Please select a payment method.";
        return;
    }

    const payment = paymentElement.value;

    if (!name) {
        msg.textContent = "Please enter your name.";
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        msg.textContent =
            "Enter a valid 10-digit mobile number.";
        return;
    }

    if (!address) {
        msg.textContent =
            "Please enter your delivery address.";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Placing order…";

    try {

        const order = await createOrderFromCart(
            user,
            name,
            phone,
            address,
            payment
        );

        sessionStorage.setItem(
            "lastOrder",
            JSON.stringify(order)
        );

        location.href =
            `confirmation.html?id=${order.id}`;

    } catch (err) {

        msg.textContent =
            err.message ||
            "Unable to place order.";

        btn.disabled = false;
        btn.textContent = "Place Order";
    }
}


document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("checkoutForm");

    if (form) {
        form.addEventListener(
            "submit",
            placeOrder
        );
    }

    loadCheckout();
});
