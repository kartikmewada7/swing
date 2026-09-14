# Foodie Express - Supabase Online Setup

This version does not require Oracle Database, SQL Developer, or a local database server.

## 1. Create a Supabase project

1. Open https://supabase.com/
2. Sign in and click **New project**.
3. Choose an organization.
4. Project name: `FoodieExpress`
5. Create a strong database password and save it privately.
6. Choose a nearby region.
7. Create the project and wait until it is ready.

## 2. Create the database

1. Open the Supabase project.
2. Open **SQL Editor**.
3. Click **New query**.
4. Open `database/supabase_database.sql` from this project.
5. Copy the complete SQL file into the SQL Editor.
6. Click **Run**.
7. Open **Table Editor** and confirm these tables exist:
   - profiles
   - categories
   - food_items
   - cart_items
   - orders
   - order_items

## 3. Add the project URL and key

1. In Supabase, open **Project Settings > API**.
2. Copy the Project URL.
3. Copy the public anon/publishable key.
4. Open `frontend/js/supabase-config.js`.
5. Replace:
   `PASTE_YOUR_SUPABASE_PROJECT_URL_HERE`
6. Replace:
   `PASTE_YOUR_SUPABASE_ANON_KEY_HERE`

Never put the `service_role` secret key in frontend JavaScript.

## 4. Enable email authentication

1. Open **Authentication > Providers > Email**.
2. Enable Email authentication.
3. For normal signup with verification, keep email confirmation enabled.
4. Supabase can send authentication emails using its default email service for development/testing.

## 5. Custom Gmail SMTP (optional)

For your own Gmail sender:

1. Enable 2-Step Verification on the Gmail account.
2. Create a Google App Password.
3. In Supabase open **Authentication > SMTP Settings**.
4. Enable Custom SMTP.
5. Use:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: your Gmail address
   - Password: your 16-character Google App Password
   - Sender email: your Gmail address
   - Sender name: `Foodie Express`
6. Save.

Do not put the Gmail App Password inside any frontend JavaScript file.

## 6. Run frontend locally

Install the VS Code extension **Live Server**.

Then:

1. Open the project folder in VS Code.
2. Open `frontend/index.html`.
3. Right-click it.
4. Select **Open with Live Server**.

No Python/FastAPI backend is required for this Supabase-direct version.

## 7. Put frontend online

You can deploy the `frontend` folder to Netlify, Vercel, or another static host.

After deployment, add the deployed site URL to the allowed redirect/site URLs in Supabase Authentication URL Configuration.

## Authentication design

- Signup/password: Supabase Auth
- Email verification: Supabase Auth
- Email OTP: Supabase Auth
- SMTP: Supabase managed email or optional Gmail custom SMTP
- Passwords: handled securely by Supabase Auth, not stored in your own table

## Database design

- `auth.users`: managed by Supabase
- `profiles`: user profile data
- `food_items`: menu
- `cart_items`: per-user cart
- `orders`: order headers
- `order_items`: individual food items in an order

Row Level Security policies ensure authenticated users can access only their own cart, orders, and profile.


## 8. IMPORTANT: Change the confirmation email to a 6-digit OTP

The default Supabase confirmation email uses a clickable confirmation link.
This project uses a 6-digit OTP input on the website.

Open:

Authentication
→ Email Templates
→ Confirm signup

Replace the template body with:

```html
<h2>Foodie Express - Email Verification</h2>

<p>Hello,</p>

<p>Your Foodie Express verification OTP is:</p>

<h1>{{ .Token }}</h1>

<p>Enter this 6-digit code on the Foodie Express website.</p>

<p>This code is for email verification.</p>
```

Save the template.

Do not use `{{ .ConfirmationURL }}` for this OTP template.

The fixed login page now uses Supabase Auth directly:
- signup
- 6-digit OTP
- OTP verification
- resend OTP
- password login after verification

Supabase requires the email template to use `{{ .Token }}` when you want a six-digit OTP instead of a magic link.
