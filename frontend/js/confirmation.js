function showConfirmation() {
    const container =
        document.getElementById(
            "confirmation"
        );

    const order =
        JSON.parse(
            localStorage.getItem(
                "lastOrder"
            ) || "null"
        );

    if (!order) {
        container.innerHTML = `
            <h2>No recent order found.</h2>
            <br>
            <a href="menu.html" class="btn">
                Go to Menu
            </a>
        `;

        return;
    }

    container.innerHTML = `
        <div class="success-icon">
            ✅
        </div>

        <h1>
            Order Confirmed!
        </h1>

        <p>
            Order ID:
            <strong>
                ${order.order_id}
            </strong>
        </p>

        <p>
            Estimated delivery:
            <strong>
                30–45 minutes
            </strong>
        </p>

        <p>
            Status:
            <span class="status">
                ${order.status}
            </span>
        </p>

        <h2>
            ${formatMoney(
                order.total_amount
            )}
        </h2>

        <br>

        <a
            href="orders.html"
            class="btn"
        >
            View Orders
        </a>
    `;
}

document.addEventListener(
    "DOMContentLoaded",
    showConfirmation
);
