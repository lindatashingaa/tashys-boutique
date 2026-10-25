# Tashy's Boutique

## Business overview

TASHY'S BOUTIQUE is a women's fashion boutique based in Harare, Zimbabwe, selling clothes and shoes. The Clothes collection groups dresses, suits, skirts, and blouses together. The physical shop currently supports customers in person and through WhatsApp at **0711692134**.

## Problem

Customers have no online catalogue to browse products and stock, no persistent online cart or order history, and no automated checkout/payment workflow.

## Solution

This project provides a responsive online store with a searchable product catalogue, customer accounts, saved carts, delivery checkout, simulated payment, and an admin workspace for products, categories, customers, and order fulfillment. The payment flow is a demonstration only and never charges a real card.

## Objectives

- Make the boutique catalogue available online on desktop and mobile.
- Let customers discover, filter, and review products and stock availability.
- Support account registration, persistent carts, checkout, and order tracking.
- Give staff protected tools to maintain stock, catalogue details, and order status.
- Make the Harare shop easy to contact by WhatsApp, phone, and email.

## How the system works

### Customer journey

1. Browse collections, search products, and review item details and stock.
2. Register or sign in, then add products to the account's persistent cart.
3. Enter delivery name, email, phone, street address, and city at checkout.
4. Use the mock payment page to simulate success or failure. A successful simulation marks the order paid, decrements stock, clears the cart, and opens order history. A failed simulation leaves the order available to retry.
5. Review order status and delivery details in the account.

### Admin journey

Admins sign in with the seeded admin account to view store totals and manage products, categories, customers, and all orders. Order status changes are recorded in the database.

## Business value

- Keeps the product catalogue and stock information available beyond shop opening hours.
- Gives customers a direct path from product discovery to an order request.
- Reduces manual order tracking through saved carts and customer order history.
- Lets the boutique update the catalogue and fulfillment status without editing code.
- Keeps WhatsApp contact available for product questions and personal service.

## Features

- Branded home page with campaign hero, six featured products, collection links, promotion, and contact information.
- Product search, category filtering, price sorting, stock labels, and product detail pages.
- Registration and login with Zod validation, bcrypt password hashing, and signed HTTP-only session cookies.
- Customer-specific cart, delivery checkout, mock payment success/failure, and order history/detail pages.
- Protected admin dashboard with user/product/order/revenue statistics and product/category CRUD.
- Admin order status and customer management.
- SQLite/PostgreSQL schema and seed data for nine products based on the supplied public images, Clothes and Shoes categories, and demo accounts.
- Responsive luxury pink, black, and white interface with loading/error states and a floating WhatsApp link.
- Prisma queries, validated API inputs, same-origin mutation checks, React's escaped rendering, and security headers.

## Tools and technologies

- Visual Studio Code for development
- Node.js and npm for runtime and package management
- PostgreSQL for persistent application data
- Git for source control
- Browser developer tools for responsive testing and screenshots

## Tech stack

Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma ORM, Zod, bcryptjs, jose JWT sessions, and Lucide icons.

## Install and run

1. Install Node.js 20 or later. SQLite is included and needs no separate server.
2. Copy `.env.example` to `.env`; set `DATABASE_URL` to `file:./dev.db` and use a unique `NEXTAUTH_SECRET` for local sessions.
4. From the project root, run:

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   npm run db:seed
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

The local setup uses SQLite for quick testing. The local `file:./dev.db` URL is not suitable for Vercel: its filesystem is ephemeral and cannot provide persistent production data. Before deployment, change the datasource provider in `prisma/schema.prisma` to `postgresql`, create a hosted PostgreSQL database, set its connection string as Vercel's `DATABASE_URL`, then run Prisma generate, db push, and seed against that database. Add a strong `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Vercel's environment settings. `npm run build` generates Prisma Client and creates an optimized production build.

## Demo credentials and contact

- Admin: `admin@tashys.com` / `admin123`
- Customer: `customer@test.com` / `customer123`
- Phone and WhatsApp: [0711692134](https://wa.me/263711692134)
- Email: [tashys.boutique@gmail.com](mailto:tashys.boutique@gmail.com)
- Location: Harare, Zimbabwe

The seed script hashes the demo passwords. Replace demo passwords and the session secret before a real deployment.

## Folder structure

```text
app/                  App Router pages, API routes, and Server Action
components/           Storefront, account, checkout, order, admin, and WhatsApp UI
lib/                  Prisma client, session helpers, validation, catalog fallback
prisma/schema.prisma  PostgreSQL data model
prisma/seed.ts        Categories, products, and demo accounts
middleware.ts         Same-origin mutation checks and security headers
README.md             Business proposal summary and setup guide
```

## Screenshots

Run `npm run dev`, open the storefront and admin pages, and use browser developer tools or the browser screenshot feature at desktop and mobile widths. Product photos are served from `public/images` and work without an external image host.

## Payment disclaimer

The checkout payment option is a mock simulation. It does not collect card data, contact a payment gateway, or make real payments. Connect a payment provider and add production monitoring, rate limiting, backups, and secret management before using the site for live transactions.