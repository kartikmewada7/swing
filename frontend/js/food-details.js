function renderFoodDetails() {
    const container =
        document.getElementById(
            "foodDetails"
        );

    const foodId =
        Number(
            new URLSearchParams(
                window.location.search
            ).get("id")
        );

    const food =
        foods.find(
            item => item.id === foodId
        );

    if (!food) {
        container.innerHTML = `
            <div class="empty">
                <h2>Food not found.</h2>
                <a href="menu.html" class="btn">
                    Back to Menu
                </a>
            </div>
        `;

        return;
    }

    let quantity = 1;

    container.innerHTML = `
        <div class="details-layout">

            <div class="details-image">
                ${food.emoji}
            </div>

            <div class="details-content">

                <span class="eyebrow">
                    ${food.category}
                </span>

                <h1>
                    ${escapeHtml(food.name)}
                </h1>

                <p>
                    ⭐ ${food.rating}
                </p>

                <p>
                    ${escapeHtml(food.description)}
                </p>

                <div class="details-price">
                    ${formatMoney(food.price)}
                </div>

                <div class="quantity-control">

                    <button
                        id="minus"
                        class="quantity-button"
                    >
                        −
                    </button>

                    <strong id="quantity">
                        1
                    </strong>

                    <button
                        id="plus"
                        class="quantity-button"
                    >
                        +
                    </button>

                </div>

                <button
                    id="addButton"
                    class="btn"
                >
                    Add to Cart
                </button>

            </div>
        </div>
    `;

    document
        .getElementById("minus")
        .addEventListener(
            "click",
            () => {
                if (quantity > 1) {
                    quantity -= 1;
                    document
                        .getElementById(
                            "quantity"
                        )
                        .textContent =
                        quantity;
                }
            }
        );

    document
        .getElementById("plus")
        .addEventListener(
            "click",
            () => {
                quantity += 1;
                document
                    .getElementById(
                        "quantity"
                    )
                    .textContent =
                    quantity;
            }
        );

    document
        .getElementById("addButton")
        .addEventListener(
            "click",
            () => {
                const cart =
                    getCart();

                const existing =
                    cart.find(
                        item =>
                            item.foodId ===
                            food.id
                    );

                if (existing) {
                    existing.quantity +=
                        quantity;
                } else {
                    cart.push({
                        foodId: food.id,
                        quantity: quantity
                    });
                }

                saveCart(cart);

                alert(
                    food.name +
                    " added to cart."
                );
            }
        );
}

document.addEventListener(
    "DOMContentLoaded",
    renderFoodDetails
);
