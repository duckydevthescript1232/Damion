# Damiøn Music Services

Production storefront for Damiøn music services.

## Live functionality
- Multi-page responsive storefront
- Service package configurator and persistent cart
- Server-verified PayPal checkout via Supabase Edge Functions
- Orders stored in `damion_paypal_orders`
- Contact form stored in `damion_contact_messages`
- Lightweight SVG branding and browser-generated audio previews
- Terms, privacy and refund pages

## Deployment
This repository is ready for Vercel as a static site. No build command is required.

Recovery deploy marker: 2026-08-29 stable UI restore.

## Backend
The public site only contains the Supabase legacy anon key, which is designed to be public. PayPal secret credentials remain in Supabase Edge Function secrets and must never be committed to GitHub.
