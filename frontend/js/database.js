// Supabase database helpers for Foodie Express.
// This file also keeps the old checkout/orders pages compatible
// with the new Supabase backend.

async function getFoodItems() {
    const result = await supabaseClient
        .from("food_items")
        .select("id, name, description, price, image_url, is_available")
        .eq("is_available", true)
        .order("id");

    if (result.error) {
        throw result.error;
    }

    return result.data || [];
}

async function getCartItems(userId) {
    const result = await supabaseClient
        .from("cart_items")
        .select(`
            id,
            quantity,
            food_id,
            food_items (
                id,
                name,
                price,
                image_url
            )
        `)
        .eq("user_id", userId)
        .order("id");

    if (result.error) {
        throw result.error;
    }

    return result.data || [];
}

async function addToCart(userId, foodId, quantity = 1) {
    const existing = await supabaseClient
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", userId)
        .eq("food_id", foodId)
        .maybeSingle();

    if (existing.error) {
        throw existing.error;
    }

    if (existing.data) {
        const updated = await supabaseClient
            .from("cart_items")
            .update({
                quantity: existing.data.quantity + quantity
            })
            .eq("id", existing.data.id)
            .select()
            .single();

        if (updated.error) {
            throw updated.error;
        }

        return updated.data;
    }

    const inserted = await supabaseClient
        .from("cart_items")
        .insert({
            user_id: userId,
            food_id: foodId,
            quantity: quantity
        })
        .select()
        .single();

    if (inserted.error) {
        throw inserted.error;
    }

    return inserted.data;
}

async function updateCartQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
        return removeCartItem(cartItemId);
    }

    const result = await supabaseClient
        .from("cart_items")
        .update({ quantity: quantity })
        .eq("id", cartItemId)
        .select()
        .single();

    if (result.error) {
        throw result.error;
    }

    return result.data;
}

async function removeCartItem(cartItemId) {
    const result = await supabaseClient
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

    if (result.error) {
        throw result.error;
    }
}

// Compatibility function used by the existing checkout page.
async function apiRequest(path, options = {}) {
    if (path === "/orders" && options.method === "POST") {
        const body = JSON.parse(options.body || "{}");
        return await createOrderFromLocalCart(body);
    }

    const match = path.match(/^\/orders\/user\/(.+)$/);

    if (match && (!options.method || options.method === "GET")) {
        return await getOrders(match[1]);
    }

    throw new Error("Unsupported API request: " + path);
}

async function createOrderFromLocalCart(orderData) {
    const cart = Array.isArray(orderData.items)
        ? orderData.items
        : [];

    if (cart.length === 0) {
        throw new Error("Your cart is empty.");
    }

    const foodIds = cart.map(item => item.foodId);

    const foodResult = await supabaseClient
        .from("food_items")
        .select("id, name, price")
        .in("id", foodIds);

    if (foodResult.error) {
        throw foodResult.error;
    }

    const foodMap = new Map(
        (foodResult.data || []).map(food => [food.id, food])
    );

    let total = 0;
    const orderItems = [];

    for (const cartItem of cart) {
        const food = foodMap.get(cartItem.foodId);

        if (!food) {
            throw new Error("Food item not found: " + cartItem.foodId);
        }

        const quantity = Number(cartItem.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("Invalid cart quantity.");
        }

        total += Number(food.price) * quantity;

        orderItems.push({
            food_id: food.id,
            food_name: food.name,
            price: food.price,
            quantity: quantity
        });
    }

    const orderResult = await supabaseClient
        .from("orders")
        .insert({
            user_id: orderData.user_id,
            customer_name: orderData.customer_name || "",
            phone: orderData.customer_phone || "",
            address: orderData.delivery_address || "",
            payment_method: orderData.payment_method || "COD",
            total_amount: total,
            status: "Placed"
        })
        .select()
        .single();

    if (orderResult.error) {
        throw orderResult.error;
    }

    const rows = orderItems.map(item => ({
        order_id: orderResult.data.id,
        ...item
    }));

    const itemsResult = await supabaseClient
        .from("order_items")
        .insert(rows);

    if (itemsResult.error) {
        await supabaseClient
            .from("orders")
            .delete()
            .eq("id", orderResult.data.id);

        throw itemsResult.error;
    }

    // Clear the Supabase cart as well as the browser cart.
    await supabaseClient
        .from("cart_items")
        .delete()
        .eq("user_id", orderData.user_id);

    localStorage.removeItem("foodie_cart");

    return {
        order_id: orderResult.data.id,
        order_date: orderResult.data.created_at,
        status: orderResult.data.status,
        total_amount: total,
        delivery_address: orderResult.data.address,
        items: orderItems
    };
}

async function getOrders(userId) {
    const result = await supabaseClient
        .from("orders")
        .select(`
            id,
            total_amount,
            status,
            payment_method,
            address,
            created_at,
            order_items (
                id,
                food_name,
                price,
                quantity
            )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (result.error) {
        throw result.error;
    }

    return (result.data || []).map(order => ({
        order_id: order.id,
        order_date: new Date(order.created_at).toLocaleString(),
        status: order.status,
        payment_method: order.payment_method,
        delivery_address: order.address,
        total_amount: order.total_amount,
        items: order.order_items || []
    }));
}
