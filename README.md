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



---

# Authentication, Session Management and Profile Page

The application includes a complete authentication flow based on JWT, protected frontend routes, session persistence with local storage and a user profile page.

This implementation allows users to register, log in, access private pages, keep their session active after refreshing the browser and log out safely.

---

## Authentication Flow

The authentication process is integrated with the backend API.

The login request is sent to:

```ts
GET /auth/signin
```

The frontend sends the user credentials using Basic Authentication.

If the credentials are valid, the backend returns:

```txt
A JWT token in the Authorization response header
The authenticated user information in the response body
```

The JWT token is then used to authenticate protected API requests.

---

## Login Behavior

After a successful login, the frontend performs the following actions:

```txt
1. Receives the JWT token from the backend.
2. Receives the authenticated user data.
3. Stores the JWT token in local storage.
4. Stores the user data in local storage.
5. Updates the global authentication state.
6. Redirects the user to the home page.
```

The login redirection is handled with:

```ts
router.push("/")
```

This means that after logging in, the user returns to the main home page instead of going directly to the products page.

---

## Register Flow

The register page allows new users to create an account.

File:

```txt
src/app/register/page.tsx
```

The registration request is sent to:

```ts
POST /auth/signup
```

### Register Form Fields

```txt
Nombre
Apellido
Correo electrónico
Contraseña
Celular
```

After a successful registration, the user is redirected to the login page:

```ts
router.push("/login")
```

This allows the user to log in with the newly created account.

---

# Token Management

The JWT token is stored in local storage using the following key:

```txt
shopwave_token
```

Token management is centralized in:

```txt
src/utils/token.util.ts
```

This utility is responsible for handling all token-related operations.

---

## Token Utility Responsibilities

```txt
Save the JWT token after login.
Retrieve the current token when making protected API requests.
Remove the token during logout.
Remove the token when the backend reports an invalid or expired session.
Check whether a token exists.
```

---

## Main Token Functions

```ts
setToken(token)
getToken()
removeToken()
hasToken()
```

Centralizing this logic avoids repeating `localStorage` operations throughout the project and keeps the authentication flow cleaner.

---

# User Session Management

In addition to the token, the authenticated user information is also stored locally.

The user is stored using the key:

```txt
shopwave_user
```

User persistence is handled in:

```txt
src/utils/user.util.ts
```

---

## User Utility Responsibilities

```txt
Save the authenticated user after login.
Retrieve the user after page reloads.
Remove the user during logout.
Remove the user when the session becomes invalid.
```

---

## Main User Functions

```ts
setUser(user)
getUser()
removeUser()
```

This is important because the profile page depends on the authenticated user's data.

By storing the user locally, the profile information can still be displayed after refreshing the browser.

---

# Auth Context

The authentication state is managed globally using a React Context.

File:

```txt
src/context/AuthContext.tsx
```

The `AuthContext` is responsible for making authentication data and actions available across the application.

---

## AuthContext Responsibilities

```txt
Store the current JWT token.
Store the authenticated user.
Restore the token and user from local storage when the app loads.
Provide the login function.
Provide the logout function.
Expose whether the user is authenticated.
Expose whether the authentication state is still loading.
Handle global authentication errors.
Redirect users after login or logout.
```

---

## Values Exposed by AuthContext

```ts
isAuthenticated
isLoading
token
user
login()
logout()
```

The `isLoading` value is important because the app needs to wait until the session is restored from local storage before deciding whether the user is authenticated or not.

Without this loading state, private pages could redirect the user to `/login` before the app finishes checking if a valid token already exists.

---

# Logout Flow

The logout process is handled globally by the `logout()` function from `AuthContext`.

When the user logs out, the application performs the following steps:

```txt
1. Removes shopwave_token from local storage.
2. Removes shopwave_user from local storage.
3. Clears the token from the authentication state.
4. Clears the user from the authentication state.
5. Redirects the user to /login.
```

The logout behavior ensures that private data is no longer available after the session is closed.

---

# API Authorization

Protected backend requests are handled through a reusable API service.

File:

```txt
src/services/api.service.ts
```

This service automatically attaches the JWT token to protected requests.

The token is sent using the `Authorization` header:

```txt
Authorization: Bearer <token>
```

This format is required by the backend JWT validation filter.

---

## API Service Responsibilities

```txt
Read the current JWT token from local storage.
Add the token to the Authorization header.
Send requests to the backend API.
Detect unauthorized responses.
Detect forbidden responses.
Trigger a global auth-error event when the token is invalid or expired.
```

---

## Authentication Error Handling

If the backend responds with:

```txt
401 Unauthorized
```

the frontend treats the session as invalid or expired.

The flow is:

```txt
Backend returns 401
→ API service detects the error
→ token is removed
→ user data is removed
→ auth-error event is dispatched
→ AuthContext redirects the user to /login
```

If the backend responds with:

```txt
403 Forbidden
```

it means the token is valid, but the user does not have enough permissions to access the resource.

---

# Protected Routes

Private frontend routes are protected using an authentication guard.

File:

```txt
src/guards/AuthGuard.tsx
```

The guard prevents unauthenticated users from accessing private pages manually through the browser URL.

---

## AuthGuard Responsibilities

```txt
Check if the user is authenticated.
Wait until the authentication state finishes loading.
Render the private content only when the user is authenticated.
Redirect unauthenticated users to /login.
```
---

## HTTP Services Layer, Models, and Testing
**Date:** 22/05/2026
**Responsible Developer:** Camilo

The backend connection module acts as the main bridge between the Next.js interface and the Spring Boot REST API. A highly decoupled service architecture has been implemented using the native Fetch API, ensuring security, strict typing, and global exception handling.

### 1. Core Architecture: Global Interceptor (`api.service.ts`)
Every HTTP request to the server passes through a centralized wrapper (`fetchApi`). This pattern ensures compliance with the following business rules:
* **Automatic JWT Injection:** The service extracts the token from local storage and silently attaches it to the `Authorization` header for protected routes.
* **Dynamic Error Handling:** Generic error responses are prohibited. The interceptor catches `4xx` and `5xx` codes, extracting the exact message emitted by the backend's `ErrorDetails` to provide precise feedback to the UI.
* **Session Management:** Upon receiving `401 Unauthorized` or `403 Forbidden` responses, the service destroys the expired token and emits a global event (`auth-error`) to force a redirection to the login page.

### 2. Decoupled Domain Services
Network logic is strictly separated from React components. The following services have been modularized:
* `auth.service.ts`: Handles the registration flow and login via *Basic Auth*, returning both the JWT and the user profile to synchronize the global state.
* `product.service.ts`: Exposes the catalog, integrating dynamic search parameters (`URLSearchParams`) for complex filtering and pagination.
* `cart.service.ts`: Manages the remote state of the shopping cart, adapting to specific backend HTTP verbs (`PUT` for addition/update, `DELETE` for removal).
* `order.service.ts`: Processes checkout and retrieves the authenticated user's purchase history.
* `user.service.ts`: Retrieves persistent user profile information.

### 3. Strict Typing (Models and Interfaces)
To ensure data integrity between Java and TypeScript, interfaces were defined to act as exact mirrors of the Spring Boot entities.
* **Generic Types:** Use of `ApiResponse<T>` and `PaginatedResponse<T>` to safely handle data collections and operation confirmations.
* **Business Models:** Robust structuring of `Product`, `User`, `Cart`, `CartItem`, `Order`, and `OrderItem` in the `src/models/` directory.

### 4. Automated Testing (Postman)
An exhaustive Postman collection has been configured to validate API resilience prior to UI consumption.
* **Dynamic JWT Capture:** The collection includes JavaScript *Test Scripts* that intercept the token after a successful login and automatically inject it into environment variables for subsequent requests.
* **Assertions (Tests):** Automated validation of HTTP status codes (200, 202, 400) and the structures of JSON objects returned by the server.

---

## Supervisor Module (Administration Panel)
**Date:** 27/05/2026
**Responsible Developer:** Camilo

This module centralizes the store's inventory management (ShopWave Fusion) through an exclusive control panel for users with high privileges. A complete and secure CRUD (Create, Read, Update, Delete) has been implemented, strictly respecting the separation of concerns and the HTTP service-based architecture.

### Implemented Routes
* `app/admin/products/page.tsx`: Inventory management table and general listing.
* `app/admin/products/create/page.tsx`: Registration form for new products.
* `app/admin/products/[id]/edit/page.tsx`: Dynamic form for updating existing products.
* `app/admin/cart/page.tsx`: Dynamic form for check products that have been added on the cart.

### Key Features
1. **Complete Product Management (CRUD):**
   * **List:** Responsive table that consumes the general catalog, displaying vital information such as stock, price, and images. Includes a custom touch-scroll wrapper for seamless mobile device navigation.
   * **Create & Edit:** Robust forms strictly mapped to the `CreateProductRequest` model expected by Spring Boot. They include dynamic type validation (preventing string submissions in numeric fields) and loading state control (`loading`, `fetching`) to prevent accidental multiple submissions.
   * **Delete:** Deletion button with native confirmation interceptor to prevent data loss from accidental clicks.

2. **Security and Route Protection (`AdminGuard`):**
   * Developed a wrapper component (Guard) that not only validates the existence of a valid JWT but also intercepts the session to verify the user's role (`ADMIN` or `ROLE_ADMIN`).
   * Implemented a Zero-State architecture to completely eliminate infinite rendering loops caused by Context API re-renders.
   * If an unauthenticated user or one with a `CUSTOMER` role attempts to access any `/admin/...` route, they are blocked from rendering and immediately expelled to the home or login page silently.

3. **Architecture and Clean Code:**
   * **Decoupled Service:** All data mutation logic is isolated in `src/services/admin-product.service.ts`, keeping React components clean and focused solely on the UI.
   * **Modular Styles:** Total elimination of inline styles. The panel uses 100% SCSS Modules (`admin.module.scss`) mapped to the global design system (variables, borders, shadows), ensuring a premium, responsive layout that matches the rest of the application without style collisions.
   * **Global Error Handling:** Requests catch errors generated by the backend and display dynamic UI notifications, complying with the strict rule of not hiding failures in the console.

### Future Scalability
The architecture of this administrative section has been designed to scale seamlessly. In the future (for post-MVP versions), this panel will serve as the foundation for the integration of **interactive dashboards**, performance charts, and **sales KPI** calculators (e.g., top-selling products, low stock alerts, ROI), elevating the platform's managerial and professional level.

---

## Shopping Cart Module & Product Integration
**Date:** 28/05/2026
**Responsible Developer:** Dabner Orozco

This module handles the complete shopping cart lifecycle, bridging the gap between the product catalog and the checkout process. The implementation involved building a global state, modernizing the user interface, and solving complex synchronization and caching issues between the Next.js frontend and the Spring Boot backend.

### 1. Global Cart State Management (`CartContext.tsx`)
A React Context was implemented to manage cart operations globally across the application without prop-drilling.
* **Dynamic Operations:** Handled adding new products, updating quantities (increment/decrement), and removing items through decoupled services.
* **Real-time Math Calculation:** To ensure data accuracy regardless of backend input errors, the frontend dynamically recalculates real discount percentages (e.g., displaying exactly 30% instead of 27%) and automatically updates totals and subtotals.
* **Flicker-Free UI:** Implemented local state loaders (`isUpdating`) within individual cart items to prevent the entire page from re-rendering and flickering during API calls.

### 2. Product Details & Admin Integration
* **Product Page Refactoring (`products/[id]/page.tsx`):** Completely redesigned the product details view to be fully responsive. Added dynamic size selection, quantity controls, and strict stock validation before allowing a user to add an item to the cart.
* **Admin Panel Request Corrections:** Fixed severe parameter mismatches in the `CreateProductRequest` model. Corrected the nested category hierarchy (`topLevelCategory`, `secondLevelCategory`, `thirdLevelCategory`) and size arrays, enabling the admin panel to successfully persist new products in the database.

### 3. Advanced API Synchronization & Bug Fixes
* **JWT Token Sanitization:** Discovered and fixed a critical backend crash (`Illegal base64url character`) caused by Spring Boot's inability to parse the space in the "Bearer " header. The frontend interceptor was modified to sanitize and send a raw token format, preventing 202 false-positive errors.
* **Next.js Cache Invalidation:** Resolved the "Phantom Cart" issue where Next.js aggressively cached empty cart `GET` responses. Applied `cache: 'no-store'` to the Fetch API options, forcing the browser to retrieve fresh data after every mutation.
* **Hydration Mismatch Fix:** Eliminated Next.js hydration errors caused by third-party browser extensions by applying `suppressHydrationWarning` to the application's root layout.

### 4. UX/UI and Styling Improvements
* **Modern SCSS Modules:** Complete UI overhaul of `ProductCard`, `CartItem`, and the Cart Page using strictly SCSS modules to match the overarching design system.
* **Micro-interactions:** Replaced generic text buttons with optimized SVG icons (e.g., a dynamic trash can for item removal). Implemented disabled states, smooth hover transitions, and elegant box shadows (`variables.$shadow-md`) to enhance the premium feel of the e-commerce platform.
