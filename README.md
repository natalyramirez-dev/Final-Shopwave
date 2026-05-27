# Final-Shopwave
Application with TypeScript and Nest.js, simple application of a store for final presentation of the subject Web Technology II

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


22/05/2026
## Project Architecture

The project follows a modular and scalable architecture using Next.js and TypeScript.

### Global Types

Reusable global types were created to ensure consistency across the application:

- `role.type.ts`
- `api-response.type.ts`
- `form-state.type.ts`

### Models

Centralized TypeScript models are used for shared application entities:

- `user.model.ts`
- `auth.model.ts`
- `product.model.ts`

### Reusable UI Components

Reusable UI components were implemented to maintain visual consistency and scalability:

- Button
- Input
- Spinner
- Empty State Card

24/05/2026
## Home Page and Products Catalog

The application now includes a modern ecommerce interface built with reusable components and SCSS modules.

### Home Page (`app/page.tsx`)

The main page was redesigned to provide a more professional ecommerce experience.

#### Features
- Responsive Navbar
- Hero section
- Featured products section
- Reusable UI components
- Responsive layout using CSS Grid
- SCSS module structure
- Clean architecture with separated components

---

### Products Catalog (`app/products/page.tsx`)

The products page was implemented as a complete catalog view connected to the backend services.

#### Features
- Dynamic product listing
- Product search
- Category filters
- Pagination system
- Responsive products grid
- Empty state handling
- Loading states
- Integration with product services

---

### Reusable Components

The following reusable components are used across the application:

- Navbar
- Hero
- ProductCard
- EmptyState

---

### Styling

The project uses:
- SCSS Modules
- Responsive units (`rem`, `%`, `vh`)
- CSS Grid for layouts
- Reusable and maintainable styles

---

### Backend Integration

Products are fetched from the backend API using:

```ts
GET /products

---


