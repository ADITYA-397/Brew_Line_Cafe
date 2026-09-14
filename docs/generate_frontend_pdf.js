const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>7th Heaven Cafe: Front-End Design</title>
<style>
  @page {
    size: A4;
    margin: 18mm 18mm 18mm 18mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #000000;
    background-color: #FFFFFF;
    line-height: 1.45;
    font-size: 10pt;
    margin: 0;
    padding: 0;
  }
  h1 {
    font-size: 21pt;
    font-weight: bold;
    text-align: center;
    margin: 0 0 16px 0;
    color: #000000;
  }
  h2 {
    font-size: 13pt;
    font-weight: bold;
    color: #000000;
    margin-top: 18px;
    margin-bottom: 8px;
    page-break-after: avoid;
    break-after: avoid;
  }
  h3 {
    font-size: 11pt;
    font-weight: bold;
    color: #000000;
    margin-top: 14px;
    margin-bottom: 6px;
    page-break-after: avoid;
    break-after: avoid;
  }
  p {
    margin: 0 0 8px 0;
    font-size: 9.5pt;
    text-align: justify;
  }
  ol, ul {
    margin: 0 0 12px 0;
    padding-left: 22px;
  }
  li {
    margin-bottom: 6px;
    font-size: 9.5pt;
    text-align: justify;
  }
  li strong {
    font-weight: bold;
  }
  pre.wireframe {
    font-family: "Courier New", Courier, monospace;
    font-size: 8pt;
    line-height: 1.25;
    background-color: #FFFFFF;
    color: #000000;
    padding: 8px 10px;
    border: 1px solid #000000;
    margin: 6px 0 14px 0;
    white-space: pre;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  pre.flowchart {
    font-family: "Courier New", Courier, monospace;
    font-size: 8.5pt;
    line-height: 1.35;
    background-color: #FFFFFF;
    color: #000000;
    padding: 10px 14px;
    border: 1px solid #000000;
    margin: 6px 0 14px 0;
    white-space: pre;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .page-break {
    page-break-before: always;
    break-before: always;
  }
</style>
</head>
<body>

<h1>7th Heaven Cafe: Front-End Design</h1>

<p><strong>Objective:</strong> Explain and design what the user will see and interact with in the 7th Heaven Cafe web application. This document outlines all major customer and administrative user interfaces, detailed wireframes highlighting text boxes, buttons, dropdowns, tables, navigation elements, search filters, and error/success alerts, followed by comprehensive screen navigation flowcharts.</p>

<h2>1. FRONT-END DESIGN</h2>

<h3>A. User Interfaces / Screens</h3>
<p>The system incorporates 13 major screens organized into customer-facing ordering workflows and administrative kitchen operations portals:</p>

<ol>
  <li><strong>Customer Login Screen (<code>/login</code>):</strong> Allows returning customers and staff to authenticate using email/password or Google OAuth, with an option to continue as guest.</li>
  <li><strong>Customer Registration Screen (<code>/signup</code>):</strong> Registration interface capturing customer full name, email, 10-digit mobile number, password, and promotional newsletter opt-in.</li>
  <li><strong>Home / Brand Landing Page (<code>/</code>):</strong> Hero banner showcasing artisanal beverages, cafe philosophy, operating hours, and prominent "Order Now" call-to-action button.</li>
  <li><strong>Menu Catalog &amp; Category Grid:</strong> Interactive menu catalog with category filter tabs (<em>Hot Coffee, Cold Coffee, Refreshers, Milkshakes, Cupcake Milkshakes, Mug Cakes</em>), search bar, and dietary badges.</li>
  <li><strong>Item Customization Modal / Drawer:</strong> Overlay triggered on item selection allowing customization of milk type (Regular, Oat, Almond, Soy), extra espresso shots, and sweetening preferences.</li>
  <li><strong>Slide-Over Cart Drawer:</strong> Real-time persistent cart displaying selected items, unit counters (<code>[-]</code>, <code>[+]</code>), customization tags, promo coupon input box, and bill breakdown.</li>
  <li><strong>Checkout Screen (<code>/checkout</code>):</strong> Form to specify fulfillment type (Door Delivery, Dine-in, Takeaway Pickup), contact info, delivery address with landmark/pincode, payment selection (Online Razorpay vs Cash on Delivery), and place order button.</li>
  <li><strong>Live Order Tracking Screen (<code>/track-order/[orderId]</code>):</strong> Real-time animated 4-stage stepper (<em>Placed &rarr; Preparing &rarr; Out for Delivery &rarr; Delivered</em>), live preparation countdown timer, courier details, and itemized invoice modal.</li>
  <li><strong>Customer Profile &amp; Order History Drawer:</strong> User profile management showing saved delivery addresses, past order history, digital tax invoices, and 1-click reorder options.</li>
  <li><strong>Admin / Kitchen Live Operations Kanban Portal (<code>/admin</code>):</strong> Real-time Kanban board with synchronized order columns (<em>New Placed, Preparing, Dispatched, Delivered</em>), audio chime alerts, and status advance buttons.</li>
  <li><strong>Menu &amp; Inventory Management Portal:</strong> Administrative screen to add new products, edit pricing/descriptions, and toggle real-time item stock availability (<code>inStock: true/false</code>).</li>
  <li><strong>Sales Analytics &amp; Revenue Dashboard:</strong> Visual analytics displaying daily gross revenue, completed ticket volume, average order value (AOV), and top-selling beverages.</li>
  <li><strong>Coupons &amp; Promotions Management:</strong> Management screen to configure promotional coupon codes, percentage/flat discounts, minimum order requirements, and expiry dates.</li>
</ol>

<div class="page-break"></div>

<h3>B. Screen Design (Rough UI Wireframes)</h3>
<p>For all important screens in the system, the wireframes below illustrate input text boxes, buttons, dropdowns, tables, navigation headers, search bars, and alert messages.</p>

<p><strong>1. Customer Login Screen (<code>/login</code>):</strong></p>
<pre class="wireframe">
-------------------------------------------------------------------
                        7TH HEAVEN CAFE
-------------------------------------------------------------------
                      Sign In to Your Account

Email Address:    [ aditya@example.com                           ]
Password:         [ ****************                             ]

                  [          LOG IN          ]

                  [ G  Continue with Google  ]

                  [    Continue as Guest     ]

Forgot Password?                                New user? Register here
-------------------------------------------------------------------
[ Error Alert: "Invalid email or password. Please try again."     ]
-------------------------------------------------------------------
</pre>

<p><strong>2. Customer Registration Screen (<code>/signup</code>):</strong></p>
<pre class="wireframe">
-------------------------------------------------------------------
                        7TH HEAVEN CAFE
-------------------------------------------------------------------
                     Create a Customer Account

Full Name:        [ Aditya Sharma                                ]
Email Address:    [ aditya@example.com                           ]
Mobile Number:    [ 9876543210                                   ]
Password:         [ ****************                             ]
Confirm Password: [ ****************                             ]

[X] Subscribe to 7th Heaven weekly offers &amp; new blend releases

                  [        CREATE ACCOUNT        ]

Already have an account? Sign In here
-------------------------------------------------------------------
[ Success Alert: "Account created successfully! Redirecting..."   ]
-------------------------------------------------------------------
</pre>

<div class="page-break"></div>

<p><strong>3. Menu Catalog &amp; Category Filter Screen:</strong></p>
<pre class="wireframe">
+-------------------------------------------------------------------------------+
| ☕ 7TH HEAVEN CAFE          [ Home ]  [ Menu ]  [ About ]        🔍 [ Cart (2) ] 👤 |
+-------------------------------------------------------------------------------+
| Search Menu: [ Search cappuccino, frappe, latte...         ]   Filter: [ All ▼] |
| Categories:  [ All ] [ Hot Coffee ] [ Cold Coffee ] [ Shakes ] [ Mug Cakes ]   |
| Dietary:     [X] Vegetarian Only                                              |
+-------------------------------------------------------------------------------+
| +-------------------------+ +-------------------------+ +-------------------+ |
| | [ Image: Caramel Latte] | | [ Image: Hazelnut Frappe] | | [ Image: Cake]    | |
| | Caramel Flan Latte   🌱 | | Hazelnut Cold Frappe 🌱 | | Belgian Mug Cake  | |
| | Rich espresso, caramel  | | Blended ice, cold brew  | | Warm molten center| |
| | ₹240                    | | ₹280                    | | ₹190              | |
| | [ + ADD TO CART ]       | | [ + ADD TO CART ]       | | [   SOLD OUT   ]  | |
| +-------------------------+ +-------------------------+ +-------------------+ |
+-------------------------------------------------------------------------------+
</pre>

<p><strong>4. Item Customization Modal:</strong></p>
<pre class="wireframe">
-------------------------------------------------------------------
             CUSTOMIZE: CARAMEL FLAN LATTE (Base ₹240)
-------------------------------------------------------------------
1. Select Milk Preference:
   (•) Whole Dairy Milk (+₹0)
   ( ) Oat Milk (+₹30)
   ( ) Almond Milk (+₹35)
   ( ) Soy Milk (+₹25)

2. Add Extra Espresso Shot:
   [X] Add Double Shot (+₹40)

3. Sweetness Level:
   [ Normal Sweetness        ▼ ]

Special Kitchen Note:
[ Extra hot, less caramel drizzle please                         ]

-------------------------------------------------------------------
Total Item Price: ₹310
               [ CANCEL ]        [ ADD TO CART - ₹310 ]
-------------------------------------------------------------------
</pre>

<div class="page-break"></div>

<p><strong>5. Slide-Over Cart Drawer:</strong></p>
<pre class="wireframe">
+-------------------------------------------------------------------------------+
| YOUR CART (2 Items)                                                    [ ✕ ]  |
+-------------------------------------------------------------------------------+
| 1. Caramel Flan Latte                                                 ₹310.00 |
|    • Milk: Oat Milk (+₹30) | Extra Shot (+₹40)                                |
|    Qty: [-] [ 1 ] [+]                                         [ Remove ]      |
|                                                                               |
| 2. Hazelnut Cold Frappe                                               ₹280.00 |
|    • Regular Milk (+₹0)                                                       |
|    Qty: [-] [ 1 ] [+]                                         [ Remove ]      |
+-------------------------------------------------------------------------------+
| Have a Promo Coupon?                                                          |
| [ 7HFIRST                    ] [ APPLY ]                                      |
| (✓ Success: Coupon 7HFIRST applied! You saved ₹55.00)                         |
+-------------------------------------------------------------------------------+
| Item Subtotal:                                                        ₹590.00 |
| Taxes (5% GST):                                                        ₹29.50 |
| Delivery Fee:                                                           ₹0.00 |
| Coupon Discount (10%):                                                -₹55.00 |
| ----------------------------------------------------------------------------- |
| GRAND TOTAL:                                                          ₹564.50 |
|                                                                               |
|                      [ PROCEED TO CHECKOUT -> ]                               |
+-------------------------------------------------------------------------------+
</pre>

<p><strong>6. Checkout Screen (<code>/checkout</code>):</strong></p>
<pre class="wireframe">
---------------------------------------------------------------------------------
                           7TH HEAVEN CAFE — CHECKOUT
---------------------------------------------------------------------------------
1. SELECT ORDER TYPE:
   (•) Door Delivery            ( ) Dine-in / Table           ( ) Takeaway Pickup

2. CUSTOMER &amp; DELIVERY DETAILS:
   Full Name:        [ Aditya Sharma                                            ]
   Mobile Number:    [ +91 98765 43210                                          ]
   Email Address:    [ aditya@example.com                                       ]
   Delivery Address: [ Flat 402, Sunshine Heights, MG Road                      ]
   Landmark:         [ Near Metro Station Gate 2    ]   Pincode: [ 400001       ]

3. PAYMENT METHOD:
   (•) Pay Online via Razorpay (UPI, Credit/Debit Card, Netbanking)
   ( ) Cash on Delivery (COD)

4. ORDER SUMMARY:
   ------------------------------------------------------------------------------
   Item Description                               Qty    Unit Price    Total
   ------------------------------------------------------------------------------
   Caramel Flan Latte (Oat Milk, Extra Shot)       1       ₹310.00    ₹310.00
   Hazelnut Cold Frappe                            1       ₹280.00    ₹280.00
   ------------------------------------------------------------------------------
   Subtotal: ₹590.00  |  GST (5%): ₹29.50  |  Discount: -₹55.00  |  Delivery: ₹0.00
   NET PAYABLE AMOUNT: ₹564.50
   ------------------------------------------------------------------------------
   [ PLACE ORDER &amp; PAY ₹564.50 ]
---------------------------------------------------------------------------------
[ Error Alert (if triggered): "Please enter a valid 10-digit mobile number."    ]
---------------------------------------------------------------------------------
</pre>

<div class="page-break"></div>

<p><strong>7. Live Order Tracking Screen (<code>/track-order/[orderId]</code>):</strong></p>
<pre class="wireframe">
---------------------------------------------------------------------------------
                        ORDER TRACKING: #7H-20260303-0042
---------------------------------------------------------------------------------
Order Status: KITCHEN IS CURRENTLY PREPARING YOUR ORDER ☕
Estimated Delivery Time: ~18 Minutes (Target Arrival: 09:15 AM)

[ (✓) Placed ] ------> [ (●) Preparing ] ------> [ ( ) Dispatched ] ------> [ ( ) Delivered ]
   08:45 AM               In Espresso Bar           Out with Courier           Pending

Delivery Destination:
Flat 402, Sunshine Heights, MG Road, Near Metro Station Gate 2

Order Summary:
• 1x Caramel Flan Latte (Oat Milk, Extra Shot)
• 1x Hazelnut Cold Frappe
Total Paid: ₹564.50 (Paid Online via Razorpay #pay_823746)

          [ 📄 Download Tax Invoice ]          [ 📞 Call Cafe Support ]
---------------------------------------------------------------------------------
</pre>

<p><strong>8. Admin &amp; Kitchen Real-Time Kanban Board (<code>/admin</code>):</strong></p>
<pre class="wireframe">
+-------------------------------------------------------------------------------+
| 7TH HEAVEN KITCHEN DISPATCH  |  🔔 Sound: ON  | Active Tickets: 6  | 🔄 Auto-Sync|
+-------------------------------------------------------------------------------+
| [NEW PLACED (2)]      | [PREPARING (2)]       | [DISPATCHED (1)]  | [DELIVERED]|
+-----------------------+-----------------------+-------------------+------------+
| Order #7H-0043        | Order #7H-0042        | Order #7H-0040    | Order #0039|
| Type: Delivery (COD)  | Type: Delivery (PAID) | Type: Delivery    | Completed  |
| Customer: Priya M.    | Customer: Aditya S.   | Courier: Sunil K. | ₹680 (COD) |
| Items:                | Items:                | ETA: 6 mins       |            |
| - 2x Belgian Mug Cake | - 1x Caramel Latte    | ----------------- | [Archived] |
| - 1x Americano        | - 1x Hazelnut Frappe  | [Mark Delivered]  |            |
| Total: ₹480           | Total: ₹564.50        |                   |            |
| --------------------- | --------------------- |                   |            |
| [ACCEPT & PREPARE ->] | [DISPATCH ORDER ->]   |                   |            |
+-----------------------+-----------------------+-------------------+------------+
</pre>

<p><strong>9. Admin Menu &amp; Inventory Management Portal:</strong></p>
<pre class="wireframe">
---------------------------------------------------------------------------------
                        MENU &amp; INVENTORY MANAGEMENT
---------------------------------------------------------------------------------
[ + Add New Menu Item ]                                Search: [ Latte         ]

Item Catalog Table:
---------------------------------------------------------------------------------
ID     Item Name            Category      Price    In Stock?       Actions
---------------------------------------------------------------------------------
M101   Caramel Flan Latte   Hot Coffee    ₹240     [ ON  / off ]   [Edit] [Delete]
M102   Hazelnut Cold Frappe Cold Coffee   ₹280     [ ON  / off ]   [Edit] [Delete]
M103   Belgian Mug Cake     Mug Cakes     ₹190     [ on /  OFF ]   [Edit] [Delete]
M104   Berry Refresher      Refreshers    ₹220     [ ON  / off ]   [Edit] [Delete]
---------------------------------------------------------------------------------
[ Success Alert: "Belgian Mug Cake marked as OUT OF STOCK on customer menu."     ]
---------------------------------------------------------------------------------
</pre>

<div class="page-break"></div>

<h3>C. Navigation Flow</h3>
<p>The navigation flowcharts illustrate the sequential paths users traverse between screens across customer ordering, account profile management, and administrative kitchen workflows.</p>

<p><strong>1. Customer Ordering &amp; Tracking Navigation Flowchart:</strong></p>
<pre class="flowchart">
                   Home / Landing Page
                           ↓
                   Menu Catalog Grid
                           ↓
                Item Customization Modal
                           ↓
                      Cart Drawer
                           ↓
                    Checkout Screen
                           ↓
                Select Payment Method:
                  ├── Online (Razorpay) ──► Payment Verification ──┐
                  └── Cash on Delivery ───────────────────────────┼──► Order Placed
                                                                  │
                                                                  ↓
                                                         Live Order Tracking
                                                                  ↓
                                                         Digital Tax Invoice
</pre>

<p><strong>2. Customer Account &amp; Reordering Navigation Flowchart:</strong></p>
<pre class="flowchart">
                Login / Registration Screen
                           ↓
                    Profile Drawer
                     ├── Saved Delivery Addresses
                     └── Order History Archive
                                ↓
                        Click [ Reorder ]
                                ↓
                           Cart Drawer
                                ↓
                         Checkout Screen
</pre>

<p><strong>3. Staff / Kitchen Management Navigation Flowchart:</strong></p>
<pre class="flowchart">
                   Admin Login Screen
                           ↓
             Kitchen Kanban Dispatch Board (/admin)
              ├── [ Accept & Prepare ]  ──► Status: Preparing
              ├── [ Dispatch Order ]    ──► Status: Out for Delivery
              └── [ Confirm Delivered ] ──► Status: Delivered
                           ↓
             Menu & Inventory Stock Portal
                           ↓
            Toggle [ In-Stock / Out-of-Stock ]
                           ↓
          Instant Real-Time Update on Menu Grid
</pre>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, '7th_Heaven_Cafe_FrontEnd_Design.html');
const pdfFilePath = path.join(__dirname, '7th_Heaven_Cafe_FrontEnd_Design.pdf');
const artifactPdfPath = 'C:\\Users\\Aditya\\.gemini\\antigravity-ide\\brain\\9034f289-83c5-4252-bbea-817bac5f304e\\7th_Heaven_Cafe_FrontEnd_Design.pdf';

fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log('HTML written successfully to:', htmlFilePath);

const fileUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');
const cmd = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${fileUrl}"`;

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
