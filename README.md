# Foodie Express - Supabase Final

Oracle has been removed from this version.

The project now uses:

- HTML
- CSS
- JavaScript
- Supabase PostgreSQL
- Supabase Authentication
- Email verification / OTP support
- Optional Gmail Custom SMTP
- Row Level Security

## Start here

Read `SETUP_SUPABASE.md`.

## Important files

- `database/supabase_database.sql`
- `frontend/js/supabase-config.js`
- `frontend/js/auth.js`
- `frontend/js/database.js`

All newly added source code is formatted line by line for readability.


## OTP Fix

The login page is fully connected to Supabase Auth.

Signup sends a six-digit OTP, the user enters the OTP, and `verifyOtp()` verifies it.

Before testing, change the Supabase **Confirm signup** email template to use `{{ .Token }}`. See `SETUP_SUPABASE.md`.
