# ShopWave Fusion — Final Project

> **Web Technology II · Final Presentation**
> A full-stack e-commerce platform built with **Next.js 16 + React 19 + TypeScript**, consuming a **Spring Boot REST API** secured with **JWT authentication** and **role-based access control**.

---

## Table of Contents

1. [Tech Stack](#-tech-stack)
2. [Project Architecture](#-project-architecture)
3. [Folder Structure](#-folder-structure)
4. [Security: JWT, Guards & Role-Based Routes](#-security-jwt-guards--role-based-routes)
5. [API Integration](#-api-integration)
6. [Reusable Components](#-reusable-components)
7. [Business Flow](#-business-flow)
8. [Admin Panel](#-admin-panel)
9. [UX/UI & Responsive Design](#-uxui--responsive-design)
10. [Git Workflow](#-git-workflow)
11. [Getting Started](#-getting-started)
12. [Team](#-team)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI Library | React 19 |
| Styling | SCSS Modules + CSS Variables |
| HTTP Client | Native Fetch API (custom wrapper) |
| Auth | JWT (Bearer Token) |
| Backend | Spring Boot REST API |
| Linting | ESLint 9 + eslint-config-next |

---

## Project Architecture

The project follows a **layered, modular architecture** with strict separation of concerns. Each layer has a single well-defined responsibility.

```
┌─────────────────────────────────────────────────┐
│                  Next.js Pages                  │  ← Routing & rendering
├─────────────────────────────────────────────────┤
│              React Context (Global State)        │  ← AuthContext, CartContext
├─────────────────────────────────────────────────┤
│               Guards (Route Protection)          │  ← AuthGuard, AdminGuard
├─────────────────────────────────────────────────┤
│              Custom Hooks (useAuth, useCart...)  │  ← Business logic bridge
├─────────────────────────────────────────────────┤
│              Domain Services (*.service.ts)      │  ← API calls, isolated
├─────────────────────────────────────────────────┤
│        fetchApi Interceptor (api.service.ts)     │  ← JWT injection, error handling
├─────────────────────────────────────────────────┤
│              Spring Boot REST API                │  ← Backend (external)
└─────────────────────────────────────────────────┘
```

### Design Principles Applied
- **Separation of Concerns**: Components handle only the UI; services handle all network I/O.
- **DRY (Don't Repeat Yourself)**: Token logic, API calls, and validation are centralized in utilities.
- **Single Responsibility**: Each service file owns exactly one domain (auth, products, cart, orders, admin).
- **Zero-State Architecture**: Guards eliminate infinite render loops caused by Context API re-renders.

---

## Folder Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx                # Home
│   ├── login/
│   ├── register/
│   ├── products/
│   │   └── [id]/               # Dynamic product detail
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   │   └── [id]/               # Dynamic order receipt
│   ├── profile/
│   └── admin/                  # Role-protected admin section
│       ├── page.tsx
│       ├── dashboard/
│       ├── products/
│       │   └── [id]/edit/      # Dynamic edit route
│       └── orders/
│
├── components/                 # UI building blocks
│   ├── ui/                     # Generic reusable components
│   │   ├── EmptyState/
│   │   └── scss/               # All SCSS modules + _variables.scss
│   ├── layout/
│   │   ├── Navbar/
│   │   └── Hero/
│   ├── products/ProductCard/
│   ├── cart/CartItem/
│   ├── auth/                   # Login & Register modals
│   └── admin/                  # Admin-specific components (charts, forms, sidebar)
│
├── context/                    # React Contexts (global state)
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── guards/                     # Route protection HOCs
│   ├── AuthGuard.tsx
│   └── AdminGuard.tsx
│
├── hooks/                      # Custom React Hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useProducts.ts
│
├── models/                     # TypeScript interfaces mirroring backend entities
│   ├── user.model.ts
│   ├── auth.model.ts
│   ├── product.model.ts
│   ├── cart.model.ts
│   └── order.model.ts
│
├── services/                   # Domain-separated HTTP services
│   ├── api.service.ts          # ★ Central interceptor
│   ├── auth.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── admin-product.service.ts
│   └── admin-order.service.ts
│
├── types/                      # Global TypeScript types
│   ├── role.type.ts
│   ├── api-response.type.ts
│   └── form-state.type.ts
│
└── utils/                      # Pure helper functions
    ├── token.util.ts
    ├── user.util.ts
    └── validation.util.ts
```

---

## Security: JWT, Guards & Role-Based Routes

### JWT Authentication Flow

```
User submits credentials
        │
        ▼
POST /auth/signup  or  GET /auth/signin (Basic Auth)
        │
        ▼
Backend returns JWT in Authorization header
        │
        ├──► token.util.ts  → stores JWT in localStorage (key: shopwave_token)
        └──► user.util.ts   → stores user profile (key: shopwave_user)
        │
        ▼
AuthContext restores session on every page reload
```

### Token Utility (`src/utils/token.util.ts`)

All `localStorage` interactions are centralized — no component accesses storage directly.

```ts
setToken(token)   // persist after login
getToken()        // retrieve for API calls
removeToken()     // clear on logout / 401
hasToken()        // boolean check
```

### Route Protection with Guards

| Guard | File | Protects |
|---|---|---|
| `AuthGuard` | `src/guards/AuthGuard.tsx` | Any authenticated-only page |
| `AdminGuard` | `src/guards/AdminGuard.tsx` | All `/admin/**` routes |

`AdminGuard` performs a **dual validation**:
1. Checks for a valid JWT token.
2. Verifies the user's role is `ADMIN` or `ROLE_ADMIN`.

Users without the correct role are silently redirected to the home page — no content is rendered.

### Role-Based UI Segregation (Navbar)

The Navbar reads `user.role` from `AuthContext` and conditionally renders navigation links:

```
ROLE_ADMIN  → Dashboard · Products (Admin) · Orders (Admin)
CUSTOMER    → Products · Cart · My Orders · Profile
Guest       → Login · Register
```

### Session Expiry Handling

```
Backend returns 401
      │
      ▼
fetchApi interceptor detects it
      │
      ├──► removeToken()
      ├──► removeUser()
      └──► dispatches global 'auth-error' event
                  │
                  ▼
            AuthContext redirects → /login
```

---

## 🔌 API Integration

### Central HTTP Interceptor (`src/services/api.service.ts`)

All requests pass through a single `fetchApi<T>` wrapper that handles:

- **Automatic JWT injection**: reads token and attaches it to the `Authorization` header.
- **Token sanitization**: strips surrounding quotes and any accidental `Bearer` prefix that would cause Spring Boot's base64url parser to crash.
- **Cache invalidation**: forces `cache: 'no-store'` on every call to prevent Next.js from serving stale cart or order data.
- **Structured error handling**: parses the backend's `ErrorDetails` payload and surfaces the exact server message to the UI — generic errors are never shown.
- **Global session management**: dispatches `auth-error` on 401/403 responses.

### Domain Services

Each file in `src/services/` owns one domain and only calls `fetchApi`:

| Service | Responsibilities |
|---|---|
| `auth.service.ts` | `signup`, `signin` (Basic Auth), returns JWT + user profile |
| `product.service.ts` | Catalog listing with `URLSearchParams` for search, filters, pagination |
| `cart.service.ts` | Add (`PUT`), update quantity (`PUT`), remove item (`DELETE`), fetch cart |
| `order.service.ts` | Create order (checkout), fetch order by ID, fetch user order history |
| `admin-product.service.ts` | Admin CRUD: list, create, update (`PUT`), delete products |
| `admin-order.service.ts` | Fetch all orders globally, update order status |

### API Endpoints Reference

```
Auth
  GET  /auth/signin            Basic Auth → JWT + user
  POST /auth/signup            Register new user

Products
  GET  /products               Catalog (search, category, page params)
  GET  /products/{id}          Single product detail

Cart
  GET  /cart                   Fetch authenticated user's cart
  PUT  /cart/add               Add or update item
  DELETE /cart/{itemId}        Remove item

Orders
  POST /orders                 Place order (checkout)
  GET  /orders/{id}            Order detail / receipt
  GET  /orders/user            User order history

Admin
  POST   /products             Create product
  PUT    /products/{id}        Update product
  DELETE /products/{id}        Delete product
  GET    /orders/all           All orders (admin only)
  PUT    /orders/{id}/status   Update order status
```

---

## Reusable Components

The component library is organized to maximize reuse and maintain visual consistency across the application.

### Generic UI Components (`src/components/ui/`)

| Component | Purpose |
|---|---|
| `EmptyState` | Fallback UI for empty lists with configurable message and icon |
| `TeamCard` | Developer card for the about/team section |

### Layout Components (`src/components/layout/`)

| Component | Key Features |
|---|---|
| `Navbar` | Responsive, role-aware, dark mode, hamburger menu with CSS slide & fade animation |
| `Hero` | Full-viewport hero section with CTA buttons |

### Domain Components

| Component | Domain | Key Features |
|---|---|---|
| `ProductCard` | Products | Image, price, discount badge, "Add to Cart" action |
| `CartItem` | Cart | Quantity controls (+/−), per-item loading state (`isUpdating`), SVG trash icon |
| `LoginModal` | Auth | Modal with form validation, error display |
| `RegisterModal` | Auth | Modal with all required fields, redirects to login on success |

### Admin Components (`src/components/admin/`)

| Component | Purpose |
|---|---|
| `AdminSidebar` | Navigation sidebar for the admin section |
| `AdminLayout` | Shared layout wrapper for all admin pages |
| `ProductForm` | Shared create/edit form with type-safe field validation |
| `MetricCard` | KPI display card for dashboard |
| `DonutChart` | Visual data chart for admin dashboard |
| `MiniBarChart` | Compact bar chart for quick metric overviews |
| `StockAlerts` | Low-stock product alerts panel |

### Styling System

All styles use **SCSS Modules** with a shared `_variables.scss` token file:

```scss
// src/components/ui/scss/_variables.scss
$shadow-sm, $shadow-md, $shadow-lg   // consistent elevation
$radius-*                             // border radius scale
$color-primary, $color-accent, ...   // brand color tokens
```

No inline styles are used anywhere in the codebase.

---

## Business Flow

### Customer Journey

```
Browse Products (/products)
        │  search · filter by category · paginate
        ▼
Product Detail (/products/[id])
        │  select size · set quantity · stock validation
        ▼
Add to Cart  ──►  Cart (/cart)
                      │  adjust quantities · remove items · live totals
                      ▼
              Checkout (/checkout)
                      │  multi-step wizard:
                      │    Step 1: Shipping address
                      │    Step 2: Simulated payment (card formatting, CVC)
                      │  → POST /orders
                      │  → batch DELETE cart items (Promise.all)
                      ▼
              Order Receipt (/orders/[id])
                      │  itemized breakdown · shipping details · status badge
                      ▼
              Order History (/orders)
                        thumbnail grid (first 3 items + "+X more" indicator)
```

### Key Technical Decisions in the Flow

- **Real-time discount recalculation**: the frontend recalculates discount percentages client-side to ensure accuracy regardless of backend rounding.
- **Flicker-free cart**: per-item `isUpdating` state prevents full-page re-renders during quantity mutations.
- **Cart post-checkout**: since the backend doesn't clear the cart on order creation, the frontend orchestrates a `Promise.all()` batch deletion after a successful order.
- **Order visibility fix**: newly created orders have `PENDING` status, which the backend history query excludes. An admin must confirm the order for it to appear in the user's history — documented behavior.

---

## Admin Panel

Access: `/admin/**` — requires `ROLE_ADMIN` JWT claim.

### Features

**Product Management (`/admin/products`)**
- Responsive table with stock, price, image preview, and touch-scroll for mobile.
- Create form (`/admin/products/create`) — strictly typed against the `CreateProductRequest` backend model, with dynamic numeric field validation.
- Edit form (`/admin/products/[id]/edit`) — pre-populated, same validation rules.
- Delete with native confirmation dialog to prevent accidental data loss.
- All mutations go through `admin-product.service.ts` — zero business logic in components.

**Order Management (`/admin/orders`)**
- Global order listing regardless of user.
- Status transitions: `PENDING → CONFIRMED → SHIPPED → DELIVERED` or `CANCELLED`.
- Confirming an order makes it visible to the customer in their order history.

**Dashboard (`/admin/dashboard`)**
- Metric cards, donut charts, mini bar charts, and stock alert panels built with dedicated admin components.

---

## UX/UI & Responsive Design

### Responsive Strategy
- CSS Grid for multi-column layouts (product catalog, admin tables).
- Relative units exclusively: `rem`, `%`, `vh`, `vw` — no hardcoded pixel breakpoints.
- Mobile-first SCSS — all components degrade gracefully to single-column on small viewports.
- Touch-scroll wrapper on admin product table for seamless mobile navigation.

### Dark Mode
- Implemented system-level dark mode via CSS variables toggled on the root element.
- All SCSS modules reference variable tokens — zero color values are hardcoded.

### Loading & Perceived Performance
- **Skeleton loaders** with CSS shimmer animation replace all spinner placeholders on Checkout, Order Detail, and Order History pages.
- This eliminates Cumulative Layout Shift (CLS) and matches enterprise UX standards.

### Micro-interactions
- Navbar hamburger: custom CSS "Slide & Fade" transition (not a `display` toggle).
- Cart item removal: SVG trash icon with disabled state and hover transition.
- Product card: shadow elevation on hover (`$shadow-md`).
- Form buttons: disabled + loading state during API calls to prevent double submissions.

### Accessibility
- ARIA roles and `aria-label` on guards' loading screens.
- `role="status"` on redirect screens.
- `suppressHydrationWarning` on root layout to prevent hydration mismatches from browser extensions.

---

## Git Workflow

The team used **feature branching** with pull requests into `main`.

### Branch Strategy

| Branch Pattern | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/*` | New functionality |
| `name_development_team/*` | Developer-specific branches |

### Branch History

```
feature/login-registro       Login & register pages
feature/login                Login refinements
feature/registro             Register refinements
feature/mejoras-login-register  Auth UX improvements
core-ui-architecture         Base component library
pagehome                     Home page
navburguer                   Navbar + hamburger menu
feature/detalle-producto     Product detail page
feature/profile-page         User profile
feature/cart                 Shopping cart
feature/orders               Order management
feature/dabner-defensa       Final defense fixes
camilo/servicios-http-core   HTTP service layer
camilo/panel-admin-productos Admin product panel
camilo/Panel-Admin           Full admin panel
camilo/Refactor              Final refactoring
majo-examen / majo_cambios   Exam branch contributions
```

**Total commits:** 157+  
**Total remote branches:** 20

### Commit Convention

Commits follow the `feat(scope): description` pattern:

```
feat(refactor): mejora del navbar e implementacion del modo oscuro
feat(refactor): mejora del cartItem para que se vea mejor
feat(refactor): implementacion de authGuard.module
feat(refactor): mejora de la aparencia visual de dashboard de admin
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the ShopWave Spring Boot API

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Installation & Development

```bash
# Clone the repository
git clone <repository-url>
cd proyecto-final-shop

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server (webpack mode) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Default Credentials (for testing)

| Role | Access |
|---|---|
| `CUSTOMER` | Register via `/register` |
| `ADMIN` | Requires backend seed data or manual role assignment |

---

## Team

| Developer | Contributions |
|---|---|
| **Camilo** | HTTP service layer · Admin panel · JWT interceptor · Refactoring |
| **Dabner Orozco** | Cart module · Checkout wizard · Order management · Role-based UI |
| **Majo** | Auth pages · UI contributions · Exam branch |
| **Nataly** | Core UI architecture · Component library · Refactoring Code · Refactoring Visual · Home Panel · Home Admin |
| **Luis** | Supporting contributions · Interface improvements in the registration and login section|

---

> **Course:** Web Technology II  
> **Project:** ShopWave Fusion — E-commerce Platform  
> **Stack:** Next.js 16 · React 19 · TypeScript · SCSS Modules · Spring Boot (API)