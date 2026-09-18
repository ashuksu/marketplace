# Marketplace

A compact full-stack marketplace built with Next.js, React and TypeScript.

Users can browse products, communicate with sellers, place orders, follow order and stock updates in real time, inspect products in 3D, and use an AI shopping assistant.

The project is designed as a real, runnable product. It also serves as concentrated hands-on practice for two frontend roles focused on React, TypeScript, architecture, realtime communication, state management, performance, testing, Next.js and 3D.

## Product

The marketplace has two main roles:

- **Buyer** - browses products, searches and filters the catalog, views product details, uses the 3D viewer, adds products to the cart, checks out, tracks orders, chats with sellers, uses the AI assistant, and leaves reviews.
- **Seller** - manages products and inventory, views and updates orders, and communicates with buyers.

### Main user flows

**Buying**

```text
Catalog → Product → 3D view → Cart → Checkout → Order → Tracking → Review
```

**Seller**

```text
Seller Dashboard → Products → Inventory → Orders → Customer Chat
```

**Communication**

```text
Buyer ↔ Seller
Buyer ↔ AI Shopping Assistant
```

## Main Pages

```text
/                         Home / featured products
/products                 Product catalog
/products/[id]             Product details, reviews, live stock, 3D viewer
/cart                      Shopping cart
/checkout                 Checkout
/orders                   Customer orders
/orders/[id]              Order details and live status
/messages                 Conversations
/messages/[id]             Chat
/profile                  User profile
/login                    Login
/register                 Registration
/seller                   Seller dashboard
/seller/products          Seller product management
/seller/products/[id]     Create/edit product
```

The AI assistant is also available as a small panel from the main application.

## Core Entities

```text
User
Category
Product
Cart
CartItem
Order
OrderItem
Conversation
Message
Notification
Review
```

The domain stays intentionally small. Business rules are kept simple so the focus remains on frontend architecture and implementation.

## Architecture

The web application uses **Next.js App Router** with a lightweight **Feature-Sliced Design** approach.

Next.js routing has priority over FSD naming where the two would conflict. Route files remain in the normal Next.js `app/` structure.

```text
src/
├── app/          # Next.js routes, layouts and providers
├── widgets/      # Large page sections and UI blocks
├── features/     # User actions and use cases
├── entities/     # Domain models and related logic
└── shared/       # API, realtime, UI, utilities and config
```

Example:

```text
src/app/products/[id]/page.tsx
        ↓
widgets/product-details
        ↓
features/add-to-cart
features/send-message
entities/product
        ↓
shared/ui
shared/api
```

FSD is used to keep responsibilities clear, not to create abstractions for their own sake.

Small pieces stay small. A simple entity or feature can remain a single file.

## Next.js and Rendering

The project uses the App Router and a deliberate Server/Client split.

**Server Components** are used where interactivity is not required, for example product page data, metadata and the application shell.

**Client Components** are used for interactive features such as:

- cart interactions
- forms
- filtering
- chat
- notifications
- 3D viewer
- AI assistant
- seller interactions

The product page is designed so that product content and metadata can benefit from server rendering while interactive parts remain client-side.

## Frontend Technology

### Core

- Next.js
- React
- TypeScript
- pnpm

### UI

- shadcn/ui
- Tailwind CSS
- Lucide icons

The UI intentionally uses shadcn/ui components as the main visual system. We do not build a custom design system for this project.

Tailwind is mainly used for small layout and styling adjustments around the generated shadcn/ui components.

No separate styling systems are added just for the sake of the project.

### State Management

The project deliberately uses several state approaches because they solve different practical problems and are useful for interview preparation.

| Tool              | Main responsibility                                                               |
| ----------------- | --------------------------------------------------------------------------------- |
| **RTK Query**     | Server-owned data such as products, orders, conversations and messages            |
| **Redux Toolkit** | Cross-page application state such as cart, auth state and notifications           |
| **Zustand**       | Small ephemeral UI state such as filters, chat panel state and 3D viewer settings |
| **RxJS**          | Realtime event streams and time-based event processing                            |
| **URL state**     | Shareable catalog filters, sorting and pagination                                 |

These technologies are intentionally not collapsed into one solution. The purpose is to get practical experience with each one and understand where each fits.

## API and Backend

A small Node.js backend provides the application data.

### REST API

REST is used for normal resource operations:

```text
Products
Categories
Users / Auth
Cart
Orders
Conversations
Messages
Notifications
Reviews
Seller Products
Seller Orders
```

Examples:

```text
GET    /products
GET    /products/:id
GET    /categories

POST   /auth/login
POST   /auth/register
GET    /users/me

GET    /cart
POST   /cart/items
DELETE /cart/items/:id

POST   /orders
GET    /orders
GET    /orders/:id

GET    /conversations
GET    /conversations/:id/messages
POST   /conversations/:id/messages
```

The backend can use seeded in-memory data. A real database is not required for this project.

## Realtime Communication

Realtime functionality is a core part of the marketplace.

WebSocket is used for:

- buyer/seller chat
- typing indicators
- online/offline presence
- live order status
- live inventory updates
- notifications

Example events:

```text
MESSAGE_RECEIVED
TYPING_UPDATED
USER_ONLINE
USER_OFFLINE
ORDER_UPDATED
STOCK_UPDATED
NOTIFICATION_RECEIVED
```

### Realtime flow

```text
WebSocket
   ↓
RxJS event stream
   ↓
filter / debounce / throttle where useful
   ↓
RTK Query / Redux Toolkit / Zustand
   ↓
React UI
```

The realtime connection also exposes a visible connection state such as `connecting`, `open`, `reconnecting` and `closed`.

A seeded/demo seller can be used to generate simple realtime activity without requiring two real users for every demonstration.

## Chat

Chat is real marketplace functionality rather than a separate technology demo.

### Buyer ↔ Seller

Users can:

- open a conversation
- send and receive messages
- see typing status
- see online/offline status
- see unread messages
- see connection status

### AI Shopping Assistant

The marketplace also contains an AI shopping assistant.

Example:

```text
"I need headphones under $200 with good noise cancellation."
```

The assistant can search the product data and return matching products.

The first implementation can use a mocked/streamed response. The important part is the frontend integration, streaming UI, product-card results and interaction model rather than a real LLM backend.

## Authentication

The application includes simple authentication for the marketplace roles.

The flow includes:

- login
- registration
- logout
- current user
- protected routes
- buyer/seller access

The implementation is intentionally demo-grade. It exists to provide a realistic frontend authentication flow without spending project time on external identity providers or production security infrastructure.

## Forms

Real forms are part of the product:

- Login / Register
- Seller product create/edit
- Checkout
- Profile
- Product review

The forms use:

- React Hook Form
- Zod

Validation covers realistic cases such as required fields, numeric values, email format, passwords, order data and review constraints.

## Performance

The project includes practical performance cases rather than purely theoretical optimization.

The catalog and message history can contain a significant amount of seeded data so that rendering behaviour is meaningful.

The project demonstrates:

- data normalization
- memoized selectors
- `React.memo`
- `useMemo`
- `useCallback`
- component composition
- efficient list rendering / virtualization
- lazy loading and code splitting where useful

Performance work should be driven by actual rendering behaviour. We do not memoize everything automatically.

### Component composition

The UI is split into focused components rather than large components with unrelated responsibilities.

For example:

```text
ProductDetails
├── ProductGallery
├── ProductInfo
│   ├── ProductPrice
│   ├── StockStatus
│   └── ProductActions
├── ProductViewer3D
└── ProductReviews
```

This gives a practical example of composition, state placement and rendering boundaries.

## 3D Product Viewer

The product page includes an interactive 3D viewer.

The viewer can support:

- rotation
- zoom
- camera controls
- simple product variant changes

The implementation uses **Three.js / React Three Fiber** and WebGL.

The viewer is lazy-loaded so that the 3D code does not unnecessarily affect the initial product page load.

Advanced 3D modelling and WebGPU are outside the scope of the project.

## Legacy React Area

The main application uses modern React function components and hooks.

A small isolated seller area is intentionally implemented with legacy React patterns to practice and understand older React code:

```text
seller/legacy/
├── ProductTable
├── ProductRow
├── StockBadge
├── ProductFilters
└── ErrorBoundary
```

This area can demonstrate:

- Class Components
- `PureComponent`
- lifecycle methods
- local class state
- props and callback communication
- class-based error boundaries

The legacy area is isolated from the modern application architecture.

Legacy test tooling such as Enzyme is not part of the main project setup. The focus here is understanding and working with legacy React code without introducing tooling that would complicate the main Next.js/React setup.

## Testing

Testing is added to the product as real functionality is implemented.

### Unit tests

**Jest** is used for isolated logic such as:

- validation
- utility functions
- selectors
- reducers / slices
- realtime event processing

### Component tests

**React Testing Library** is used for user-facing behaviour such as:

- ProductCard
- ProductList
- LoginForm
- CheckoutForm
- Cart
- ChatInput
- notifications

### API mocking

**MSW** is used where API mocking makes component and integration tests simpler.

### End-to-end tests

**Playwright** covers important user flows, for example:

```text
Login
→ Browse products
→ Open product
→ Add to cart
→ Checkout
```

A realtime scenario can use two browser contexts:

```text
Seller updates order
        ↓
WebSocket
        ↓
Buyer sees the new status without refresh
```

The goal is representative coverage of important behaviour, not a large test count.

## React Native Mini-Client

A small React Native / Expo client can be added after the web application is functional.

The client uses the same backend and initially focuses on:

```text
Products
→ Product Details
→ Cart
```

The purpose is to get practical experience with a mobile React client consuming the same API and domain model rather than building a second full application.

## Repository Structure

The project starts as a single repository so that the main implementation stays simple.

```text
Marketplace/
├── src/                 Next.js frontend
│   ├── app/             Next.js routes and layouts
│   ├── widgets/
│   ├── features/
│   ├── entities/
│   └── shared/
├── server/              Node.js REST + WebSocket backend
├── public/               Static assets
├── tests/                Shared or integration test setup where needed
└── package.json
```

If the React Native client is added, it can live alongside the web application without changing the main frontend architecture.

## Development Workflow

The project uses a simple two-branch workflow:

```text
master   → stable / protected branch
   ↑
  PR
   ↑
dev      → main development branch
```

Development happens on `dev`. Changes are merged to `master` through pull requests.

CI, Husky, deployment and other repository automation are intentionally kept outside the initial project setup and can be added later without affecting the application architecture.

## Design Approach

The visual design is intentionally simple.

The project uses shadcn/ui components and their default styling rather than spending development time on custom visual design.

The priority is:

```text
Working product
    ↓
Clear architecture
    ↓
Real data flow
    ↓
Realtime behaviour
    ↓
Performance
    ↓
Testing
    ↓
3D / AI / Mobile
```

The final result should be a small but complete marketplace that is easy to run, easy to demonstrate, and easy to explain from an engineering perspective.
