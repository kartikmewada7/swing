const featuredFoods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 299,
        rating: 4.8,
        emoji: "🍕",
        description: "Tomato, mozzarella and basil."
    },
    {
        id: 4,
        name: "Classic Burger",
        category: "Burger",
        price: 179,
        rating: 4.6,
        emoji: "🍔",
        description: "Juicy patty with fresh vegetables."
    },
    {
        id: 7,
        name: "White Sauce Pasta",
        category: "Pasta",
        price: 249,
        rating: 4.7,
        emoji: "🍝",
        description: "Creamy pasta with herbs."
    },
    {
        id: 12,
        name: "Chocolate Shake",
        category: "Drinks",
        price: 159,
        rating: 4.8,
        emoji: "🥤",
        description: "Thick chilled chocolate shake."
    }
];

function homeCard(food) {
    return `
        <article class="food-card">

            <div class="food-image">
                ${food.emoji}
            </div>

            <div class="food-body">

                <h3>
                    ${escapeHtml(food.name)}
                </h3>

                <div class="food-meta">
                    <span>
                        ${food.category}
                    </span>

                    <span>
                        ⭐ ${food.rating}
                    </span>
                </div>

                <p class="food-description">
                    ${food.description}
                </p>

                <strong class="price">
                    ${formatMoney(food.price)}
                </strong>

                <div class="card-actions">
                    <a
                        class="small-button"
                        href="food-details.html?id=${food.id}"
                    >
                        Details
                    </a>

                    <button
                        class="small-button primary"
                        onclick="quickAdd(${food.id})"
                    >
                        Add
                    </button>
                </div>

            </div>
        </article>
    `;
}

function quickAdd(foodId) {
    const item =
        featuredFoods.find(
            food => food.id === foodId
        );

    if (!item) {
        return;
    }

    const cart =
        getCart();

    const existing =
        cart.find(
            cartItem =>
                cartItem.foodId === foodId
        );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            foodId: foodId,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(
        item.name +
        " added to cart."
    );
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        const grid =
            document.getElementById(
                "featuredGrid"
            );

        if (grid) {
            grid.innerHTML =
                featuredFoods
                    .map(homeCard)
                    .join("");
        }
    }
);
