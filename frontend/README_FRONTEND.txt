# Foodie Express Frontend
Responsive mobile-first frontend for the Supabase-backed Foodie Express project.

Important:
- Keep `js/supabase-config.js` with your working Supabase URL/key.
- Upload the contents of this `frontend` folder as the Cloudflare static output.
- The app uses Supabase Auth, PostgreSQL food_items/cart_items/orders/order_items.
- No localStorage cart is used for ordering; cart data is stored in Supabase.
