# CHAPTER 2: REQUIREMENTS AND ANALYSIS

---

## 2.1 Problem Definition

### 2.1.1 Identified Operational Bottlenecks
In independent artisanal cafes, bakeries, and specialty roasteries, traditional service workflows are heavily reliant on physical paperwork, unintegrated counter terminals, and verbal handoffs. While this manual methodology may suffice for small micro-establishments during slow trading hours, it collapses under the operational pressure of peak morning surges and weekend dining periods. A detailed investigation into legacy cafe operations reveals five severe structural bottlenecks:

1. **Manual Order Capture Latency and Front-of-House Congestion:**  
   Front-of-house attendants must verbally elicit customer selections, dietary adjustments, and contact information. The manual transcription of these details into generic cash registers or paper chits creates severe physical queues at the billing counter, directly limiting customer throughput and causing foot-traffic abandonment.

2. **Kitchen Chit Miscommunication and Culinary Waste:**  
   Physical kitchen chits (KOTs) are prone to illegible handwriting, thermal printer jams, steam/liquid damage, and physical misplacement. Furthermore, custom recipe requests (such as alternative milks or sugar levels) are frequently misread by baristas during busy periods, resulting in discarded beverages, wasted premium coffee beans, and heightened food cost ratios.

3. **Total Customer Opacity During Order Lifecycle:**  
   Once payment is collected, conventional cafe setups provide zero feedback regarding order progression. Patrons are forced to stand idly around collection counters, repeatedly asking baristas whether their order is ready. This creates counter congestion, disrupts kitchen concentration, and produces an anxious, suboptimal customer experience.

4. **Prohibitive Aggregator Commissions and Brand Dilution:**  
   To offer digital convenience, many cafes turn to commercial third-party delivery platforms (such as Zomato, Swiggy, or Uber Eats). However, these intermediaries extract 20% to 35% in commission fees per ticket, strip away the cafe’s artisanal visual identity, and monopolize proprietary customer data, preventing independent operators from cultivating direct customer loyalty.

5. **Disjointed Accounting and Inconsistent Tax Computation:**  
   Generic point-of-sale setups frequently suffer from mathematical divergence between counter bills, digital receipts, and end-of-day accounts due to inconsistent application of variable Goods and Services Tax (GST) slabs and packaging overheads.

### 2.1.2 Impact on Key Stakeholders
These operational bottlenecks reverberate across all three core cafe stakeholder groups:

- **Impact on Customers:** Protracted queue waiting times, misprepared food and beverage recipes, total lack of visibility into preparation countdowns, and absence of standardized digital invoices delivered to their personal devices.
- **Impact on Kitchen Staff & Baristas:** High cognitive fatigue from decoding rushed handwritten slips, unprioritized ticket surges that violate First-Come-First-Served (FCFS) dining etiquette, and frequent distractions caused by customer status inquiries.
- **Impact on Cafe Owners & Store Managers:** Margin erosion caused by third-party aggregator commissions, inventory loss from remade beverages, lack of real-time visibility into daily turnover, and an inability to instantly mark out-of-stock items across customer menus.

### 2.1.3 Proposed Engineering Solution
To resolve these bottlenecks, **Brewline Cafe** was architected as a cloud-native, reactive digital ordering, real-time tracking, and kitchen operations management web platform. By unifying modern web technologies—specifically Next.js 16 (App Router), React 19, Google Cloud Firestore, Firebase Cloud Storage, Razorpay Payment Gateway, and Nodemailer—the system eliminates manual chits, enforces centralized mathematical precision, automates multi-channel digital invoicing, and provides sub-second live order status updates across customer viewports and kitchen consoles.

---

## 2.2 Requirement Specification

### 2.2.1 Functional Requirements

Functional requirements define the core operational capabilities, inputs, processing rules, and outputs that the Brewline Cafe system must provide.

#### Table 2.1: System Functional Requirements Matrix

| Requirement ID | Module / Subsystem | Requirement Description | Operational Acceptance Criteria |
| :---: | :--- | :--- | :--- |
| **FR-01** | **Menu Presentation** | The system shall display an interactive digital catalog encompassing 17 canonical food and beverage categories with high-resolution imagery, pricing in INR (₹), and culinary descriptions. | All active items rendered with correct category tags and Pure Vegetarian indicators. |
| **FR-02** | **Live Dietary Filter** | The system shall enable instant client-side filtering via search keywords and quick-filter toggle chips (*Veg Only, Beverages, Under ₹150*). | Catalog updates immediately on filter toggle without full browser page reload. |
| **FR-03** | **Cart Management** | The system shall maintain a reactive slide-over Cart Drawer permitting customers to increment (+), decrement (-), and delete line items. | Subtotal recalculates instantaneously with dynamic quantity steppers; clears on empty. |
| **FR-04** | **Centralized Pricing** | The system shall execute deterministic pricing calculations applying a statutory 5% GST tax and a flat ₹40 delivery/packaging surcharge. | `lib/pricing.js` formula identically executed across cart, checkout, database, and invoices. |
| **FR-05** | **User Authentication** | The system shall provide secure customer authentication via Email/Password credentials and Google OAuth Single Sign-On (Popup). | Auth state updates across `AuthContext`; unauthenticated users prompted upon cart/checkout. |
| **FR-06** | **Profile & Image Comp.** | The system shall allow users to edit personal profile details and upload avatars with client-side HTML5 canvas image compression (&le; 180 KB). | Compressed image successfully saved to Firebase Storage and URL linked to Firestore user document. |
| **FR-07** | **Checkout Validation** | The system shall mandate and validate four critical contact parameters (*Full Name &ge; 2 chars, Phone &ge; 7 digits, valid Email regex, Address &ge; 5 chars*) before permitting payment. | System displays validation error banners, scrolls to input, and blocks payment authorization until valid. |
| **FR-08** | **Digital Payment** | The system shall initialize server-side Razorpay order tokens via `/api/razorpay` and invoke the client payment modal supporting UPI, Cards, and Netbanking. | Successful payment capture triggers order persistence in Firestore; handles modal dismissal gracefully. |
| **FR-09** | **Automated Invoicing** | The system shall asynchronously compile and dispatch a responsive HTML tax invoice via Nodemailer (`/api/send-order-email`) and render a printable 8.5" &times; 11" Letter modal. | Customer receives email receipt containing itemized breakdown, tax, and order ID within 15 seconds. |
| **FR-10** | **Real-Time Stepper** | The system shall maintain real-time bi-directional synchronization via Firestore `onSnapshot`, driving an automated 4-stage stepper (*Placed &rarr; Preparing &rarr; Out for Delivery &rarr; Delivered*). | Customer tracking page updates within 400ms of administrative status modification. |
| **FR-11** | **Customer Feedback** | Upon transition to *Delivered*, the system shall display a completion screen enabling customers to submit a 1-to-5 star rating and textual review. | Rating and review text persisted directly to order document in Firestore. |
| **FR-12** | **Admin Operations** | The system shall provide administrators with a live orders queue, audio chimes, inline status dropdowns, 12-month SVG revenue curves, and instant stock toggling. | Protected route `/admin` restricted to `role === 'admin'`; toggling `inStock` immediately updates menu. |

<br/>

The structural decomposition of these twelve functional requirements across the platform's core architectural layers is illustrated below:

<div align="center" style="margin: 25px 0;">

![Figure 2.1: Functional Decomposition Architecture](blackbook/figures/fig2_1_functional_decomposition.png)

<br/>

**Figure 2.1: Brewline Cafe — System Functional Decomposition Architecture**

</div>

### 2.2.2 Non-Functional Requirements

Non-functional requirements specify the architectural qualities, performance benchmarks, security constraints, and usability criteria governing system execution.

#### Table 2.2: System Non-Functional Requirements Matrix

| Requirement ID | Quality Attribute | Technical Metric / Criterion | Implementation Mechanism |
| :---: | :--- | :--- | :--- |
| **NFR-01** | **Performance & Latency** | First Contentful Paint (FCP) &le; 1.2s; Time to Interactive (TTI) &le; 2.0s; Firestore real-time listener latency &le; 400ms. | Next.js Server Components, static asset caching, and direct WebSocket/gRPC Firebase streams. |
| **NFR-02** | **Security & Auth** | Industry-standard password hashing, TLS 1.3 encrypted data transit, role-based route guards (`role === 'admin'`). | Firebase Authentication identity tokens, HTTPS SSL encryption, and server-side role validation. |
| **NFR-03** | **Data Integrity** | Absolute historical transaction immutability; zero calculation divergence between client cart and tax invoice. | Point-in-time embedded snapshot pattern for order items; centralized calculation library (`lib/pricing.js`). |
| **NFR-04** | **Availability & Uptime** | 99.9% uptime target across customer catalog and ordering endpoints; serverless elastic scaling. | Multi-region distributed cloud infrastructure powered by Vercel Edge Network and Google Cloud Firestore. |
| **NFR-05** | **Responsive Usability** | Flawless rendering across viewports ranging from 375px mobile screens to 2560px ultra-wide desktop monitors. | Fluid CSS grid and flexbox layouts utilizing Tailwind CSS v4 breakpoint tokens (`sm`, `md`, `lg`, `xl`). |
| **NFR-06** | **Maintainability** | High modularity, zero circular dependencies, clear separation of concerns, strictly typed configuration objects. | React Context modularization (`AuthContext`, `CartContext`), atomic UI component architecture. |
| **NFR-07** | **Aesthetic Excellence** | High visual appeal utilizing curated editorial typography, harmonious cafe warm palettes, and micro-animations. | Cormorant Garamond, Playfair Display, GSAP staggered reveal animations, and Framer Motion spring physics. |
| **NFR-08** | **Payment Compliance** | Full PCI-DSS Level 1 compliance during card data capture; zero in-app storage of sensitive card or UPI credentials. | Externalized payment processing utilizing Razorpay's encrypted checkout modal and webhook signatures. |

---

## 2.3 Planning, Scheduling, and Milestones

The project was executed in accordance with the **Agile Iterative Development Framework**, organizing the 12-calendar-week timeline into five focused development sprints. Each sprint culminated in concrete, testable deliverables verified against the system's test matrix.

### Table 2.3: Project Sprints and Milestone Breakdown

| Sprint / Phase | Time Window | Core Focus Area | Major Milestones & Deliverables | Verification Gateway |
| :---: | :---: | :--- | :--- | :--- |
| **Sprint 1** | Weeks 1–2 | Inception & Domain Modeling | • Problem analysis & literature survey<br>• Technical stack evaluation (Next.js vs Vite)<br>• Cloud Firestore NoSQL schema definition | Project charter approval, Firestore collections blueprint. |
| **Sprint 2** | Weeks 3–4 | Architecture & Frontend Design | • Tailwind CSS v4 design token establishment<br>• GSAP cinematic hero header construction<br>• 17-Category interactive menu grid (`/menu`) | High-fidelity UI review, responsive layout verification. |
| **Sprint 3** | Weeks 5–6 | State Management & Cart | • `CartContext` and `AuthContext` implementation<br>• Centralized deterministic pricing library (`pricing.js`)<br>• User profile drawer with canvas image compression | Unit testing of pricing engine, image compression audit. |
| **Sprint 4** | Weeks 7–8 | Payments & Invoicing Engine | • Mandatory 4-field checkout form validation<br>• Serverless Razorpay API integration (`/api/razorpay`)<br>• Nodemailer HTML email invoice dispatch | End-to-end sandbox payment test, email delivery audit. |
| **Sprint 5** | Weeks 9–10 | Real-Time Stepper & Admin | • Firestore `onSnapshot` live order tracking stepper<br>• Active countdown ETA delivery timer<br>• Administrative live operations portal (`/admin`) | Sub-second sync verification, stock toggle verification. |
| **Final Review** | Weeks 11–12 | Quality Assurance & Report | • 25 Formal verification test cases execution<br>• Cross-browser mobile responsiveness audit<br>• Academic blackbook document compilation | 100% test pass rate, plagiarism clearance (&le; 10%). |

---

## 2.4 Software and Hardware Requirements

To guarantee reproducible deployment and optimal operational performance, the hardware and software specifications governing development, cloud hosting, and client execution are detailed below.

### 2.4.1 Hardware Requirements

#### Table 2.4: Hardware Environment Specifications

| Component | Minimum Development Specification | Recommended Development Specification | Client / End-User Device |
| :--- | :--- | :--- | :--- |
| **Processor (CPU)** | Intel Core i3 (10th Gen) or AMD Ryzen 3 | Intel Core i5/i7 (11th Gen+) or AMD Ryzen 5/7 | Dual-core smartphone SoC or PC processor |
| **System Memory (RAM)** | 8 GB DDR4 | 16 GB DDR4 / DDR5 | 2 GB RAM (Mobile) / 4 GB RAM (Desktop) |
| **Storage (Disk)** | 256 GB SSD (50 GB free space) | 512 GB NVMe M.2 Solid State Drive | Standard device flash storage |
| **Network Interface** | Standard Wi-Fi / Ethernet (&ge; 10 Mbps) | High-Speed Fiber Broadband (&ge; 50 Mbps) | 4G/5G Cellular or Broadband Wi-Fi (&ge; 2 Mbps) |
| **Display Resolution** | 1366 &times; 768 pixels | 1920 &times; 1080 (Full HD) IPS Display | 375 &times; 667 (Mobile) up to 4K UHD |

### 2.4.2 Software Environment & Dependency Specifications

#### Table 2.5: Software Stack and Platform Dependencies

| Software Layer | Technology / Tool Name | Version Specified | Function / Purpose |
| :--- | :--- | :--- | :--- |
| **Operating System** | Microsoft Windows 10/11 / macOS / Linux | 64-bit Architecture | Development host operating environment |
| **Runtime Environment** | Node.js | `v20.x` or `v22.x` (LTS) | Asynchronous event-driven JavaScript server runtime |
| **Package Manager** | npm (Node Package Manager) | `v10.x` | Dependency resolution and library installation |
| **Frontend Framework** | Next.js (App Router) | `16.2.3` | React full-stack framework with Server Components & SSR |
| **UI Library** | React & React DOM | `19.2.4` | Declarative, component-based user interface rendering |
| **Styling Engine** | Tailwind CSS & PostCSS | `4.2.2` / `8.5.9` | Utility-first responsive CSS styling with custom cafe theme |
| **Motion Libraries** | Framer Motion & GSAP | `12.38.0` / `3.15.0` | Fluid drawer physics and cinematic editorial transitions |
| **Smooth Scrolling** | Lenis | `1.3.25` | Momentum-based client-side scroll normalization |
| **Iconography** | Lucide React | `1.8.0` | Lightweight, scalable vector icons |
| **Cloud Backend & DB** | Google Firebase Web SDK | `12.11.0` | Firebase Auth, Cloud Firestore (NoSQL), Cloud Storage |
| **Payment Gateway** | Razorpay Node SDK & Checkout | `2.9.8` | Server-side order tokenization and client modal gateway |
| **Mail Transmission** | Nodemailer | `8.0.5` | Transactional HTML email invoice dispatch via SMTP |
| **Supported Browsers** | Google Chrome, Safari, Firefox, Edge | Modern Evergreen | Chromium v120+, WebKit v17+, Gecko v120+ |
