# Marketplace project audit

This audit describes the repository as it exists now. Statements about future scope are explicitly marked as **planned/inferred** and are not treated as implemented functionality.

## 1. Project purpose

The repository is currently a small full-stack marketplace learning project. It demonstrates a Next.js App Router frontend, a separate Express API, Feature-Sliced-style folders, server-rendered product pages, RTK Query integration, and an in-memory cart.

The stated target is a substantially larger marketplace for buyers and sellers: catalog search/filtering, checkout and orders, authentication, seller tooling, chat, realtime events, reviews, 3D product viewing, an AI assistant, testing, performance work, and possibly a React Native client. Those capabilities are described in `README.md`, but almost none are present in the current code. The implemented scope is currently products plus cart operations.

## 2. Current stack

### Frontend

- Next.js `16.3.4` with App Router.
- React `19.2.8` and React DOM `19.2.8`.
- TypeScript `5.x`, strict mode, JSX transform, path alias `@/* -> src/*`.
- Server Components are the default; selected interactive components use `'use client'`.

### Backend

- Express `5.2.1`, run from `apps/api/src`.
- `cors` and `express.json()` middleware.
- Seeded in-memory product and cart data; no database, authentication, WebSocket server, or separate service layer.

### State/data fetching

- Redux Toolkit `2.12.0`, React Redux `9.3.0`.
- RTK Query APIs for products and cart.
- Direct server-side `fetch` helpers for product list/detail pages.
- No Zustand, RxJS, React Hook Form, Zod, Axios, WebSocket library, or other state/data libraries are configured in `package.json` or used by source code.

### UI

- Tailwind CSS `4.x` through `@tailwindcss/postcss`.
- shadcn configuration in `apps/web/components.json`, using the `base-nova` style, neutral base color, CSS variables, RSC mode, and `apps/web/src`.
- Base UI React primitives (`@base-ui/react`) for Button and Badge implementation.
- `class-variance-authority`, `cn`, `tailwind-variants` (configured dependency but no source usage found), `tw-animate-css`, Lucide React, and Embla Carousel.
- Local shared UI components: `button`, `badge`, `card`, and `carousel`.

### Tooling

- pnpm `12.3.4`.
- ESLint 9 with Next core-web-vitals, Next TypeScript, and Prettier compatibility config.
- Prettier with Tailwind plugin.
- `tsx` for the Express server and `concurrently` for the combined development command.
- Next React Compiler enabled in `apps/web/next.config.ts`.

### Testing

- No test files, test runner script, or testing dependencies are present in the project manifest. Testing technologies mentioned in `README.md` are future intent only.

### Deployment/CI

- No CI workflow, deployment configuration, Dockerfile, database configuration, or hosting configuration is present.
- `README.md` describes a possible two-branch workflow (`dev` to `master`), but branch protection/automation is not stored in the repository.

## 3. Current architecture

The repository is a single package with two runtime entry points:

```text
src/
  app/       Next routes, root layout, providers, Redux store
  widgets/   page-sized sections and composite UI
  features/  user actions (`add-to-cart`)
  entities/  product/cart APIs, product model, product card
  shared/    UI primitives and utility
server/
  data/      in-memory products and cart
  index.ts   Express app and all route handlers
```

Next.js route files are in `apps/web/src`: `/`, `/products`, and `/products/[id]`. `apps/web/src` owns the application shell and includes `SiteHeader`, `SiteFooter`, and the Redux `Providers` wrapper. `widgets` compose pages, `features` contain an action-oriented component, `entities` contain domain-facing APIs/types/UI, and `shared` contains reusable UI. This is a lightweight FSD naming convention, not a complete layered implementation.

The backend is intentionally flat: route definitions, response mapping, validation-by-omission, and mutation logic all live in `apps/api/src`. Data is process-local arrays in `apps/api/src` and `apps/api/src`.

## 4. Current implemented functionality

- Homepage (`apps/web/src`) with a hero section and featured-product carousel.
- Product catalog at `/products`, loaded from the Express API and rendered as a responsive grid.
- Product detail at `/products/[id]`, loaded from the API on the server.
- Missing product IDs call `notFound()` and render the custom 404 page.
- Product cards link to product detail pages and display title, category, rating, description, and price.
- Add-to-cart from the product detail widget, using a client-side RTK Query mutation.
- Cart display embedded below product details, using `CartSummary`.
- Cart loading, empty/error states, line item display, line totals, and overall total.
- Increase quantity, decrease quantity, remove item, and implicit removal when decreasing quantity one to zero.
- Express health endpoint, product list/detail endpoints, and cart read/create/update/delete endpoints.
- Shared dark theme class, fonts, Tailwind styling, shadcn/Base UI-inspired components, and Embla carousel controls.

There is no standalone `/cart` route, checkout, order flow, authentication, user/seller flow, product image rendering, search/filter/sort UI, pagination, reviews, or stock enforcement in the current implementation.

## 5. Data flow

### Loading products

`apps/web/src` is an async Server Component and calls `entities/product/api/get-products.ts`. That helper fetches `${process.env.API_URL ?? 'http://localhost:3001'}/products` with `cache: 'no-store'`, checks `response.ok`, and returns `Product[]`. The page passes the result through the server-rendered `ProductList` to `ProductCard`.

The homepage's `FeaturedProducts` widget independently performs the same server-side fetch and renders all returned products through the client `Carousel` boundary. There is no server-side pagination or filtering.

### Opening a product page

`apps/web/src` awaits the Next 16-style `params` promise, calls `getProduct(id)`, and maps a 404 response to `notFound()`. Other non-OK responses throw. The returned product is passed into `ProductDetails`, which is server-compatible but contains client children for cart interaction and cart display.

### Loading the cart

`CartSummary` is a Client Component and calls `useGetCartQuery()`. RTK Query performs `GET http://localhost:3001/cart`; the Express server joins each `ServerCartItem` to the product array and returns enriched cart items containing `productId`, `title`, `price`, and `quantity`.

### Adding an item

`AddToCartButton` calls `useAddToCartMutation()` with `{ productId, quantity: 1 }`. The client sends `POST /cart`. The server increments an existing in-memory item or appends a new one, then returns the complete enriched cart. After fulfillment, `cartApi.onQueryStarted` replaces the cached `getCart` result with that response.

### Changing quantity

`CartSummary` sends `PATCH /cart/:id` with `{ quantity }`. The server updates the matching item, or removes it when quantity is less than or equal to zero, and returns the complete enriched cart. The mutation fulfillment handler replaces the cached `getCart` data.

### Removing an item

`CartSummary` sends `DELETE /cart/:id`. The server removes the matching array element and returns the complete enriched cart. The RTK Query fulfillment handler again replaces the cached `getCart` data.

The cart is held in the Express process, not in browser storage or a user session. It is shared by all clients of that server process and resets on restart. Product page reads use direct server fetches; the product RTK Query cache is configured but is not used by the current route components.

## 6. Redux / RTK Query

`apps/web/src` creates one Redux store with only two reducers:

- `productApi.reducer` at `productApi`.
- `cartApi.reducer` at `cartApi`.

The store middleware adds both RTK Query middlewares. `Providers` creates the React Redux context around the entire application from the client component `apps/web/src`.

`productApi` (`apps/web/src`) exposes:

- `getProducts` query, `GET /products`.
- Generated hook: `useGetProductsQuery`.

The hook is exported but no current component consumes it. Current catalog/featured/product-detail reads use direct server helpers instead.

`cartApi` (`apps/web/src`) exposes:

- `getCart` query, `GET /cart`; generated `useGetCartQuery`.
- `addToCart` mutation, `POST /cart`; generated `useAddToCartMutation`.
- `updateCartItem` mutation, `PATCH /cart/:productId`; generated `useUpdateCartItemMutation`.
- `removeFromCart` mutation, `DELETE /cart/:productId`; generated `useRemoveFromCartMutation`.

All cart mutations wait for `queryFulfilled` and then call `cartApi.util.updateQueryData('getCart', undefined, () => data)`, replacing the cached query result with the server response. No optimistic update, invalidation tags, polling, persistence, normalized entity cache, or error notification is implemented.

An earlier Redux/cart-slice architecture remains only in git history: commit history shows a cart slice was added and later removed during the RTK Query refactor. No ordinary application slice, auth state, notification state, or legacy cart reducer exists in the current tree.

## 7. Server/API

All routes are defined in `apps/api/src`; the server listens on port `3001` and allows CORS from `http://localhost:3000`.

| Method | Path            | Purpose                         | Request body                                                       | Response                                                                           |
| ------ | --------------- | ------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| GET    | `/health`       | Health check                    | None                                                               | `{ "status": "ok" }`                                                               |
| GET    | `/products`     | List all seeded products        | None                                                               | `Product[]`                                                                        |
| GET    | `/products/:id` | Get one product                 | None                                                               | `Product`; `404 { message: "Product not found" }` if absent                        |
| GET    | `/cart`         | Read current process-wide cart  | None                                                               | Enriched `CartItem[]`                                                              |
| POST   | `/cart`         | Add quantity for a product      | `{ productId: string, quantity: number }` (not formally validated) | `201` and complete enriched `CartItem[]`                                           |
| PATCH  | `/cart/:id`     | Set quantity for a cart product | `{ quantity: number }` (not formally validated)                    | Complete enriched `CartItem[]`; `404 { message: "Cart item not found" }` if absent |
| DELETE | `/cart/:id`     | Remove a cart product           | None                                                               | Complete enriched `CartItem[]`; `404 { message: "Cart item not found" }` if absent |

The server does not expose the README's planned auth, users, categories, orders, conversations, messages, notifications, reviews, seller, checkout, or realtime endpoints.

## 8. Current types/models

- `apps/web/src`: frontend `Product` with `id`, `title`, `description`, `price`, `image`, `category`, `rating`, and `stock`.
- `apps/api/src`: backend `ServerProduct` with the same fields and seeded ten products.
- `apps/api/src`: backend `ServerCartItem` containing only `productId` and `quantity`.
- `apps/web/src`: local client `CartItem` containing `productId`, `title`, `price`, and `quantity`; also defines request types for add/update mutations.
- `apps/web/src`: inferred `RootState` and `AppDispatch`.
- Widget/feature props are local structural types, for example `ProductListProps`, `ProductDetailsProps`, and `AddToCartButtonProps`.

`Product` and `ServerProduct` are duplicated but intentionally separate by location/boundary rather than imported across frontend and server. The cart's server storage type and API response/client type are also separate because the server enriches stored IDs/quantities with product title and price. There is no shared domain package or runtime schema validation.

## 9. What was originally planned

The following is inferred from `README.md`, package/config choices, directory names, and git history; it is not current functionality:

- A complete buyer/seller marketplace with catalog, checkout, orders, tracking, reviews, seller dashboard, and protected role-based routes.
- REST resources for users/auth, categories, cart, orders, conversations, messages, notifications, reviews, and seller operations.
- WebSocket events processed through RxJS and distributed into RTK Query, Redux Toolkit, and Zustand.
- React Hook Form/Zod forms, Jest/RTL/MSW/Playwright testing, performance work, 3D via Three.js/React Three Fiber, an AI shopping assistant, and a React Native/Expo client.
- A lightweight FSD architecture under `src`, with `shared/api`, realtime utilities, and additional features/entities.
- A simple seeded backend without a required real database.

Git history shows the actual implemented progression: shadcn/UI setup, product/card/pages, Express product API, product server fetch helpers, RTK Query setup, then cart RTK Query mutations and quantity/removal operations. The history supports the conclusion that the current code is an early incremental slice rather than a partial implementation of every README feature.

## 10. Unfinished / partially implemented areas

- `ProductDetails` and `ProductCard` show a text placeholder (`Product image`) instead of using the product `image` field; no `public/products` assets are present.
- A cart widget exists, but there is no `/cart` route; it is currently embedded in the product detail page.
- `productApi` and its generated hook are configured but unused by the visible product pages, which use direct server fetch helpers instead.
- Product `stock` and `rating` are displayed, but stock is not checked or decremented by cart operations.
- Cart POST/PATCH input is not validated for missing products, invalid quantities, numeric types, or stock limits.
- There are no loading/error boundaries for the server-rendered product list/detail fetches beyond thrown errors and the product 404 path.
- The README-described buyer/seller, auth, checkout, orders, messaging, realtime, reviews, AI, 3D, mobile, and legacy seller areas have no corresponding current source directories/routes.
- Product catalog UI has no filters, search, sorting, or pagination despite those being in the stated product direction.

## 11. Technical debt / cleanup

- Cart response mapping is duplicated in four Express handlers rather than shared.
- API base URLs are inconsistent: direct server fetch helpers honor `API_URL`, while both RTK Query APIs hardcode `http://localhost:3001`.
- The process-wide cart has no user/session identity and is not durable; concurrent users would share state.
- The backend has no request validation, typed request/response boundary, centralized error handling, or 404 middleware.
- The frontend has no API error surface for add/update/remove failures; mutation promises are awaited without user-facing error handling.
- `CartSummary` is rendered on every product detail page and is the only cart surface.
- `getProducts` is called separately for homepage featured products and the catalog; no shared server cache is used because both helpers request `no-store`.
- `tailwind-variants` appears configured as a dependency but is not imported by source. `cn` is used directly even though the project also has a shared `apps/web/src` re-export.
- `apps/web/next.config.ts` still contains the starter `/* config options here */` comment.
- Source logging is limited to the server startup message; there is no structured logging or observability.
- `README.md` substantially overstates the current implementation because it documents the intended destination rather than the checked-in feature set.
- The repository has no tests, CI, or deployment automation, despite README sections describing those future practices.

## 12. Current project maturity

The project is an early but runnable vertical slice. It demonstrates a working Next.js/React/TypeScript frontend, a separate Express API, server-side product loading, a client-side RTK Query cart, basic cache synchronization after mutations, reusable UI primitives, and a lightweight FSD-inspired organization.

It is not yet a complete marketplace application or production backend. Persistence, identity, validation, checkout/order behavior, robust error handling, tests, automation, and the broader domain model remain absent. Technically, it currently demonstrates foundational full-stack wiring and incremental state-management practice more than a mature marketplace architecture.

## 13. Possible next directions

Based only on the current repository and its stated architecture, logical directions include:

- Consolidate API base URL configuration and decide whether product reads should stay Server Component fetches or move to RTK Query.
- Extract shared backend cart response/validation logic and introduce user/session-scoped persistence.
- Add a first-class cart route and continue the purchase flow toward checkout and orders.
- Improve the catalog/product presentation with real image assets, filtering/search/sorting, stock rules, and product error/loading states.
- Add shared domain/API types or runtime validation at the Express boundary.
- Add focused unit/component/end-to-end tests and CI once behavior expands.
- Implement the documented marketplace domains incrementally: auth, users, seller tools, orders, reviews, conversations, notifications, and realtime events.
- Add the optional README directions only when their supporting backend and UI flows exist: 3D viewer, AI assistant, performance work, or React Native client.
