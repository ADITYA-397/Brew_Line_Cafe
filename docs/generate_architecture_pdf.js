const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>7th Heaven Cafe — Architecture Design Document</title>
<style>
  @page {
    size: A4;
    margin: 16mm 14mm 16mm 14mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #261D17;
    background-color: #FFFFFF;
    line-height: 1.5;
    font-size: 9.5pt;
    margin: 0;
    padding: 0;
  }
  
  .header-card {
    background: linear-gradient(135deg, #241711 0%, #3D291F 60%, #543729 100%);
    color: #FFFFFF;
    padding: 24px 28px;
    border-radius: 8px;
    margin-bottom: 22px;
    border-left: 6px solid #C48851;
  }
  .header-card .badge {
    display: inline-block;
    background: #C48851;
    color: #FFFFFF;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    padding: 3px 9px;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .header-card h1 {
    font-size: 21pt;
    margin: 0 0 6px 0;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: #FDFBF8;
  }
  .header-card .subtitle {
    font-size: 11pt;
    color: #E7D7C9;
    margin: 0 0 16px 0;
    font-weight: 400;
  }
  .header-card .meta-grid {
    display: flex;
    justify-content: space-between;
    font-size: 8.5pt;
    color: #CBB9AB;
    border-top: 1px solid rgba(255,255,255,0.18);
    padding-top: 10px;
  }
  .header-card .meta-grid div strong {
    color: #FFFFFF;
  }

  h2 {
    font-size: 13pt;
    color: #2B1E16;
    border-bottom: 2px solid #E4D8CC;
    padding-bottom: 5px;
    margin-top: 22px;
    margin-bottom: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    break-after: avoid;
    page-break-after: avoid;
  }
  h2 .num-badge {
    background: #C48851;
    color: #FFFFFF;
    font-size: 9pt;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
  }
  h3 {
    font-size: 10.5pt;
    color: #4A3528;
    margin-top: 14px;
    margin-bottom: 6px;
    font-weight: 700;
    break-after: avoid;
    page-break-after: avoid;
  }
  p {
    margin: 0 0 8px 0;
    color: #362920;
    text-align: justify;
  }
  ul, ol {
    margin: 4px 0 10px 18px;
    padding: 0;
  }
  li {
    margin-bottom: 4px;
    color: #362920;
  }
  
  .box-container {
    background: #FDFCF9;
    border: 1px solid #E6DDD3;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 14px;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0 14px 0;
    font-size: 8.5pt;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  th, td {
    border: 1px solid #D8CCBF;
    padding: 6px 8px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #F4ECE3;
    color: #281C15;
    font-weight: 700;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  tr:nth-child(even) td {
    background-color: #FAF6F0;
  }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 8.2pt;
    background: #EFE7DE;
    padding: 1px 4px;
    border-radius: 3px;
    color: #522C16;
  }
  pre.diagram {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 7.8pt;
    line-height: 1.35;
    background: #251B15;
    color: #F5EAE0;
    padding: 10px 14px;
    border-radius: 6px;
    border-left: 4px solid #C48851;
    overflow-x: auto;
    margin: 8px 0 12px 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  pre.wireframe {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 7.5pt;
    line-height: 1.3;
    background: #FAF7F2;
    color: #241A14;
    padding: 9px 12px;
    border-radius: 5px;
    border: 1px solid #DFD5CA;
    margin: 6px 0 12px 0;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .pk-tag {
    background: #2E7D32;
    color: #FFFFFF;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 7pt;
  }
  .fk-tag {
    background: #0277BD;
    color: #FFFFFF;
    font-weight: 700;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 7pt;
  }
  .page-break {
    page-break-before: always;
    break-before: always;
  }
  .footer-bar {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #E2D7CC;
    font-size: 7.5pt;
    color: #8C786A;
    display: flex;
    justify-content: space-between;
  }
</style>
</head>
<body>

<!-- COVER / HEADER -->
<div class="header-card">
  <div class="badge">System Architecture Design Specification</div>
  <h1>7TH HEAVEN CAFE — ARCHITECTURE DESIGN</h1>
  <div class="subtitle">Cloud-Integrated Artisanal Cafe &amp; Bakehouse Digital Ordering &amp; Kitchen Operations System</div>
  <div class="meta-grid">
    <div><strong>Project:</strong> 7th Heaven Cafe (Cafe 2)</div>
    <div><strong>Platform:</strong> Next.js 16, React 19, TailwindCSS</div>
    <div><strong>Backend &amp; DB:</strong> Google Firebase &amp; Firestore NoSQL</div>
    <div><strong>Payment &amp; Messaging:</strong> Razorpay &amp; Nodemailer</div>
  </div>
</div>

<!-- SECTION 1: FRONT-END DESIGN -->
<h2><span class="num-badge">1</span> FRONT-END DESIGN</h2>
<p><strong>Objective:</strong> Design and structure what users (customers, kitchen baristas, and administrators) view and interact with, including user interfaces, visual screen wireframes, and sequential navigation flowcharts.</p>

<h3>A. User Interfaces / Screens</h3>
<p>The 7th Heaven Cafe platform incorporates two distinct operational interfaces:</p>
<ol>
  <li><strong>Home / Brand Landing Page:</strong> Artisanal hero showcase, specialty beverage carousels, cafe philosophy, operating hours, and quick-access ordering CTA.</li>
  <li><strong>Menu &amp; Category Filter Grid:</strong> Filterable by category tabs (<em>Hot Coffee, Cold Coffee, Refreshers, Milkshakes, Cupcake Milkshakes, Mug Cakes</em>), dietary toggles (<em>Vegetarian / Eggless</em>), and live instant search bar.</li>
  <li><strong>Item Customization Modal:</strong> Allows customers to customize milk preferences (<em>Oat, Almond, Soy, Regular</em>), select extra espresso shots, and choose sweetness levels before adding to cart.</li>
  <li><strong>Slide-Over Cart Drawer:</strong> Real-time item listing, unit counter (+/-), addon badges, promotional coupon entry box, live bill breakdown, and checkout button.</li>
  <li><strong>Checkout Screen (<code>/checkout</code>):</strong> Order fulfillment options (<em>Door Delivery, Table Dine-in, Takeaway Pickup</em>), customer details, street address with pincode, payment method selection (<em>Razorpay Online vs Cash on Delivery</em>), and price breakdown.</li>
  <li><strong>Live Order Tracking Screen (<code>/track-order/[orderId]</code>):</strong> Real-time 4-stage animated stepper (<em>Placed &rarr; Preparing &rarr; Out for Delivery &rarr; Delivered</em>), live preparation countdown timer, courier details, and itemized invoice modal.</li>
  <li><strong>Customer Profile &amp; Order History Drawer:</strong> Saved delivery addresses, personal details, past order receipt archive, 1-click reorder button, and secure sign-out.</li>
  <li><strong>Customer Login Screen (<code>/login</code>):</strong> Email and password credentials, Google OAuth One-Tap sign-in, and guest checkout direct continuation.</li>
  <li><strong>Customer Registration Screen (<code>/signup</code>):</strong> Account creation form (Full name, email, 10-digit mobile number, password, and promotional newsletter opt-in).</li>
  <li><strong>Admin / Kitchen Operations Kanban Portal (<code>/admin</code>):</strong> Real-time Kanban board with synchronized order columns (<em>New Placed, Brewing/Baking, Dispatched, Delivered</em>), audio chime for incoming orders, and quick status advance controls.</li>
  <li><strong>Menu &amp; Inventory Management Screen:</strong> Real-time item stock availability toggle (<code>inStock: true/false</code>), new product creation form, price/addon editor, and catalog delete/archive.</li>
  <li><strong>Sales Analytics &amp; Revenue Dashboard:</strong> Live metrics including Gross Revenue, Completed Ticket Count, Average Order Value (AOV), and top-selling coffees/pastries.</li>
  <li><strong>Coupons &amp; Promotions Management:</strong> Creation and scheduling of promotional codes, minimum subtotal thresholds, percentage or flat discounts, and expiration windows.</li>
</ol>

<h3>B. Screen Design (Rough UI Wireframes)</h3>

<p><strong>1. Customer Menu &amp; Slide-Over Cart Interface:</strong></p>
<pre class="wireframe">
+-------------------------------------------------------------------------------+
|  ☕ 7TH HEAVEN CAFE        [ Home ]  [ Menu ]  [ About ]      🔍 [Cart (2)] 👤|
+-------------------------------------------------------------------------------+
|  Categories: [ All ] [ Hot Coffee ] [ Cold Coffee ] [ Shakes ] [ Mug Cakes ]  |
|  Search: [ Search cappuccino, frappe, latte...              ]     [🌱 Veg Only]|
+-------------------------------------------------------------------------------+
|  +-------------------------+  +-------------------------+  +----------------+ |
|  | [ Image: Caramel Latte] |  | [ Image: Hazelnut Frappe|  | [ Image: Cake] | |
|  | Caramel Flan Latte  🌱  |  | Hazelnut Cold Frappe 🌱 |  | Belgian Mug 🥚 | |
|  | Double shot, velvet milk|  | Blended with cream      |  | Warm molten core| |
|  | ₹240                    |  | ₹280                    |  | ₹190           | |
|  | [+ Add to Cart]         |  | [+ Add to Cart]         |  | [ SOLD OUT ]   | |
|  +-------------------------+  +-------------------------+  +----------------+ |
+-------------------------------------------------------------------------------+
| CART DRAWER (Slide-over):                                                     |
|  - 1x Caramel Flan Latte (Oat Milk +₹30) ............................ ₹270     |
|  - 1x Hazelnut Cold Frappe (Regular) ................................ ₹280     |
|  [ Coupon Code: 7HFIRST   ] [ APPLY ] -> (Success: ₹50 OFF applied!)           |
|  Subtotal: ₹550.00 | GST (5%): ₹27.50 | Delivery: ₹0.00 | Grand Total: ₹527.50|
|  [ PROCEED TO CHECKOUT -> ]                                                   |
+-------------------------------------------------------------------------------+
</pre>

<p><strong>2. Checkout Screen (<code>/checkout</code>):</strong></p>
<pre class="wireframe">
---------------------------------------------------------------------------------
                               7TH HEAVEN CAFE — CHECKOUT
---------------------------------------------------------------------------------
[1] FULFILLMENT:  (•) Door Delivery     ( ) Dine-in / Table     ( ) Takeaway Pickup

[2] CUSTOMER & DELIVERY ADDRESS:
    Full Name:      [ Aditya Sharma               ]
    Phone Number:   [ +91 98765 43210             ]
    Email Address:  [ aditya@example.com          ] (Digital invoice sent here)
    Street Address: [ Flat 402, Sunshine Heights, MG Road                      ]
    Landmark:       [ Near Metro Station Gate 2   ]   Pincode: [ 400001 ]

[3] PAYMENT METHOD:
    (•) Pay Online via Razorpay (UPI, Credit/Debit Card, Netbanking)
    ( ) Cash on Delivery (COD)

[4] BILL BREAKDOWN:
    Caramel Flan Latte (x1) ₹270  |  Hazelnut Frappe (x1) ₹280
    Item Subtotal: ₹550.00  |  GST (5%): ₹27.50  |  Discount: -₹50.00  |  Delivery: FREE
    -----------------------------------------------------------------------------
    NET AMOUNT PAYABLE: ₹527.50
    -----------------------------------------------------------------------------
    [ PLACE ORDER & PAY ₹527.50 ]
---------------------------------------------------------------------------------
</pre>

<p><strong>3. Real-Time Order Tracking Screen (<code>/track-order/[orderId]</code>):</strong></p>
<pre class="wireframe">
---------------------------------------------------------------------------------
                       ORDER TRACKING: #7H-20260303-0042
---------------------------------------------------------------------------------
Status: KITCHEN IS CURRENTLY PREPARING YOUR ORDER ☕
Estimated Delivery: ~18 Minutes (Target Arrival: 09:15 AM)

[ (✓) Placed ] ------> [ (●) Preparing ] ------> [ ( ) On the Way ] ------> [ ( ) Delivered ]
  08:45 AM                At Espresso Station       With Delivery Agent       Pending

Items Ordered:
  - 1x Caramel Flan Latte (Customized: Oat Milk)
  - 1x Hazelnut Cold Frappe (Regular)
Delivery Destination: Flat 402, Sunshine Heights, MG Road
Payment Status: ₹527.50 (Paid Online via Razorpay #pay_823746)

[ 📄 View / Download Tax Invoice ]      [ 📞 Contact Cafe Support ]
---------------------------------------------------------------------------------
</pre>

<p><strong>4. Admin &amp; Kitchen Real-Time Kanban Board (<code>/admin</code>):</strong></p>
<pre class="wireframe">
+-------------------------------------------------------------------------------+
|  7TH HEAVEN KITCHEN DISPATCH  |  🔔 Sound: ON  | Active Orders: 6 | 🔄 Auto-Sync|
+-------------------------------------------------------------------------------+
| [NEW PLACED (2)]      | [PREPARING (2)]       | [DISPATCHED (1)]  | [DELIVERED]|
+-----------------------+-----------------------+-------------------+------------+
| Order #7H-0043 (COD)  | Order #7H-0042 (PAID) | Order #7H-0040    | Order #0039|
| Time: 2 mins ago      | Time: 11 mins ago     | Courier: Sunil K. | Completed  |
| Items:                | Items:                | ETA: 6 mins       | ₹680 (COD) |
| - 2x Belgian Mug Cake | - 1x Caramel Latte    | ----------------- |            |
| - 1x Americano        | - 1x Hazelnut Frappe  | [Mark Delivered]  | [Archived] |
| Total: ₹480           | Total: ₹527.50        |                   |            |
| [ACCEPT & PREPARE ->] | [DISPATCH ORDER ->]   |                   |            |
+-----------------------+-----------------------+-------------------+------------+
</pre>

<h3>C. Navigation Flow</h3>
<p><strong>Customer Navigation Flow:</strong></p>
<pre class="diagram">
                       [ Home / Landing Page ]
                                  │
                                  ▼
                        [ Menu Catalog Grid ]
                           │             │
            (Click Item)   │             │   (Quick Add)
                           ▼             ▼
               [ Customization Modal ] ──► [ Cart Drawer ]
                                                  │
                                                  ▼
                                          [ Checkout Screen ]
                                           /              \
                        (Online Razorpay) /                \ (Cash on Delivery)
                                         ▼                  ▼
                            [ Razorpay Gateway ]      [ Order Placed ]
                                         │                  │
                                         └────────┬─────────┘
                                                  │
                                                  ▼
                                   [ Live Order Tracker Screen ]
                                                  │
                                                  ▼
                                   [ Digital Invoice Generated ]
</pre>

<div class="page-break"></div>

<!-- SECTION 2: BUSINESS LOGIC DESIGN -->
<h2><span class="num-badge">2</span> BUSINESS LOGIC DESIGN</h2>
<p><strong>Objective:</strong> Business Logic explains how the system processes input, applies pricing formulas, executes security checks, and manages state machines across the entire order lifecycle.</p>

<h3>A. Identify System Modules</h3>
<ul>
  <li><strong>Authentication &amp; User Session Module:</strong> Firebase Auth integration, JWT verification, role-based access control (<code>customer</code>, <code>kitchen</code>, <code>delivery</code>, <code>admin</code>), and guest checkout session persistence.</li>
  <li><strong>Catalog &amp; Real-time Stock Module:</strong> Item category filtering, live stock toggle (<code>inStock: true/false</code>), and dynamic price retrieval.</li>
  <li><strong>Cart &amp; Server-Side Pricing Engine:</strong> Independent recalculation of line items, 5% GST tax, delivery fee waivers, and promo discounts.</li>
  <li><strong>Payment Gateway Module:</strong> Server-side Razorpay order generation (<code>/api/razorpay</code>) and cryptographic HMAC-SHA256 signature verification.</li>
  <li><strong>Order Lifecycle &amp; Kitchen Queue Module:</strong> State progression machine (<code>placed</code> &rarr; <code>preparing</code> &rarr; <code>out_for_delivery</code> &rarr; <code>delivered</code>) using real-time Firestore listeners (<code>onSnapshot</code>).</li>
  <li><strong>Automated Invoicing &amp; Notification Module:</strong> Automated dispatch of itemized HTML invoices via Nodemailer upon successful order placement.</li>
</ul>

<h3>B. Business Rules &amp; Order Placement Logic</h3>
<div class="box-container">
  <strong>Key Operational Rules:</strong>
  <ol>
    <li>The customer cart must contain at least one valid item.</li>
    <li>Every ordered item must have <code>inStock == true</code> in Firestore at the moment of checkout.</li>
    <li>Client-side prices are <strong>never</strong> trusted; all line item costs and totals are recalculated server-side from catalog documents.</li>
    <li>If Subtotal &ge; ₹500, delivery charge is waived (₹0); otherwise, a flat ₹40 fee applies.</li>
    <li>A statutory GST of 5% is levied on all food and beverage preparations.</li>
    <li>Online orders must have cryptographically verified Razorpay signatures before tickets are sent to the kitchen.</li>
  </ol>
</div>

<p><strong>Step-by-Step Processing Logic:</strong></p>
<pre class="diagram">
Customer clicks [ PLACE ORDER ]
         │
         ▼
Validate customer input fields (Name, Phone, Address, Email)
         │
         ▼
Fetch current MenuItem documents from Firestore by ID
         │
         ▼
IF any item.inStock == false THEN
    Display Error: "Item [Item Name] is currently sold out."
    HALT
ELSE
    Calculate line total = (Base Price + Sum of Addons) * Quantity
    Calculate Subtotal = Sum of all Line Totals
    IF Subtotal >= ₹500 THEN
        Delivery Fee = ₹0
    ELSE
        Delivery Fee = ₹40
    ENDIF
    Apply verified coupon discount (if valid)
    Taxes = Subtotal * 0.05 (5% GST)
    Grand Total = Subtotal + Taxes + Delivery Fee - Discount
         │
         ▼
    IF Payment Method == "Online (Razorpay)" THEN
        Create Razorpay Order (amount in paise = Grand Total * 100)
        Execute Razorpay checkout modal
        Verify returned signature: HMAC_SHA256(order_id + '|' + payment_id, secret)
        IF signature mismatch THEN
            Record order status = "failed"
            Display "Payment Verification Error"
            HALT
        ENDIF
        Set paymentStatus = "paid"
    ELSE
        Set paymentStatus = "pending" (Cash on Delivery)
    ENDIF
         │
         ▼
    Atomically increment sequence counter -> Generate Order No: "7H-YYYYMMDD-XXXX"
    Create document in `orders` collection with status: "placed"
    Trigger background Nodemailer invoice to customer's email
    Broadcast real-time ticket to Kitchen Kanban display
    Redirect user to `/track-order/[orderId]`
</pre>

<h3>C. Kitchen Queue &amp; Order Fulfillment Logic</h3>
<pre class="diagram">
Order created in Firestore with status: 'placed'
         │
         ▼
Kitchen staff views incoming ticket on Kanban board & clicks [ Accept & Prepare ]
         │
         ▼
Update order document:
  - status = 'preparing'
  - estimatedDeliveryAt = Current Time + 25 Minutes
Firestore onSnapshot pushes instant update to customer's live tracking view
         │
         ▼
Chef finishes brewing & packaging; clicks [ Dispatch Order ]
         │
         ▼
Update order document:
  - status = 'out_for_delivery'
Customer tracking screen updates to show courier on route
         │
         ▼
Delivery agent hands package to customer; clicks [ Confirm Delivered ]
         │
         ▼
Update order document:
  - status = 'delivered'
  - deliveredAt = Current Timestamp
  - IF paymentMethod == "Cash on Delivery" THEN paymentStatus = 'paid'
Trigger post-fulfillment star rating & customer review prompt
</pre>

<h3>D. Pricing &amp; Tax Calculation Formulas</h3>
<p><strong>1. Line Item Total Formula:</strong></p>
<p>$$\text{Item Line Total} = (\text{Base Price} + \sum \text{Selected Addon Prices}) \times \text{Quantity}$$</p>

<p><strong>2. Tax &amp; Delivery Calculation:</strong></p>
<p>$$\text{GST Amount} = \text{Subtotal} \times 0.05 \quad (5\%)$$</p>
<p>$$\text{Delivery Fee} = \begin{cases} ₹0, & \text{if Subtotal} \ge ₹500 \\ ₹40, & \text{if Subtotal} < ₹500 \end{cases}$$</p>

<p><strong>3. Coupon Discount Formula:</strong></p>
<p>$$\text{Discount} = \min\left(\text{Subtotal} \times \frac{\text{Discount Percentage}}{100}, \text{Max Discount Cap}\right)$$</p>

<p><strong>Complete Calculation Example:</strong></p>
<ul>
  <li>1x Caramel Flan Latte (Base ₹240 + Oat Milk ₹30) = ₹270.00</li>
  <li>1x Hazelnut Cold Frappe (Base ₹280) = ₹280.00</li>
  <li><strong>Subtotal:</strong> ₹270 + ₹280 = <strong>₹550.00</strong></li>
  <li><strong>Delivery Fee:</strong> ₹0.00 (Since ₹550 &ge; ₹500 threshold)</li>
  <li><strong>Coupon Applied:</strong> <code>7HFIRST</code> (10% off, max ₹60) &rarr; Discount = $\min(550 \times 0.10, 60) =$ <strong>₹55.00</strong></li>
  <li><strong>GST (5%):</strong> $550 \times 0.05 =$ <strong>₹27.50</strong></li>
  <li><strong>Grand Total:</strong> $550.00 + ₹27.50 + ₹0.00 - ₹55.00 =$ <strong>₹522.50</strong></li>
</ul>

<h3>E. Validation Rules</h3>
<table>
  <thead>
    <tr>
      <th style="width: 20%;">Input Field</th>
      <th style="width: 45%;">Validation Rule / Constraint</th>
      <th style="width: 35%;">Error Handling Output</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Customer Name</strong></td>
      <td>Required, alphabetic &amp; spaces, 2 to 60 characters</td>
      <td>"Please enter a valid full name."</td>
    </tr>
    <tr>
      <td><strong>Email Address</strong></td>
      <td>Required, valid RFC 5322 email regular expression</td>
      <td>"Please enter a valid email for invoice receipt."</td>
    </tr>
    <tr>
      <td><strong>Mobile Number</strong></td>
      <td>Required, exactly 10 digits starting with 6-9</td>
      <td>"Enter a valid 10-digit mobile number."</td>
    </tr>
    <tr>
      <td><strong>Delivery Address</strong></td>
      <td>Required for delivery orders, minimum 10 characters</td>
      <td>"Complete delivery address is required."</td>
    </tr>
    <tr>
      <td><strong>Cart Quantity</strong></td>
      <td>Integer &ge; 1 and &le; 20 per item</td>
      <td>"Quantity must be between 1 and 20."</td>
    </tr>
    <tr>
      <td><strong>Item Stock</strong></td>
      <td>Must verify <code>inStock == true</code> in Firestore</td>
      <td>"Item is currently sold out."</td>
    </tr>
    <tr>
      <td><strong>Coupon Code</strong></td>
      <td>Active, non-expired, and <code>Subtotal &ge; minOrderValue</code></td>
      <td>"Coupon invalid or order threshold not met."</td>
    </tr>
    <tr>
      <td><strong>Payment Signature</strong></td>
      <td>HMAC-SHA256 hash match with Razorpay secret key</td>
      <td>"Transaction security verification failed."</td>
    </tr>
  </tbody>
</table>

<h3>F. User Roles and Permissions</h3>
<table>
  <thead>
    <tr>
      <th style="width: 25%;">User Role</th>
      <th style="width: 75%;">Allowed Operations &amp; Access Controls</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Guest User</strong></td>
      <td>Browse menu catalog, customize beverages, add to cart, execute checkout, track order by URL ID.</td>
    </tr>
    <tr>
      <td><strong>Customer (Registered)</strong></td>
      <td>All Guest features, plus: save multiple delivery addresses, view order history, 1-click reorder, rate orders.</td>
    </tr>
    <tr>
      <td><strong>Kitchen Staff / Barista</strong></td>
      <td>Access <code>/admin</code> kitchen queue, receive live order chimes, advance status (Placed &rarr; Preparing), toggle item stock status.</td>
    </tr>
    <tr>
      <td><strong>Delivery Rider</strong></td>
      <td>Access assigned deliveries, view customer contact &amp; address, advance status (Dispatched &rarr; Delivered), mark COD collected.</td>
    </tr>
    <tr>
      <td><strong>Cafe Administrator</strong></td>
      <td>Full platform access: add/update/delete menu catalog items, manage promotional coupons, view daily/monthly sales analytics, process refunds.</td>
    </tr>
  </tbody>
</table>

<div class="page-break"></div>

<!-- SECTION 3: DATABASE DESIGN -->
<h2><span class="num-badge">3</span> DATABASE DESIGN</h2>
<p><strong>Objective:</strong> Detail how data is structured and stored using Google Cloud Firestore (NoSQL), including document collections, frozen point-in-time snapshot models, primary keys, and foreign references.</p>

<h3>A. Identify Entities / Collections</h3>
<ol>
  <li><strong><code>users</code>:</strong> Stores registered customer profiles, saved delivery addresses, and staff role assignments.</li>
  <li><strong><code>menu_items</code>:</strong> Stores food and beverage offerings, prices, customization options, and live stock toggles.</li>
  <li><strong><code>orders</code>:</strong> Records purchase transactions, embedded item snapshots, payment statuses, and delivery states.</li>
  <li><strong><code>coupons</code>:</strong> Stores promotional discount vouchers, validity conditions, and discount limits.</li>
  <li><strong><code>order_sequences</code>:</strong> Atomic sequential counters used to generate human-readable invoice identifiers.</li>
</ol>

<h3>B. Table / Collection Structures</h3>

<p><strong>1. Collection: <code>users</code></strong></p>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Field Name</th>
      <th style="width: 18%;">Data Type</th>
      <th style="width: 12%;">Key</th>
      <th style="width: 48%;">Description &amp; Constraints</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>uid</code></td>
      <td>String</td>
      <td><span class="pk-tag">PK</span></td>
      <td>Firebase Auth UID (Unique identifier for customer/staff)</td>
    </tr>
    <tr>
      <td><code>name</code></td>
      <td>String</td>
      <td></td>
      <td>Required. User full name</td>
    </tr>
    <tr>
      <td><code>email</code></td>
      <td>String</td>
      <td>Unique</td>
      <td>Required. User email address for auth and digital invoices</td>
    </tr>
    <tr>
      <td><code>phone</code></td>
      <td>String</td>
      <td></td>
      <td>Customer contact number for delivery coordination</td>
    </tr>
    <tr>
      <td><code>role</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['customer', 'kitchen', 'delivery', 'admin']</code> (Default: <code>'customer'</code>)</td>
    </tr>
    <tr>
      <td><code>addresses</code></td>
      <td>Array of Objects</td>
      <td></td>
      <td>List of saved addresses: <code>[{ tag, street, landmark, city, pincode, isDefault }]</code></td>
    </tr>
    <tr>
      <td><code>createdAt</code></td>
      <td>Timestamp</td>
      <td></td>
      <td>Account creation timestamp</td>
    </tr>
  </tbody>
</table>

<p><strong>2. Collection: <code>menu_items</code></strong></p>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Field Name</th>
      <th style="width: 18%;">Data Type</th>
      <th style="width: 12%;">Key</th>
      <th style="width: 48%;">Description &amp; Constraints</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>String</td>
      <td><span class="pk-tag">PK</span></td>
      <td>Unique auto-generated document ID</td>
    </tr>
    <tr>
      <td><code>name</code></td>
      <td>String</td>
      <td></td>
      <td>Required. Beverage/pastry name (e.g., "Caramel Flan Latte")</td>
    </tr>
    <tr>
      <td><code>category</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['Hot Coffee', 'Cold Coffee', 'Refreshers', 'Milkshakes', 'Mug Cakes']</code></td>
    </tr>
    <tr>
      <td><code>price</code></td>
      <td>Number</td>
      <td></td>
      <td>Base selling price in INR (₹)</td>
    </tr>
    <tr>
      <td><code>description</code></td>
      <td>String</td>
      <td></td>
      <td>Flavor notes and culinary description</td>
    </tr>
    <tr>
      <td><code>image</code></td>
      <td>String</td>
      <td></td>
      <td>Cloud Storage public media URL</td>
    </tr>
    <tr>
      <td><code>inStock</code></td>
      <td>Boolean</td>
      <td></td>
      <td>Default: <code>true</code>. Real-time availability toggle for kitchen</td>
    </tr>
    <tr>
      <td><code>isVegetarian</code></td>
      <td>Boolean</td>
      <td></td>
      <td>Default: <code>true</code>. Dietary indicator badge</td>
    </tr>
    <tr>
      <td><code>isBestseller</code></td>
      <td>Boolean</td>
      <td></td>
      <td>Default: <code>false</code>. Featured on homepage recommendations</td>
    </tr>
    <tr>
      <td><code>addons</code></td>
      <td>Array of Objects</td>
      <td></td>
      <td>Customizable additions: <code>[{ name: 'Oat Milk', price: 30 }]</code></td>
    </tr>
  </tbody>
</table>

<p><strong>3. Collection: <code>orders</code></strong></p>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Field Name</th>
      <th style="width: 18%;">Data Type</th>
      <th style="width: 12%;">Key</th>
      <th style="width: 48%;">Description &amp; Constraints</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>id</code></td>
      <td>String</td>
      <td><span class="pk-tag">PK</span></td>
      <td>Unique auto-generated document ID</td>
    </tr>
    <tr>
      <td><code>orderNumber</code></td>
      <td>String</td>
      <td>Unique</td>
      <td>Sequential invoice ticket (e.g., <code>'7H-20260303-0042'</code>)</td>
    </tr>
    <tr>
      <td><code>userId</code></td>
      <td>String</td>
      <td><span class="fk-tag">FK</span></td>
      <td>References <code>users.uid</code> or <code>'guest'</code> for non-registered checkouts</td>
    </tr>
    <tr>
      <td><code>customerName</code></td>
      <td>String</td>
      <td></td>
      <td>Customer full name entered at checkout</td>
    </tr>
    <tr>
      <td><code>customerEmail</code></td>
      <td>String</td>
      <td></td>
      <td>Recipient email for digital invoice delivery</td>
    </tr>
    <tr>
      <td><code>customerPhone</code></td>
      <td>String</td>
      <td></td>
      <td>Contact phone number for courier</td>
    </tr>
    <tr>
      <td><code>customerAddress</code></td>
      <td>String</td>
      <td></td>
      <td>Complete street destination with landmark and pincode</td>
    </tr>
    <tr>
      <td><code>orderType</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['delivery', 'takeaway', 'dine_in']</code></td>
    </tr>
    <tr>
      <td><code>items</code></td>
      <td>Array of Objects</td>
      <td></td>
      <td><strong>Point-in-Time Snapshot:</strong> <code>[{ menuItemId, name, price, qty, selectedAddons, itemTotal }]</code></td>
    </tr>
    <tr>
      <td><code>subtotal</code></td>
      <td>Number</td>
      <td></td>
      <td>Sum of line items before tax and shipping</td>
    </tr>
    <tr>
      <td><code>taxes</code></td>
      <td>Number</td>
      <td></td>
      <td>5% GST calculation</td>
    </tr>
    <tr>
      <td><code>deliveryFee</code></td>
      <td>Number</td>
      <td></td>
      <td>₹0 (Subtotal &ge; ₹500) or ₹40</td>
    </tr>
    <tr>
      <td><code>discount</code></td>
      <td>Number</td>
      <td></td>
      <td>Coupon deduction amount in INR</td>
    </tr>
    <tr>
      <td><code>grandTotal</code></td>
      <td>Number</td>
      <td></td>
      <td>Net payable amount charged to customer</td>
    </tr>
    <tr>
      <td><code>paymentMethod</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['Online (Razorpay)', 'Cash on Delivery']</code></td>
    </tr>
    <tr>
      <td><code>paymentStatus</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['pending', 'paid', 'failed']</code></td>
    </tr>
    <tr>
      <td><code>paymentId</code></td>
      <td>String</td>
      <td></td>
      <td>Razorpay transaction reference (e.g., <code>'pay_918237'</code>)</td>
    </tr>
    <tr>
      <td><code>status</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']</code></td>
    </tr>
    <tr>
      <td><code>placedAt</code></td>
      <td>Timestamp</td>
      <td></td>
      <td>Order submission time</td>
    </tr>
    <tr>
      <td><code>estimatedDeliveryAt</code></td>
      <td>Timestamp</td>
      <td></td>
      <td>Target countdown completion time</td>
    </tr>
    <tr>
      <td><code>deliveredAt</code></td>
      <td>Timestamp</td>
      <td></td>
      <td>Handoff completion timestamp</td>
    </tr>
  </tbody>
</table>

<p><strong>4. Collection: <code>coupons</code></strong></p>
<table>
  <thead>
    <tr>
      <th style="width: 22%;">Field Name</th>
      <th style="width: 18%;">Data Type</th>
      <th style="width: 12%;">Key</th>
      <th style="width: 48%;">Description &amp; Constraints</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>code</code></td>
      <td>String</td>
      <td><span class="pk-tag">PK</span></td>
      <td>Uppercase alphanumeric promotional voucher (e.g., <code>'7HFIRST'</code>)</td>
    </tr>
    <tr>
      <td><code>discountType</code></td>
      <td>String</td>
      <td></td>
      <td>Enum: <code>['percentage', 'flat']</code></td>
    </tr>
    <tr>
      <td><code>discountValue</code></td>
      <td>Number</td>
      <td></td>
      <td>Discount quantum (e.g., 10 for 10%, or 50 for flat ₹50)</td>
    </tr>
    <tr>
      <td><code>maxDiscount</code></td>
      <td>Number</td>
      <td></td>
      <td>Upper limit cap in INR for percentage discounts</td>
    </tr>
    <tr>
      <td><code>minOrderValue</code></td>
      <td>Number</td>
      <td></td>
      <td>Minimum cart subtotal required to activate coupon</td>
    </tr>
    <tr>
      <td><code>validUntil</code></td>
      <td>Timestamp</td>
      <td></td>
      <td>Expiration timestamp</td>
    </tr>
    <tr>
      <td><code>isActive</code></td>
      <td>Boolean</td>
      <td></td>
      <td>Administrative toggle to enable/disable code</td>
    </tr>
  </tbody>
</table>

<h3>C. Primary Key &amp; Foreign Key Mapping</h3>
<ul>
  <li><strong>Primary Keys (PK):</strong>
    <ul>
      <li><code>users.uid</code>: Uniquely identifies registered user or staff profile.</li>
      <li><code>menu_items.id</code>: Uniquely identifies each catalog item.</li>
      <li><code>orders.id</code>: Uniquely identifies each purchase transaction.</li>
      <li><code>coupons.code</code>: Uniquely identifies promotional campaigns.</li>
    </ul>
  </li>
  <li><strong>Foreign Keys (FK) &amp; Snapshot Pattern:</strong>
    <ul>
      <li><code>orders.userId</code> &rarr; references <code>users.uid</code>. Connects orders to customer account profiles.</li>
      <li><code>orders.items[i].menuItemId</code> &rarr; references <code>menu_items.id</code>.</li>
      <li><strong>Point-in-Time Snapshot Pattern:</strong> The items array in each order freezes the item name, unit price, and addons at the exact moment of checkout. Any subsequent price increases or deletions of a menu item in the catalog will never alter previous historical orders or customer invoices.</li>
    </ul>
  </li>
</ul>

<div class="page-break"></div>

<!-- SECTION 4: ER DIAGRAM -->
<h2><span class="num-badge">4</span> ER DIAGRAM (Entity Relationship Diagram)</h2>

<pre class="diagram">
  +--------------------------------+                  +--------------------------------+
  |             USER               |                  |             COUPON             |
  +--------------------------------+                  +--------------------------------+
  | PK  uid                        |                  | PK  code                       |
  |     name                       |                  |     discountType               |
  |     email (Unique)             |                  |     discountValue              |
  |     phone                      |                  |     minOrderValue              |
  |     role                       |                  |     validUntil                 |
  |     addresses[]                |                  |     isActive                   |
  +--------------------------------+                  +--------------------------------+
                | 1                                                   | 0..1
                |                                                     |
                | places                                              | applied to
                | M                                                   | M
                v                                                     v
  +------------------------------------------------------------------------------------+
  |                                      ORDER                                         |
  +------------------------------------------------------------------------------------+
  | PK  id                                                                             |
  |     orderNumber (Unique)                                                           |
  | FK  userId ---------------------------> (Points to USER.uid or 'guest')             |
  |     customerName, customerPhone, customerAddress                                   |
  |     subtotal, taxes (5% GST), deliveryFee, discount, grandTotal                    |
  |     paymentMethod, paymentStatus, paymentId                                        |
  |     status ['placed', 'preparing', 'out_for_delivery', 'delivered']                |
  |     placedAt, estimatedDeliveryAt, deliveredAt                                     |
  |                                                                                    |
  |     * Embedded Point-in-Time Snapshot Items Array:                                 |
  |       - items: [                                                                   |
  |           { menuItemId, name, price, qty, selectedAddons[], itemTotal }            |
  |         ]                                                                          |
  +------------------------------------------------------------------------------------+
                | M
                |
                | references catalog
                | 1
                v
  +--------------------------------+
  |           MENU_ITEM            |
  +--------------------------------+
  | PK  id                         |
  |     name                       |
  |     category                   |
  |     price                      |
  |     inStock                    |
  |     isVegetarian               |
  |     prepTimeMinutes            |
  |     addons[]                   |
  +--------------------------------+
</pre>

<p><strong>Cardinality &amp; Relationship Explanation:</strong></p>
<ul>
  <li><strong>USER &rarr; ORDER (1 : M):</strong> One user can place zero or many orders over time. Each order is linked to exactly one user account (or identified as a guest transaction).</li>
  <li><strong>MENU_ITEM &rarr; ORDER (1 : M):</strong> Each menu item can be purchased across multiple customer orders. An order embeds frozen item snapshots referencing the source menu item ID.</li>
  <li><strong>COUPON &rarr; ORDER (1 : M):</strong> A single promotional coupon can be applied across multiple distinct orders meeting minimum purchase criteria.</li>
</ul>

<!-- SECTION 5: DATA FLOW / SYSTEM FLOW -->
<h2><span class="num-badge">5</span> DATA FLOW / SYSTEM FLOW</h2>
<pre class="diagram">
                        CUSTOMER (Web Browser)
                                  │
                                  ▼
                 1. Browse Menu & Select Items
                                  │
                                  ▼
                 2. Customize Addons & Add to Cart
                                  │
                                  ▼
                 3. Proceed to Checkout (/checkout)
                                  │
                                  ▼
                 4. Submit Customer & Delivery Details
                                  │
                                  ▼
                    NEXT.JS SERVER (API Layer)
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
         5. Server Validation              6. Payment Processing
            - Verify items & stock            - Razorpay SDK Order Creation
            - Recalculate Subtotal,           - Cryptographic Signature Check
              5% GST & Delivery Fee
                 │                                 │
                 └────────────────┬────────────────┘
                                  │
                                  ▼
                       FIRESTORE DATABASE
                (Write Document: `orders/orderId`)
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
        7. Real-Time Kitchen Display       8. Notification Engine
            - onSnapshot listener triggers     - Nodemailer sends HTML
            - Audio chime in kitchen             invoice & tracking URL
            - Baristas prepare order           - Customer receives email
                         │
                         ▼
        9. Barista Updates Status: Preparing ──► Dispatched ──► Delivered
                         │
                         ▼
        10. Customer Live Tracker (/track-order/[id]) Reactively Updates
</pre>

<div class="page-break"></div>

<!-- SECTION 6: COMPLETE ARCHITECTURE OVERVIEW -->
<h2><span class="num-badge">6</span> COMPLETE ARCHITECTURE OVERVIEW</h2>

<pre class="diagram">
+------------------------------------------------------------------------------------+
|                               USERS / CLIENTS LAYER                                |
|                                                                                    |
|      [ Customer (Mobile/Desktop Web) ]          [ Kitchen Staff & Cafe Admin ]     |
+---------------------------+-----------------------------------+--------------------+
                            │                                   │
                            ▼                                   ▼
+------------------------------------------------------------------------------------+
|                         FRONT-END PRESENTATION LAYER                               |
|                         (Next.js 16 + React 19 + TailwindCSS)                      |
|                                                                                    |
|  - Customer Interfaces: Hero, MenuGrid, ItemModal, CartDrawer, Checkout, Tracker   |
|  - Staff Interfaces: Kitchen Kanban Board (/admin), Stock Manager, Analytics       |
|  - Client State: CartContext, AuthContext, Real-time Snapshot Subscriptions        |
+------------------------------------------------------------------------------------+
                            │
                            ▼
+------------------------------------------------------------------------------------+
|                          APPLICATION & BUSINESS LOGIC LAYER                        |
|                                                                                    |
|  - Server-Side Pricing Engine (Calculates Line Totals, 5% GST, ₹40 Delivery Fee)   |
|  - Dynamic Coupon Validator (Expiry, Minimum Order Threshold, Percentage Capping)  |
|  - Kitchen State Machine Engine (placed -> preparing -> dispatched -> delivered)   |
|  - Razorpay Payment Verification (HMAC-SHA256 Secret Verification)                |
|  - Invoicing Engine (Automated HTML Tax Invoice Dispatch via Nodemailer)          |
+------------------------------------------------------------------------------------+
                            │
              ┌─────────────┴───────────────┐
              ▼                             ▼
+------------------------------+  +--------------------------------------------------+
|    DATABASE & STORAGE LAYER  |  |           EXTERNAL THIRD-PARTY SERVICES          |
|       (Google Firebase)      |  |                                                  |
|                              |  |  • Razorpay API: Secure Payment Processing (UPI) |
|  • Firestore Collections:    |  |  • Nodemailer SMTP: Automated Email Invoicing    |
|    - `users`                 |  |  • Firebase Auth: Identity, Google OAuth & JWT   |
|    - `menu_items`            |  +--------------------------------------------------+
|    - `orders` (Live Sync)    |
|    - `coupons`               |
|    - `order_sequences`       |
|  • Cloud Storage:            |
|    - Beverage Media Assets   |
+------------------------------+
</pre>

<!-- FINAL CHECK: COMPLETE PLACE ORDER FEATURE -->
<h2><span class="num-badge">7</span> FINAL CHECK: COMPLETE "PLACE ORDER" FEATURE WALKTHROUGH</h2>

<div class="box-container">
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Architecture Layer</th>
        <th style="width: 75%;">Feature Execution for 7th Heaven Cafe</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>What does the user see?<br><em>(Front-End Design)</em></strong></td>
        <td>
          1. Customer selects a <em>Caramel Flan Latte</em> and <em>Belgian Mug Cake</em> from <code>MenuGrid</code>.<br>
          2. Selects "Oat Milk" in the <code>ItemModal</code> and clicks "Add to Cart".<br>
          3. Opens <code>CartDrawer</code>, views bill summary with GST, and applies promo coupon <code>7HFIRST</code>.<br>
          4. Clicks "Proceed to Checkout", fills delivery address, selects "Pay Online via Razorpay", and clicks "Place Order".<br>
          5. Razorpay popup opens; upon payment completion, the screen automatically routes to <code>/track-order/[orderId]</code> showing the animated 4-stage preparation stepper.
        </td>
      </tr>
      <tr>
        <td><strong>What happens on action?<br><em>(Business Logic)</em></strong></td>
        <td>
          1. API independently verifies stock availability for both items in Firestore.<br>
          2. Computes line totals and applies 10% coupon deduction.<br>
          3. Adds 5% GST and sets delivery fee to ₹0 (since subtotal &ge; ₹500).<br>
          4. Creates Razorpay order in paise; on frontend return, validates cryptographic payment signature.<br>
          5. Generates human-readable sequential ticket number (<code>7H-20260303-0042</code>).<br>
          6. Sends itemized digital invoice with order number to customer's email via Nodemailer.<br>
          7. Alerts kitchen workstation with an audio chime and puts order ticket in the "New Placed" Kanban queue.
        </td>
      </tr>
      <tr>
        <td><strong>Where is it stored?<br><em>(Database Design)</em></strong></td>
        <td>
          1. A new document is written to the <strong><code>orders</code></strong> collection containing frozen snapshot items, totals, delivery address, and initial status <code>'placed'</code>.<br>
          2. The <strong><code>order_sequences</code></strong> counter document is atomically incremented by +1.<br>
          3. The customer's saved address is optionally updated in their document under the <strong><code>users</code></strong> collection.<br>
          4. When baristas advance tickets on <code>/admin</code>, the <code>status</code> attribute in <strong><code>orders</code></strong> changes to <code>'preparing'</code>, which automatically updates the customer's live tracking screen via Firestore's <code>onSnapshot</code> channel.
        </td>
      </tr>
    </tbody>
  </table>
</div>

<div class="footer-bar">
  <span>7th Heaven Cafe &middot; Architecture Design Document &middot; Academic &amp; Engineering Specification</span>
  <span>Next.js 16 &middot; Cloud Firestore &middot; Razorpay &middot; Nodemailer &middot; Prepared for Aditya</span>
</div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, '7th_Heaven_Cafe_Architecture_Design.html');
const pdfFilePath = path.join(__dirname, '7th_Heaven_Cafe_Architecture_Design.pdf');
const artifactPdfPath = 'C:\\Users\\Aditya\\.gemini\\antigravity-ide\\brain\\9034f289-83c5-4252-bbea-817bac5f304e\\7th_Heaven_Cafe_Architecture_Design.pdf';

fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log('HTML written successfully to:', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;

console.log('Running Edge to generate PDF...');
execSync(cmd, { stdio: 'inherit' });

console.log('PDF generated at:', pdfFilePath);

try {
  fs.copyFileSync(pdfFilePath, artifactPdfPath);
  console.log('Copied to artifact path:', artifactPdfPath);
} catch (e) {
  console.error('Error copying to artifact:', e.message);
}

const stats = fs.statSync(pdfFilePath);
console.log('PDF File Size:', stats.size, 'bytes');
