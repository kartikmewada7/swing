async function loadOrders() {
    const container =
        document.getElementById(
            "ordersContainer"
        );

    const user =
        getUser();

    if (!user) {
        container.innerHTML = `
            <div class="empty">
                <h2>
                    Please login first.
                </h2>

                <br>

                <a
                    href="login.html"
                    class="btn"
                >
                    Login
                </a>
            </div>
        `;

        return;
    }

    try {
        const orders =
            await apiRequest(
                `/orders/user/${user.user_id}`
            );

        if (orders.length === 0) {
            container.innerHTML = `
                <div class="empty">
                    <h2>
                        No orders yet.
                    </h2>

                    <br>

                    <a
                        href="menu.html"
                        class="btn"
                    >
                        Start Ordering
                    </a>
                </div>
            `;

            return;
        }

        container.innerHTML =
            orders
                .map(order => `
                    <article class="order-card">

                        <div class="order-header">

                            <div>
                                <strong>
                                    Order
                                    ${order.order_id}
                                </strong>

                                <p class="muted">
                                    ${order.order_date}
                                </p>
                            </div>

                            <span class="status">
                                ${order.status}
                            </span>

                        </div>

                        <ul>
                            ${order.items
                                .map(item => `
                                    <li>
                                        ${escapeHtml(
                                            item.food_name
                                        )}
                                        ×
                                        ${item.quantity}
                                        —
                                        ${formatMoney(
                                            item.price *
                                            item.quantity
                                        )}
                                    </li>
                                `)
                                .join("")}
                        </ul>

                        <strong>
                            Total:
                            ${formatMoney(
                                order.total_amount
                            )}
                        </strong>

                        <p class="muted">
                            Delivery:
                            ${escapeHtml(
                                order.delivery_address
                            )}
                        </p>

                    </article>
                `)
                .join("");

    } catch (error) {
        container.innerHTML = `
            <div class="empty">
                ${escapeHtml(
                    error.message
                )}
            </div>
        `;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadOrders
);
