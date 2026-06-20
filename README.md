# Marketplace

A compact full-stack marketplace built with Next.js, React and TypeScript. Buyers and sellers trade products, chat in realtime, follow orders live, inspect products in 3D and ask an AI shopping assistant for help.

> 🚧 **Status:** initial setup (Next.js starter is being rebuilt). Target: a complete, runnable product in ~2 days, delivered in small vertical stages.

---

## Why this project exists

Two goals:

1. A coherent, portfolio-quality product that runs locally and demos well in a browser.
2. Concentrated hands-on practice with the stack that modern senior frontend roles ask for.

**Technologies overlap on purpose:** Redux Toolkit + RTK Query + Zustand + RxJS, Tailwind + SASS + Styled Components, Jest + RTL + Enzyme, modern React + a small legacy Class Component area, WebSocket + RxJS, web + a tiny React Native client. Each one is used in a small, isolated place where it genuinely fits, so every choice can be explained by pointing at real code. This is not a claim that a production app needs all of them at once.

**Guiding rules**

- One product, not a collection of demo pages.
- Small files, no speculative abstractions. FSD is a guideline: an entity that fits in one file stays one file.
- Every stage leaves the app runnable and with at least one test.
- Performance work is measured (Profiler before/after), not assumed.

---

## Product

### Roles

- **Buyer** browses, buys, tracks orders, chats with sellers and the AI assistant, leaves reviews.
- **Seller** manages products and inventory, processes orders, answers buyers.

### Journeys

**Buyer:** browse → search/filter → open product → gallery / 3D view → add to cart → checkout → order tracking (live status) → chat with seller or assistant → review.

**Seller:** dashboard → create/edit products → manage stock → view orders → update order status → reply to buyers.

### 2-minute demo scenario

1. Log in as buyer in one window and as seller in another (one-click demo accounts).
2. Seller changes stock → the buyer's stock badge updates without refresh.
3. Buyer writes a message → seller sees typing indicator and unread count, replies.
4. Buyer checks out → seller moves the order to *Shipped* → buyer gets a toast and a live status change.
5. Buyer asks the assistant: *"Headphones under $200 with good noise cancellation"* → streamed answer with product cards.
6. Buyer rotates and zooms the product in 3D.

The server includes a **seller bot** (auto-replies, occasional stock changes) so realtime features can be demoed with a single browser window.

### Pages

| Route | Role | Notes |
|---|---|---|
| `/` | all | Home, featured products |
| `/products` | all | Catalog: search, filters, sort, server pagination, virtualized list |
| `/products/[id]` | all | Server-rendered shell (metadata/SEO) + client islands: gallery, 3D viewer, live stock, reviews, "message seller" |
| `/cart`, `/checkout` | buyer | Cart summary, checkout form |
| `/orders`, `/orders/[id]` | buyer | Order list and live status timeline |
| `/messages`, `/messages/[id]` | buyer, seller | Conversations (seller + AI assistant), chat |
| `/profile` | auth | Profile form |
| `/login`, `/register` | guest | Auth forms |
| `/seller` | seller | Dashboard: orders, low stock |
| `/seller/products`, `/seller/products/[id]` | seller | Product management and create/edit form |
| `/seller/legacy` | seller | Legacy class-based inventory table (see [Legacy React](#legacy-react-area)) |

The AI assistant is also reachable as a floating panel from any page.

### Core entities

| Entity | Key fields |
|---|---|
| User | id, name, email, role (`buyer` \| `seller`) |
| Category | id, name |
| Product | id, sellerId, categoryId, title, description, price, stock, images, rating, `model3d?`, tags |
| CartItem | productId, quantity |
| Order | id, buyerId, sellerId, items, total, status: `pending → confirmed → shipped → delivered` (+ `cancelled`); checkout creates one order per seller |
| Conversation | id, participants, type (`seller` \| `assistant`), lastMessage, unreadCount |
| Message | id, conversationId, senderId / role, text, parts (text, product cards), status, createdAt |
| Notification | id, type, text, read, createdAt |
| Review | id, productId, userId, rating (1–5), text |

---

## Architecture

```text
   Web (Next.js)      ── REST (JSON) ──▶   Node API + WebSocket server
   Mobile (Expo/RN)   ◀─ WebSocket ───▶    in-memory store (seeded JSON, no DB)
          │                                seller bot, stock simulator
          └── shared contracts: packages/shared (types, Zod schemas, WS events)
```

### Monorepo (pnpm workspaces)

```text
apps/
├── web/            Next.js App Router, lightweight FSD
├── server/         Node REST API + WebSocket server + seed data
└── mobile/         Expo React Native mini-client
packages/
└── shared/         Domain types, Zod schemas, WebSocket event contracts
docs/               architecture.md, performance.md, adr/
```

`packages/shared` is the single contract between web, server and mobile: request/response schemas and a typed union of WebSocket events, validated with Zod on the server and reused on clients.

### Rendering model (Next.js)

- **Server Components:** app shell, product page content, metadata.
- **Client Components:** everything interactive: catalog list, cart, checkout, chat, seller area, 3D, assistant.
- **Route Handler** `/api/assistant`: streams the (mocked) assistant response.
- **Trade-off (documented in an ADR):** the catalog is client-driven (filtering, virtualization); the product page is server-rendered for SEO.
- Redux store is created per request inside a client provider.

### Lightweight FSD (`apps/web`)

```text
apps/web/
├── app/                 Next.js routing only: thin files re-exporting from src/pages
├── pages/               empty placeholder so Next ignores src/pages
└── src/
    ├── app/             providers (Redux, realtime), store setup, global styles
    ├── pages/           page compositions
    ├── widgets/         header, product-list, product-viewer, cart-summary, chat, notifications, assistant
    ├── features/        auth, add-to-cart, checkout, product-filter, send-message, write-review, seller-products, seller-legacy
    ├── entities/        product, user, order, cart, conversation, message, notification (+ RTK Query endpoints)
    └── shared/          api (base client), realtime (socket + RxJS), ui (Radix wrappers), lib, config
```

Rules:

- Imports go downward only (`pages → widgets → features → entities → shared`); slices expose a public `index.ts`.
- Realtime **transport** lives in `shared/realtime`; **event wiring** lives in `app/` (it needs to touch several entities, which slices of the same layer must not do).
- Small entities stay flat (one file if one file is enough). No layer gets created "just in case".

---

## Technology map

| Technology | Where it is used | Talking point | Role* |
|---|---|---|---|
| Next.js (App Router) | Routing, product page SSR, metadata, Route Handler for the assistant | Server vs client boundary, what is deliberately client-side | B |
| React 19, function components | Whole app | Hooks, composition, `useTransition`/`useDeferredValue` for search | A, B |
| TypeScript (strict) | Everywhere, shared contracts, discriminated union for WS events | Types as the FE↔BE contract | A, B |
| Redux Toolkit | Auth session, cart, notifications | Cross-cutting client state, `createEntityAdapter`, listener middleware | A |
| RTK Query | Products, orders, users, conversations, messages, reviews, seller resources | Server-state cache, optimistic updates, cache patched by realtime events | A |
| Zustand | Filter drafts, mobile menu, chat panel, presence/typing, 3D viewer settings | Ephemeral UI state, selective subscriptions | A, B |
| RxJS | Socket lifecycle, event stream, debounce/throttle/batching | Streams for time-based logic | A |
| WebSocket (`ws`) | Chat, presence, order status, stock, notifications | Reconnect, heartbeat, connection status | A, B |
| REST (Node) | Products, categories, users, cart, orders, conversations, messages, notifications, reviews, seller routes | Resource design, pagination, error contract | A |
| React Hook Form + Zod | Login, register, product, checkout, profile, review forms | Shared schemas client/server | A, B |
| Tailwind CSS | Main application UI | Design tokens, responsive layout | B |
| Radix UI | Dialog, DropdownMenu, Select, Tooltip, Tabs, Toast | Accessible primitives | B |
| SASS | Legacy seller area (SCSS modules, variables, mixins) | Where preprocessors still make sense | A |
| Styled Components | Assistant widget (client-only) | CSS-in-JS trade-offs (runtime cost, SSR) | A |
| Three.js via React Three Fiber | Product 3D viewer | WebGL from React, lazy loading | B |
| Class components | Legacy seller area + error boundary | Lifecycle, `PureComponent`, why boundaries are still classes | A |
| Jest, RTL, MSW, Enzyme, Playwright | See [Testing](#testing) | Test pyramid, what belongs where | A, B |
| React Native (Expo) | Mini-client | Sharing contracts with web | A |
| Node.js | REST API + WebSocket server | Small, deliberately simple backend | A |

\* **A** = Senior React role (realtime product, mobile). **B** = product-focused Frontend role (React/Next.js, realtime, 3D, AI).

---

## Data and realtime

### REST

Small JSON API with server-side pagination and one error shape (validated by shared Zod schemas).

| Area | Endpoints |
|---|---|
| Catalog | `/products`, `/products/:id`, `/categories` |
| Users/auth | `/auth/login`, `/auth/register`, `/auth/logout`, `/users/me` |
| Buying | `/cart`, `/orders` |
| Communication | `/conversations`, `/messages`, `/notifications` |
| Reviews | `/products/:id/reviews`, `/reviews` |
| Seller | `/seller/products`, `/seller/orders` |

### WebSocket events

| Event | Direction | Effect |
|---|---|---|
| `MESSAGE_SEND` | client → server | Send a chat message |
| `TYPING` | client → server | Throttled typing signal |
| `MESSAGE_RECEIVED` | server → client | Append to messages cache, unread +1, notification |
| `TYPING_UPDATED` | server → client | Typing indicator |
| `USER_ONLINE` / `USER_OFFLINE` | server → client | Presence dot in conversation list |
| `ORDER_UPDATED` | server → client | Patch orders cache, toast |
| `STOCK_UPDATED` | server → client | Patch product cache, live stock badge |
| `NOTIFICATION_RECEIVED` | server → client | Notification list + toast |

### Client pipeline

```text
WebSocket ─▶ RxJS connection layer (backoff retry, heartbeat, status)
          ─▶ typed event stream (filter by event type)
               ├─ MESSAGE_RECEIVED / ORDER_UPDATED ─▶ RTK Query cache patch
               ├─ STOCK_UPDATED (bufferTime batch)  ─▶ RTK Query cache patch
               ├─ NOTIFICATION_RECEIVED             ─▶ Redux notifications
               └─ USER_ONLINE/OFFLINE, TYPING       ─▶ Zustand (ephemeral)
```

Connection status (`connecting | open | reconnecting | closed`) is visible in the header and chat. The socket factory is injectable, so the pipeline can be tested without a real server.

---

## State management

| Tool | Owns | Rule of thumb |
|---|---|---|
| **RTK Query** | Server-owned data (products, orders, conversations, messages, reviews, seller resources) | If the server owns it, it lives here; realtime events patch its cache |
| **Redux Toolkit** | Auth session, cart (persisted, synced to `/cart` through listener middleware), notifications | Cross-page client state |
| **Zustand** | Draft filter values, mobile menu, chat panel state, presence/typing, 3D viewer settings | Ephemeral UI state, no persistence |
| **RxJS** | Socket lifecycle, event stream, debounce/throttle/batching | Time-based streams |
| **URL** | Committed catalog filters, sort, page | Shareable and SSR-friendly; Zustand holds only the draft/UI state around it |

---

## Forms

React Hook Form + Zod, schemas shared with the server, server errors mapped back to fields, pending and error states everywhere.

| Form | Validation highlights |
|---|---|
| Login / Register | Email format, password rules, confirm password |
| Product create/edit (seller) | Price > 0, integer stock, required title, image URLs |
| Checkout | Address, delivery option, "pay on delivery" (no real payments) |
| Profile | Optional fields, dirty-state handling |
| Review | Rating 1–5, minimum text length, one review per product |

---

## Authentication and access

Demo-grade JWT issued by the Node API: web keeps it in an httpOnly cookie, mobile in secure storage. Flows: login, register, logout, current user, protected routes (request-layer guard in Next.js plus client guards), role-based access (buyer vs seller). The WebSocket handshake is authenticated with the same token. Two seeded demo accounts allow one-click login.

---

## Performance

Seed data is deliberately large: **~2,000 products** and a conversation with **~5,000 messages**, so techniques have something to prove.

| Technique | Where | How it is shown |
|---|---|---|
| Data normalization | `createEntityAdapter` for products, messages, notifications | Cache patches by id, no list scanning |
| Memoized selectors | Cart totals, filtered/sorted lists (`createSelector`) | Unit-tested selectors |
| `React.memo`, `useCallback`, `useMemo` | `ProductCard`, list callbacks, derived data | Profiler before/after in `docs/performance.md` |
| Component composition | Chat input owns its own state; message list does not re-render while typing | Profiler evidence |
| Virtualization | Catalog list, message list | 2k items, constant DOM size |
| Concurrent UI | `useTransition` / `useDeferredValue` for search | Input stays responsive |
| Batching realtime updates | RxJS `bufferTime` for `STOCK_UPDATED` | One render per window, not per event |
| Code splitting, lazy loading | `next/dynamic` for 3D viewer, chat panel, seller area; `next/image` | Bundle/network comparison |

Not everything is memoized: only what the Profiler shows as a real problem is documented and fixed.

---

## Legacy React area

An isolated, clearly marked section (`features/seller-legacy`, route `/seller/legacy`) written the way pre-hooks React was written:

- **Class components:** `ProductTable`, `ProductRow` (`PureComponent`), `StockBadge`, `ProductFilters`, plus a class-based `ErrorBoundary`.
- **Lifecycle:** `componentDidMount` (load data), `componentDidUpdate` (react to prop changes), `componentWillUnmount` (cleanup), local class state, callback props.
- **Styling:** SCSS modules.
- **Bridge:** a thin function-component container connects hooks/RTK Query to the class tree through props.
- **Tests:** Enzyme `shallow` (row, badge) and `mount` (table interactions, lifecycle).

The rest of the app uses only function components and hooks.

---

## 3D product viewer

`widgets/product-viewer`, embedded in the product page:

- React Three Fiber + drei: `OrbitControls` (rotate, zoom, clamped camera), lighting, one small model (primitive geometry or a tiny CC0 `.glb`).
- Color variant switching; viewer settings (auto-rotate, variant) in Zustand.
- Lazy-loaded (`next/dynamic`, Suspense fallback); falls back to the image gallery when WebGL is unavailable; respects `prefers-reduced-motion`.
- WebGPU is optional and out of scope for the core build.

---

## AI shopping assistant

- Entry points: floating panel and a dedicated conversation type in `/messages`.
- **Mocked, streamed** response from a Route Handler: simple intent parsing (budget, category, keywords) over the real product API, tokens streamed to the UI, structured **product cards** inside the message.
- UX: streaming state, stop (abort), retry on error, suggestion chips.
- The provider sits behind one interface, so the mock can be replaced by a real LLM API (e.g. Vercel AI SDK) without touching the UI.
- Widget is client-only and built with Styled Components.

---

## React Native mini-client

Expo app in `apps/mobile`, deliberately small, using the same backend:

- Screens: **Products**, **Product Details**, **Cart**. Optional: **Messages** if time allows.
- Reuses `packages/shared` (types, Zod schemas, WS event contracts); RTK Query for data, a minimal cart slice.
- `FlatList`, `StyleSheet`, token in secure storage, Bearer auth.
- Purpose: show how a native client consumes the same contracts and API as the web app.

---

## Testing

Tests are written per stage, not at the end. Jest runs as three projects: `unit`, `dom` (RTL) and `legacy` (Enzyme), so adapter setup never leaks.

| Level | Tools | Targets |
|---|---|---|
| Unit | Jest | Validation schemas, selectors, slices, utilities, RxJS pipelines (marble tests with `TestScheduler`) |
| Component | Jest + RTL | `ProductCard`, `ProductList`, `LoginForm`, `CheckoutForm`, `Cart`, `ChatInput` |
| Integration | RTL + MSW | Catalog → cart → checkout with mocked API; chat with a fake socket |
| Legacy | Jest + Enzyme | `ProductRow`, `StockBadge`, `ProductTable` (shallow, mount, lifecycle) |
| E2E | Playwright | Login → browse → product → cart → checkout; **realtime flow with two browser contexts** (seller updates order, buyer sees it live) |

Representative coverage, not a coverage percentage.

---

## Engineering workflow

- **Gitflow:** `main` (stable, tagged per milestone), `develop`, `feature/<stage>-<slug>`, `release/*`, `hotfix/*`. Each stage is one PR into `develop`.
- **Conventional Commits** and a short PR template.
- **Documentation in English:** this README, `docs/architecture.md`, `docs/performance.md`, and short ADRs in `docs/adr/` (state split, realtime pipeline, FSD inside Next.js, legacy isolation, auth approach).
- ESLint, Prettier, `tsc --noEmit`; optionally one small GitHub Actions workflow running lint, typecheck and tests.

---

## Development stages

Each stage ends with a working app, tests for the new code, and a merged PR. Estimates include debugging.

| # | Stage | Delivers | Est. | Priority |
|---|---|---|---|---|
| 1 | Foundation | Monorepo, Next.js + Tailwind + Radix, shared package, Node server with seed data, Gitflow | 1.5 h | Must |
| 2 | Catalog and product page | Server-rendered product page, URL filters + Zustand UI state, normalized data, virtualized list, memoized `ProductCard` | 2 h | Must |
| 3 | Auth and forms | JWT, roles, guards, Login/Register with RHF + Zod | 1.5 h | Must |
| 4 | Cart, checkout, orders | Redux cart, RTK Query mutations with optimistic updates, checkout form, order list | 2 h | Must |
| 5 | Realtime core | WS server, RxJS pipeline, live order status and stock, notifications | 2 h | Must |
| 6 | Chat | Conversations, typing, presence, unread, connection status, seller bot | 2 h | Must |
| 7 | Seller area and legacy | Dashboard, product form, class components + Enzyme, SCSS | 2 h | Must |
| 8 | AI assistant | Streamed mock, product cards, Styled Components widget | 1 h | Should |
| 9 | 3D viewer | R3F viewer with controls and variants | 1 h | Should |
| 10 | Test hardening | Integration + Playwright flows, profiler notes | 1.5 h | Must |
| 11 | React Native client | Products, Details, Cart | 2 h | Should |
| 12 | Polish | ADRs, README screenshots, demo script | 0.5 h | Should |

**Total ≈ 19 h.** Realistic for ~2 focused days only with a strict cut line.

**Cut order if time runs out:** RN Messages screen → 3D variants → product image handling → review edit/delete → profile polish → RN client → AI assistant streaming (keep non-streamed).
**Never cut:** realtime chat, the RTK Query / Redux / Zustand / RxJS split, forms with Zod, legacy area with Enzyme, the two E2E flows.

---

## Known risks

| Risk | Mitigation |
|---|---|
| Enzyme has no official adapter beyond React 16; community adapters for React 18/19 are thinly maintained | Keep Enzyme in its own Jest project; time-box adapter setup (~20 min); fallback: isolate the legacy area in a workspace package pinned to React 18 |
| FSD `pages` layer clashes with Next.js `pages/` | Root `app/` for routing, placeholder root `pages/` |
| Redux with App Router (shared global store between requests) | Store created per request in a client provider |
| Styled Components with SSR | Used only in a client-only widget |
| React Native inside a pnpm monorepo (Metro resolution) | Expo defaults; hoisted `node-linker` if needed |
| 3D asset hunting eats time | Start with primitive geometry, swap to `.glb` only if time remains |

---

## Getting started

> Planned commands, available once the foundation stage is done.

```bash
pnpm install
pnpm dev:server   # REST + WebSocket + seed data
pnpm dev:web      # Next.js app
pnpm dev:mobile   # Expo
pnpm test         # Jest (unit, dom, legacy)
pnpm e2e          # Playwright
```

Demo accounts (buyer and seller) are seeded and offered on the login page.

## Non-goals

Payments, external auth providers, real database, real LLM, microservices, DevOps beyond one trivial workflow, advanced 3D, accessibility tooling beyond Radix primitives and `aria-live` for chat/notifications.
