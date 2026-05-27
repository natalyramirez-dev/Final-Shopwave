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

