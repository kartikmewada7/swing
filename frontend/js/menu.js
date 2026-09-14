function foodImage(url) {
    return `
        <img
            src="${url}"
            alt="Food image"
            loading="lazy"
            style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;"
            onerror="this.style.display='none';this.parentElement.textContent='🍽️';"
        >
    `;
}

const IMAGE_URLS = {
    pizza: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",
    pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
    coffee: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
    fries: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
    dessert: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",
    sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=80",
    wrap: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80"
};

const foods = [
    {
        id: 1,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 299,
        rating: 4.8,
        emoji: foodImage(IMAGE_URLS.pizza),
        description: "Classic tomato, mozzarella and basil."
    },
    {
        id: 2,
        name: "Farmhouse Pizza",
        category: "Pizza",
        price: 349,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.pizza),
        description: "Onion, capsicum, corn and vegetables."
    },
    {
        id: 3,
        name: "Paneer Tikka Pizza",
        category: "Pizza",
        price: 379,
        rating: 4.9,
        emoji: foodImage(IMAGE_URLS.pizza),
        description: "Paneer tikka with spicy sauce."
    },
    {
        id: 4,
        name: "Classic Burger",
        category: "Burger",
        price: 179,
        rating: 4.6,
        emoji: foodImage(IMAGE_URLS.burger),
        description: "Juicy patty, lettuce and tomato."
    },
    {
        id: 5,
        name: "Cheese Burger",
        category: "Burger",
        price: 219,
        rating: 4.8,
        emoji: foodImage(IMAGE_URLS.burger),
        description: "Cheese burger with smoky sauce."
    },
    {
        id: 6,
        name: "Veggie Burger",
        category: "Burger",
        price: 159,
        rating: 4.5,
        emoji: foodImage(IMAGE_URLS.burger),
        description: "Crispy vegetable patty."
    },
    {
        id: 7,
        name: "White Sauce Pasta",
        category: "Pasta",
        price: 249,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.pasta),
        description: "Creamy white sauce pasta."
    },
    {
        id: 8,
        name: "Arrabbiata Pasta",
        category: "Pasta",
        price: 229,
        rating: 4.6,
        emoji: foodImage(IMAGE_URLS.pasta),
        description: "Spicy tomato-garlic pasta."
    },
    {
        id: 9,
        name: "Masala Pasta",
        category: "Pasta",
        price: 239,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.pasta),
        description: "Indian-style masala pasta."
    },
    {
        id: 10,
        name: "Cold Coffee",
        category: "Drinks",
        price: 129,
        rating: 4.6,
        emoji: foodImage(IMAGE_URLS.coffee),
        description: "Chilled creamy coffee."
    },
    {
        id: 11,
        name: "Fresh Lime Soda",
        category: "Drinks",
        price: 99,
        rating: 4.5,
        emoji: foodImage(IMAGE_URLS.soda),
        description: "Refreshing lemon soda."
    },
    {
        id: 12,
        name: "Chocolate Shake",
        category: "Drinks",
        price: 159,
        rating: 4.8,
        emoji: foodImage(IMAGE_URLS.coffee),
        description: "Thick chocolate milkshake."
    },
    {
        id: 13,
        name: "French Fries",
        category: "Sides",
        price: 119,
        rating: 4.6,
        emoji: foodImage(IMAGE_URLS.fries),
        description: "Golden crispy seasoned fries."
    },
    {
        id: 14,
        name: "Garlic Bread",
        category: "Sides",
        price: 139,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.bread),
        description: "Garlic butter toasted bread."
    },
    {
        id: 15,
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 149,
        rating: 4.9,
        emoji: foodImage(IMAGE_URLS.dessert),
        description: "Warm fudgy chocolate brownie."
    },
    {
        id: 16,
        name: "Ice Cream Sundae",
        category: "Desserts",
        price: 169,
        rating: 4.8,
        emoji: foodImage(IMAGE_URLS.icecream),
        description: "Vanilla ice cream with chocolate."
    },
    {
        id: 17,
        name: "Gulab Jamun",
        category: "Desserts",
        price: 109,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.gulab),
        description: "Soft sweet dumplings in syrup."
    },
    {
        id: 18,
        name: "Veg Sandwich",
        category: "Sandwich",
        price: 149,
        rating: 4.5,
        emoji: foodImage(IMAGE_URLS.sandwich),
        description: "Fresh vegetables and cheese."
    },
    {
        id: 19,
        name: "Grilled Cheese Sandwich",
        category: "Sandwich",
        price: 189,
        rating: 4.7,
        emoji: foodImage(IMAGE_URLS.sandwich),
        description: "Golden bread with melted cheese."
    },
    {
        id: 20,
        name: "Paneer Wrap",
        category: "Wraps",
        price: 199,
        rating: 4.8,
        emoji: foodImage(IMAGE_URLS.wrap),
        description: "Spicy paneer wrapped with salad."
    }
];

let selectedCategory = "All";

function createFoodCard(food) {
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
                    ${escapeHtml(food.description)}
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
                        onclick="addFoodToCart(${food.id})"
                    >
                        Add
                    </button>

                </div>
            </div>
        </article>
    `;
}

async function addFoodToCart(foodId) {
    const food =
        foods.find(
            item => item.id === foodId
        );

    if (!food) {
        return;
    }

    try {
        const user = await getCurrentUser();

        if (!user) {
            alert("Please login first.");
            window.location.href = "login.html";
            return;
        }

        await addToCart(
            user.id,
            foodId,
            1
        );

        alert(food.name + " added to cart.");
        await refreshCartCount();
    } catch (error) {
        alert(error.message);
    }
}

function renderCategories() {
    const container =
        document.getElementById(
            "categoryButtons"
        );

    if (!container) {
        return;
    }

    const categories = [
        "All",
        ...new Set(
            foods.map(
                food => food.category
            )
        )
    ];

    container.innerHTML =
        categories
            .map(category => `
                <button
                    class="category-button ${
                        category ===
                        selectedCategory
                            ? "active"
                            : ""
                    }"
                    data-category="${category}"
                >
                    ${category}
                </button>
            `)
            .join("");

    document
        .querySelectorAll(
            ".category-button"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    selectedCategory =
                        button.dataset.category;

                    renderCategories();
                    renderMenu();
                }
            );
        });
}

function renderMenu() {
    const grid =
        document.getElementById(
            "menuGrid"
        );

    if (!grid) {
        return;
    }

    const query =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .trim()
            .toLowerCase();

    const filtered =
        foods.filter(food => {

            const categoryMatch =
                selectedCategory === "All" ||
                food.category ===
                    selectedCategory;

            const searchMatch =
                food.name
                    .toLowerCase()
                    .includes(query);

            return (
                categoryMatch &&
                searchMatch
            );
        });

    grid.innerHTML =
        filtered
            .map(createFoodCard)
            .join("");
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderCategories();

        document
            .getElementById(
                "searchInput"
            )
            .addEventListener(
                "input",
                renderMenu
            );

        renderMenu();
    }
);


async function refreshCartCount() {
    const element = document.getElementById("cartCount");

    if (!element) {
        return;
    }

    const user = await getCurrentUser();

    if (!user) {
        element.textContent = "0";
        return;
    }

    try {
        const items = await getUserCartItems(user.id);
        element.textContent = items.reduce((sum, item) => sum + item.quantity, 0);
    } catch (error) {
        console.error("Cart count error:", error);
    }
}
