# CHAPTER 3: SYSTEM DESIGN

---

## 3.1 Basic Modules

The architectural design of **Brewline Cafe** is structured around three interconnected tiers: the **Customer Presentation Subsystem**, the **Backend & Cloud Services Engine**, and the **Administrative Operations Subsystem**. This multi-tiered modular decomposition guarantees loose coupling, high horizontal scalability, and deterministic operational flow.

### 3.1.1 Customer Presentation Subsystem (Client Tier)
The customer interface is engineered using **Next.js 16 (App Router)** and **React 19**, styled with **Tailwind CSS v4** and animated via **GSAP** and **Framer Motion**. It comprises six primary sub-modules:
1. **Hero & Brand Showcase Module (`components/Hero.js`):**  
   Presents the artisanal aesthetic identity of the cafe through editorial typography (*Cormorant Garamond*, *Playfair Display*), GSAP entrance animations, and an interactive "Today's Ritual" card displaying the daily specialty brew.
2. **Catalog & Category Filter Module (`app/menu/page.js`, `components/MenuGrid.js`):**  
   Renders the full menu across 17 canonical food and beverage categories, featuring instant client-side keyword search, quick dietary filter chips (*Veg Only, Beverages, Under ₹150*), and a bottom-right floating menu navigator popup.
3. **Cart & Centralized Pricing Module (`context/CartContext.js`, `components/CartDrawer.js`, `lib/pricing.js`):**  
   Provides a slide-over cart drawer with unit counters (+/-) and executes deterministic math calculations aggregating subtotal, 5% Goods and Services Tax (GST), and a flat ₹40 delivery/packaging fee.
4. **Checkout & Form Validation Module (`app/checkout/page.js`):**  
   Enforces strict client-side validation across four mandatory fields (*Full Name, Phone Number, Email Address, Delivery Address*), automatically populates saved customer addresses, and synchronizes updated profile information with Cloud Firestore.
5. **Real-Time Order Lifecycle Stepper (`app/track-order/[orderId]/page.js`):**  
   Maintains a persistent `onSnapshot` listener to the active order document in Firestore, driving a real-time countdown ETA timer and a 4-stage visual stepper (*Placed &rarr; Preparing &rarr; Out for Delivery &rarr; Delivered*).
6. **Delivered Feedback & Rating Module (`app/track-order/[orderId]/page.js`):**  
   Activates upon order arrival, presenting a completion confirmation, re-ordering shortcuts, and an interactive 5-star experience rating and textual review submission form.

### 3.1.2 Backend & Cloud Services Engine (Server Tier)
The backend architecture operates on a serverless, event-driven model hosted on the Vercel Edge Runtime and Google Firebase Cloud Services:
1. **Serverless Razorpay Payment Route (`app/api/razorpay/route.js`):**  
   Accepts order amount in INR, converts it to paise, injects merchant credentials, and invokes `razorpay.orders.create()` to generate encrypted transaction tokens for client checkout.
2. **Transactional HTML Email Invoicing Route (`app/api/send-order-email/route.js`):**  
   Receives transaction parameters upon successful payment, dynamically renders an inline-styled, responsive HTML tax invoice, and dispatches it via Nodemailer over SMTP.
3. **Identity & Authentication Engine (`context/AuthContext.js`):**  
   Manages session tokens, user registration, credential login, and Google OAuth Single Sign-On (SSO) using the Firebase Authentication Web SDK.
4. **Media Storage Engine (Firebase Cloud Storage):**  
   Stores high-resolution menu photography and customer avatar uploads processed through client-side HTML5 canvas compression.

### 3.1.3 Administrative Operations Subsystem (Management Tier)
The administrative portal (`app/admin/page.js`) is an elevated-privilege dashboard restricted to users with `profile.role === 'admin'`:
1. **Live Orders Queue & Kanban Controller:**  
   Listens to incoming Firestore orders in real time, triggers audio chime notifications upon ticket arrival, and enables kitchen staff to advance tickets across lifecycle stages via inline dropdown selectors.
2. **Executive Sales Analytics Engine:**  
   Translates 12 months of historical order transactions into cubic Bézier SVG area curves, summarizing Key Performance Indicators (KPIs) such as Total Revenue, Order Counts, and Average Order Value (AOV).
3. **Menu Catalog & Inventory Stock Controller:**  
   Provides a visual product management interface with an instant `inStock` toggle switch that immediately updates customer-facing menu cards to "Available" or "Sold Out" across all client devices.

---

## 3.2 Data Design

### 3.2.1 Cloud Firestore Schema Design
Brewline Cafe implements **Google Cloud Firestore**, a distributed, document-oriented NoSQL database. Documents are organized into four distinct root collections: `users`, `menu`, `orders`, and `counters`.

```
Firestore Root Database
├── users (Collection)
│   └── [uid] (Document)
│       ├── uid: String
│       ├── name: String
│       ├── email: String
│       ├── phone: String
│       ├── role: 'admin' | 'user'
│       ├── addresses: Array<String>
│       ├── photo: String (Storage URL)
│       ├── newsletter: Boolean
│       └── createdAt: Timestamp
├── menu (Collection)
│   └── [menuItemId] (Document)
│       ├── id: String
│       ├── name: String
│       ├── category: String
│       ├── price: Number
│       ├── description: String
│       ├── image: String (Storage URL)
│       ├── inStock: Boolean
│       └── createdAt: Timestamp
├── orders (Collection)
│   └── [orderId] (Document)
│       ├── id: String
│       ├── userId: String (User UID or 'guest')
│       ├── customerName: String
│       ├── customerEmail: String
│       ├── customerPhone: String
│       ├── customerAddress: String
│       ├── items: Array<OrderItemSnapshot>
│       │   ├── menuItemId: String
│       │   ├── name: String
│       │   ├── price: Number
│       │   └── qty: Number
│       ├── subtotal: Number
│       ├── taxes: Number (5% GST)
│       ├── deliveryFee: Number (₹40)
│       ├── grandTotal: Number
│       ├── status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered'
│       ├── paymentMethod: String
│       ├── razorpayOrderId: String
│       ├── razorpayPaymentId: String
│       ├── placedAt: ISO String
│       ├── preparingAt: ISO String
│       ├── outForDeliveryAt: ISO String
│       ├── deliveredAt: ISO String
│       ├── estimatedDeliveryAt: ISO String
│       ├── rating: Number (1–5)
│       ├── feedback: String
│       └── ratedAt: ISO String
└── counters (Collection)
    └── order_counter (Document)
        ├── _id: 'order_counter'
        ├── seq: Number
        └── updatedAt: Timestamp
```

#### Table 3.1: Detailed Data Dictionary — `users` Collection

| Field Name | Data Type | Key / Constraint | Description & Validation Rules |
| :--- | :--- | :---: | :--- |
| `uid` | String | **PK** | Matches Firebase Authentication UID; 28-character unique alphanumeric hash. |
| `name` | String | Required | Full customer name; minimum 2 characters. |
| `email` | String | Required, Unique | Primary email address; strictly validated by regex `^[^\s@]+@[^\s@]+\.[^\s@]+$`. |
| `phone` | String | Optional | 10-digit mobile contact number used for delivery SMS and driver coordination. |
| `role` | String | Required | Authorization role; Enum: `['admin', 'user']`. Defaults to `'user'`. |
| `addresses` | Array of Strings | Optional | List of saved physical delivery addresses for 1-click checkout selection. |
| `photo` | String | Optional | Firebase Cloud Storage download URL for canvas-compressed user avatar. |
| `newsletter` | Boolean | Required | Customer promotional opt-in toggle; defaults to `true`. |
| `createdAt` | Timestamp | Auto | Server-assigned timestamp marking account creation date. |

#### Table 3.2: Detailed Data Dictionary — `menu` Collection

| Field Name | Data Type | Key / Constraint | Description & Validation Rules |
| :--- | :--- | :---: | :--- |
| `id` | String | **PK** | Auto-generated Firestore document identifier. |
| `name` | String | Required | Title of the culinary dish or beverage; e.g. "Caramel Flan Latte". |
| `category` | String | Required | One of 17 canonical category classifications; e.g. "Hot Coffee", "Pasta". |
| `price` | Number | Required, &ge; 0 | Unit selling price denominated in Indian Rupees (INR ₹). |
| `description` | String | Optional | Detailed culinary ingredients and artisanal preparation notes. |
| `image` | String | Optional | Firebase Cloud Storage public download URL for product photography. |
| `inStock` | Boolean | Required | Real-time inventory toggle; controls visibility and ordering state on customer menu. |
| `createdAt` | Timestamp | Auto | Timestamp indicating when item was cataloged. |

#### Table 3.3: Detailed Data Dictionary — `orders` Collection

| Field Name | Data Type | Key / Constraint | Description & Validation Rules |
| :--- | :--- | :---: | :--- |
| `id` | String | **PK** | Unique order transaction document identifier. |
| `userId` | String | **FK** | Reference to customer `users.uid` or `'guest'` for unauthenticated sessions. |
| `customerName` | String | Required | Name of the recipient as entered during checkout. |
| `customerEmail` | String | Required | Destination email address for automated digital invoice transmission. |
| `customerPhone` | String | Required | Mobile contact number for delivery coordination. |
| `customerAddress` | String | Required | Complete street address, building, and landmark for fulfillment. |
| `items` | Array of Objects | Required | Immutable point-in-time snapshot array of ordered line items. |
| `items[].id` | String | Required | Reference to the originating `menu.id`. |
| `items[].name` | String | Required | Captured item title at exact time of order placement. |
| `items[].price` | Number | Required | Captured unit price at exact time of order placement. |
| `items[].qty` | Number | Required, &ge; 1 | Number of units purchased. |
| `subtotal` | Number | Required | Sum of line item calculations (`price * qty`). |
| `taxes` | Number | Required | Computed 5% Goods and Services Tax (`subtotal * 0.05`). |
| `deliveryFee` | Number | Required | Fixed packaging and delivery surcharge (₹40.00). |
| `grandTotal` | Number | Required | Final payable amount (`subtotal + taxes + deliveryFee`). |
| `status` | String | Required | Enum: `['placed', 'preparing', 'out_for_delivery', 'delivered']`. |
| `paymentMethod` | String | Required | e.g. `'Paid via Razorpay'`, `'Direct Online'`. |
| `razorpayOrderId` | String | Optional | Order token assigned by Razorpay payment gateway. |
| `razorpayPaymentId`| String | Optional | Payment confirmation token generated upon bank authorization. |
| `placedAt` | ISO String | Required | Timestamp of initial order placement. |
| `preparingAt` | ISO String | Optional | Timestamp when kitchen moved order to preparation. |
| `outForDeliveryAt` | ISO String | Optional | Timestamp when order was handed to courier. |
| `deliveredAt` | ISO String | Optional | Timestamp when delivery was finalized. |
| `estimatedDeliveryAt` | ISO String | Required | Target delivery ETA (defaults to `placedAt + 25 mins`). |
| `rating` | Number | Optional | Post-delivery star rating (Integer between 1 and 5). |
| `feedback` | String | Optional | Customer textual experience feedback review. |

<br/>

The structural relationships between these collections are illustrated in the Entity-Relationship diagram below:

<div align="center" style="margin: 25px 0;">

![Figure 3.1: Cloud Firestore Entity-Relationship Diagram](blackbook/figures/fig3_1_er_diagram.png)

<br/>

**Figure 3.1: Cloud Firestore Entity-Relationship (ER) Schema Diagram**

</div>

### 3.2.2 Data Integrity, Snapshot Immutability, and Security Rules
1. **The Point-in-Time Snapshot Pattern:**  
   In relational databases, normalized order items reference foreign keys pointing directly to a products table. However, if a store manager modifies a dish's price or renames an item, historical sales records and tax liabilities become corrupt. Brewline Cafe resolves this by embedding an immutable array of `OrderItemSnapshot` objects directly within each order document. The item title and price are locked at the moment of checkout, ensuring permanent financial integrity.
2. **Atomic Counter Synchronization:**  
   Sequential invoice numbers are generated via the `counters` collection utilizing atomic Firestore transaction increments (`FieldValue.increment(1)`), eliminating race conditions during simultaneous customer checkouts.
3. **Role-Based Firestore Security Isolation:**  
   Security rules enforce strict access boundaries: customers are permitted read/write access solely to their own profile document and orders matching their `request.auth.uid`. Administrative operations (status advancement, catalog creation, stock toggling) require verified administrative claims (`request.auth.token.role == 'admin'`).

---

## 3.3 System Logic Diagrams

### 3.3.1 System Event Table
The Event Table defines the stimuli, sources, activities, and system responses governing state transitions.

#### Table 3.4: Brewline Cafe System Event Table

| Event Name | Trigger Stimulus | Source Actor | System Activity Executed | System Response / Output | Destination Actor |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Search Menu** | Types keyword in search bar | Customer / Guest | Queries active `menu` state against item name and category | Instantaneously re-renders menu grid matching query | Customer Viewport |
| **Filter Dietary** | Clicks 'Veg Only' chip | Customer / Guest | Filters catalog array where pure vegetarian flag is true | Updates item cards displaying pure veg dishes | Customer Viewport |
| **Add to Cart** | Clicks '+' / 'Add to Cart' | Authenticated User | Dispatches `addToCart` action to `CartContext` | Increments cart badge; updates subtotal & taxes | Customer Viewport |
| **Proceed to Pay** | Submits checkout form | Customer | Validates 4 core fields (`name`, `phone`, `email`, `address`) | Invokes `/api/razorpay`; opens payment modal | Razorpay Gateway |
| **Payment Success** | Authorizes bank payment | Razorpay Gateway | Executes `addDoc('orders')`; dispatches email route | Persists order record; returns generated Order ID | Firestore / Customer |
| **Email Invoice** | Order creation callback | Next.js API Route | Nodemailer compiles responsive HTML tax invoice | Dispatches SMTP email with itemized billing | Customer Mailbox |
| **Advance Order** | Selects status in dropdown | Admin / Barista | Calls `updateDoc('orders', { status, [status]At })` | Updates order state and timestamp in Firestore | Cloud Firestore |
| **Live Sync Step** | Snapshot change detected | Cloud Firestore | Client `onSnapshot` listener triggers state update | Advances visual stepper node & recalculates ETA | Customer Tracker |
| **Toggle Stock** | Flips inventory switch | Admin | Calls `updateDoc('menu', { inStock: !item.inStock })` | Immediately renders 'Sold Out' on customer menu | Customer Catalog |
| **Submit Rating** | Submits 5-star feedback | Customer | Calls `updateDoc('orders', { rating, feedback })` | Locks rating view; updates Firestore document | Customer Tracker |

---

### 3.3.2 Use Case Diagram
The Use Case Diagram defines the interactions between human/external actors and the Brewline Cafe system.

<div align="center" style="margin: 25px 0;">

![Figure 3.2: Brewline Cafe Use Case Diagram](blackbook/figures/fig3_2_use_case_diagram.png)

<br/>

**Figure 3.2: Brewline Cafe System Use Case Diagram**

</div>

**Explanation:**  
The diagram models four primary actors: **Customer**, **Guest User**, **Kitchen Barista**, and **Administrator**, along with external integration actors (**Razorpay Gateway** and **Nodemailer SMTP**). Guests can explore the menu and filter items, while registered Customers possess authenticated privileges to manage carts, validate checkout details, execute digital payments, view real-time tracking, and submit ratings. Administrators possess exclusive control over menu inventory stock toggles, live order advancement, and sales revenue analytics.

---

### 3.3.3 Activity Diagram
The Activity Diagram models the step-by-step workflow of customer checkout, cloud processing, and kitchen fulfillment.

<div align="center" style="margin: 25px 0;">

![Figure 3.3: Activity Diagram](blackbook/figures/fig3_3_activity_diagram.png)

<br/>

**Figure 3.3: Customer Checkout and Order Fulfillment Activity Diagram**

</div>

**Explanation:**  
The activity flow spans three distinct swimlanes: Customer, Brewline Web Server, and Kitchen Barista. The customer configures cart items and inputs contact details. The client-side validation engine verifies mandatory field rules before invoking the serverless Razorpay API. Upon payment capture, the order document is committed to Cloud Firestore, triggering asynchronous Nodemailer dispatch while redirecting the customer to the live tracker. The kitchen barista receives real-time notification, advances preparation stages, and finalizes delivery, enabling customer feedback submission.

---

### 3.3.4 Class Diagram
The Class Diagram models the static object-oriented structure of the platform's core controllers and data managers.

<div align="center" style="margin: 25px 0;">

![Figure 3.4: Class Diagram](blackbook/figures/fig3_4_class_diagram.png)

<br/>

**Figure 3.4: System Structural Class Diagram**

</div>

**Explanation:**  
The class structure illustrates the core abstractions governing the system. `AuthContext` encapsulates user identity and session persistence. `CartContext` delegates pricing and tax aggregation to the static `PricingEngine` class. Order lifecycle progression and Firestore document updates are managed through `OrderController`, while catalog operations and stock availability are orchestrated by `MenuController`.

---

### 3.3.5 Object Diagram
The Object Diagram captures a concrete runtime snapshot of an active transaction within the system.

<div align="center" style="margin: 25px 0;">

![Figure 3.5: Object Diagram](blackbook/figures/fig3_5_object_diagram.png)

<br/>

**Figure 3.5: Runtime Active Order Object Instance Diagram**

</div>

**Explanation:**  
The diagram illustrates a live execution instance: user `currentUser : User` with ID `usr_9481ad72` has placed an active order `activeOrder : Order` (`#7H-20260110-0042`) currently in status `'Out for Delivery'`. The order encapsulates two concrete line items (`item1` Artisanal Cappuccino and `item2` Belgian Chocolate Croissant) with captured snapshot pricing, totaling ₹481.00 inclusive of GST and delivery.

---

### 3.3.6 Sequence Diagram
The Sequence Diagram documents the chronological message sequence exchanged between client, serverless API routes, database, and third-party gateways.

<div align="center" style="margin: 25px 0;">

![Figure 3.6: Sequence Diagram](blackbook/figures/fig3_6_sequence_diagram.png)

<br/>

**Figure 3.6: Real-Time Order Placement and Notification Sequence Diagram**

</div>

**Explanation:**  
The sequence depicts the end-to-end transaction pipeline. The client triggers form validation and calls `/api/razorpay` to generate order tokens. Razorpay modal handles payment authorization. The client writes the completed transaction to Cloud Firestore, which instantly returns the generated Order ID. In parallel, the serverless Nodemailer route dispatches a digital HTML invoice to the customer’s inbox while the client router smoothly transitions the user to the active tracking dashboard.

---

### 3.3.7 State Chart Diagram
The State Chart Diagram models the finite lifecycle states of an order transaction from inception to closure.

<div align="center" style="margin: 25px 0;">

![Figure 3.7: State Chart Diagram](blackbook/figures/fig3_7_state_chart_diagram.png)

<br/>

**Figure 3.7: Order Lifecycle State Machine Transition Diagram**

</div>

**Explanation:**  
An order begins in the initial pseudostate upon successful payment capture, entering the **Placed / Accepted** state (`placedAt`). Once the kitchen barista accepts the ticket, it transitions to **Preparing** (`preparingAt`). When packaged and dispatched, it advances to **Out for Delivery** (`outForDeliveryAt`). Upon arrival, it reaches **Delivered** (`deliveredAt`), where customer rating submission transitions the order to the final terminal state.

---

### 3.3.8 Component Diagram
The Component Diagram details the structural software subsystems and inter-module dependencies.

<div align="center" style="margin: 25px 0;">

![Figure 3.8: Component Diagram](blackbook/figures/fig3_8_component_diagram.png)

<br/>

**Figure 3.8: Next.js and Firebase Subsystem Component Diagram**

</div>

**Explanation:**  
The architecture is structured into four distinct functional tiers: the **Customer Presentation Tier** (Navbar, MenuGrid, CartDrawer, Stepper), the **Administrative Operations Tier** (AdminDashboard, OrdersQueue, MenuEditor), the **Next.js API Routing Tier** (`/api/razorpay`, `/api/send-order-email`), and the **Cloud Services Tier** (Google Cloud Firestore, Firebase Auth, Cloud Storage, Razorpay, and Nodemailer).

---

### 3.3.9 Deployment Diagram
The Deployment Diagram illustrates the physical network infrastructure, hardware nodes, and execution runtime environments.

<div align="center" style="margin: 25px 0;">

![Figure 3.9: Deployment Diagram](blackbook/figures/fig3_9_deployment_diagram.png)

<br/>

**Figure 3.9: Cloud-Native Serverless Physical Deployment Diagram**

</div>

**Explanation:**  
The physical architecture is partitioned across four operational tiers: **Client Device Tier** (running Chrome, Safari, or Firefox over HTTPS), **Cloud Application Tier** (hosted on Vercel's global Serverless Edge Network executing Next.js 16 and React 19), **Cloud Database & Storage Tier** (Google Firebase multi-region cluster connecting via gRPC and WebSockets), and **External Services Tier** (Razorpay PCI-DSS banking servers and Google Gmail SMTP infrastructure).

---

## 3.4 User Interface Design & Screen Architecture

The design system of Brewline Cafe is grounded in artisanal minimalism, utilizing warm terracotta, caramel, espresso brown, and clean off-white tones to evoke the ambiance of an authentic European coffee house.

#### Table 3.5: Design System Color Palette Tokens

| Token Name | Hex Code | HSL Representation | Semantic Application in UI |
| :--- | :---: | :---: | :--- |
| `--color-cream-bg` | `#F4EFEA` | `hsl(30, 24%, 94%)` | Primary page background tone across customer views |
| `--color-card-bg` | `#FFFFFF` | `hsl(0, 0%, 100%)` | Elevated surface card background with subtle drop shadows |
| `--color-espresso-text`| `#2E1F18` | `hsl(20, 31%, 14%)` | Primary editorial headings and heavy title typography |
| `--color-caramel-accent`| `#C08552` | `hsl(28, 48%, 54%)` | Primary action buttons, active pill highlights, rating stars |
| `--color-muted-coffee` | `#8C6A53` | `hsl(24, 25%, 44%)` | Subtitles, secondary metadata, borders, and icon strokes |
| `--color-pure-veg` | `#16A34A` | `hsl(142, 76%, 36%)`| Pure vegetarian indicator badge and status success dots |

<br/>

The high-fidelity UI screens of the platform are documented below:

<div align="center" style="margin: 20px 0;">

![Figure 3.10: Artisanal Landing Page](blackbook/figures/fig3_10_ui_landing_page.png)  
**Figure 3.10: High-Fidelity UI Screenshot: Artisanal Editorial Landing Page**

<br/><br/>

![Figure 3.11: Menu & Quick Filters](blackbook/figures/fig3_11_ui_menu_grid.png)  
**Figure 3.11: High-Fidelity UI Screenshot: Interactive Menu & Quick Filters**

<br/><br/>

![Figure 3.12: Slide-Over Cart Drawer](blackbook/figures/fig3_12_ui_cart_drawer.png)  
**Figure 3.12: High-Fidelity UI Screenshot: Slide-Over Cart & Pricing Breakdown**

<br/><br/>

![Figure 3.13: Checkout Screen](blackbook/figures/fig3_13_ui_checkout.png)  
**Figure 3.13: High-Fidelity UI Screenshot: Checkout & Mandatory Address Form**

<br/><br/>

![Figure 3.14: Live Order Stepper](blackbook/figures/fig3_14_ui_order_tracking.png)  
**Figure 3.14: High-Fidelity UI Screenshot: Live 4-Stage Stepper & ETA Countdown**

<br/><br/>

![Figure 3.15: Delivered Rating Screen](blackbook/figures/fig3_15_ui_delivered_rating.png)  
**Figure 3.15: High-Fidelity UI Screenshot: Delivered View Rating & Feedback Card**

<br/><br/>

![Figure 3.16: Admin Portal](blackbook/figures/fig3_16_ui_admin_portal.png)  
**Figure 3.16: High-Fidelity UI Screenshot: Admin Real-Time Operations Portal**

<br/><br/>

![Figure 3.17: Printable Invoice Modal](blackbook/figures/fig3_17_ui_invoice_modal.png)  
**Figure 3.17: High-Fidelity UI Screenshot: Printable 8.5" x 11" Invoice Modal**

</div>

---

## 3.5 Test Case Design Strategy

To ensure zero operational defects prior to production deployment, the testing strategy followed a structured **Verification and Validation (V&V)** methodology:
1. **Unit Testing:** Validates isolated computational functions (such as `calculateOrderTotals` in `lib/pricing.js` and canvas image compression in `ProfileDrawer.js`).
2. **Integration Testing:** Tests asynchronous cross-boundary communication between Next.js API route handlers, Cloud Firestore, Razorpay, and Nodemailer.
3. **User Acceptance Testing (UAT):** Verifies end-to-end customer workflows (browsing &rarr; carting &rarr; checkout &rarr; payment &rarr; live tracking &rarr; rating) across multiple desktop and mobile devices.
4. **Exit Criteria:** Zero Critical or High severity bugs; 100% pass rate across the 25 formal verification test cases; similarity score below 10%.
