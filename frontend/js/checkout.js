async function placeOrder(event) {
    event.preventDefault();

    const user =
        getUser();

    if (!user) {
        window.location.href =
            "login.html";

        return;
    }

    const cart =
        getCart();

    if (cart.length === 0) {
        alert(
            "Your cart is empty."
        );

        return;
    }

    const message =
        document.getElementById(
            "checkoutMessage"
        );

    const orderData = {
        user_id:
            user.user_id,

        customer_name:
            document
                .getElementById(
                    "customerName"
                )
                .value
                .trim(),

        customer_phone:
            document
                .getElementById(
                    "customerPhone"
                )
                .value
                .trim(),

        delivery_address:
            document
                .getElementById(
                    "customerAddress"
                )
                .value
                .trim(),

        payment_method:
            document.querySelector(
                "input[name='payment']:checked"
            ).value,

        items:
            cart
    };

    try {
        message.textContent =
            "Placing order...";

        const result =
            await apiRequest(
                "/orders",
                {
                    method: "POST",
                    body:
                        JSON.stringify(
                            orderData
                        )
                }
            );

        localStorage.removeItem(
            CART_KEY
        );

        localStorage.setItem(
            "lastOrder",
            JSON.stringify(result)
        );

        window.location.href =
            "confirmation.html";

    } catch (error) {
        message.textContent =
            error.message;
    }
}

async function renderCheckout() {
    const user =
        getUser();

    if (!user) {
        window.location.href =
            "login.html";

        return;
    }

    const nameInput =
        document.getElementById(
            "customerName"
        );

    const phoneInput =
        document.getElementById(
            "customerPhone"
        );

    nameInput.value =
        user.name;

    phoneInput.value =
        user.phone || "";

    const items =
        getCart();

    const summary =
        document.getElementById(
            "checkoutSummary"
        );

    if (items.length === 0) {
        summary.innerHTML = `
            <h2>
                Your cart is empty.
            </h2>
        `;

        return;
    }

    const foodMap =
        new Map(
            foods.map(
                food => [
                    food.id,
                    food
                ]
            )
        );

    let total = 0;

    summary.innerHTML =
        items
            .map(item => {

                const food =
                    foodMap.get(
                        item.foodId
                    );

                const amount =
                    food.price *
                    item.quantity;

                total += amount;

                return `
                    <div class="summary-line">
                        <span>
                            ${escapeHtml(
                                food.name
                            )}
                            ×
                            ${item.quantity}
                        </span>

                        <strong>
                            ${formatMoney(
                                amount
                            )}
                        </strong>
                    </div>
                `;
            })
            .join("") +
        `
            <div class="summary-line total-line">
                <span>Total</span>
                <strong>
                    ${formatMoney(total)}
                </strong>
            </div>
        `;
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderCheckout();

        document
            .getElementById(
                "checkoutForm"
            )
            .addEventListener(
                "submit",
                placeOrder
            );
    }
);
