import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

out_dir = r"c:\Users\Aditya\Desktop\cafe2\blackbook\figures"
os.makedirs(out_dir, exist_ok=True)

def setup_canvas(title, figsize=(12, 7.5)):
    fig, ax = plt.subplots(figsize=figsize, dpi=300)
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#FCFAF8')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    plt.title(title, fontsize=13, fontweight='bold', color='#2E1F18', pad=18, fontfamily='serif')
    return fig, ax

def draw_box(ax, x, y, w, h, title, items=[], color="#F4ECE3", border="#8C6A53", title_color="#2E1F18"):
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5,rounding_size=1.5",
                                  facecolor=color, edgecolor=border, linewidth=1.5, zorder=2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h - 3.5, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color=title_color, zorder=3)
    ax.plot([x, x + w], [y + h - 6, y + h - 6], color=border, linewidth=1, zorder=3)
    
    curr_y = y + h - 9.5
    for item in items:
        ax.text(x + 2.5, curr_y, item, ha='left', va='center', fontsize=7.8, fontfamily='monospace', color='#3B2E28', zorder=3)
        curr_y -= 3.2

# -------------------------------------------------------------
# FIG 2: CLOUD FIRESTORE ER SCHEMA DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.1: Cloud Firestore Entity-Relationship (ER) Schema Diagram", (13, 8))

# Draw Entity Boxes
draw_box(ax, 5, 55, 26, 38, "User Collection", [
    "+ uid: String [PK / Auth UID]",
    "+ name: String",
    "+ email: String [Unique]",
    "+ phone: String",
    "+ role: 'admin' | 'user'",
    "+ addresses: Array<String>",
    "+ photo: String [Storage URL]",
    "+ newsletter: Boolean",
    "+ createdAt: Timestamp"
], "#FFF8F0", "#C08552")

draw_box(ax, 38, 50, 28, 44, "Order Collection", [
    "+ id: String [PK]",
    "+ userId: String [FK -> User]",
    "+ customerName: String",
    "+ customerEmail: String",
    "+ customerPhone: String",
    "+ customerAddress: String",
    "+ items: Array<OrderItemSnapshot>",
    "+ subtotal: Number",
    "+ taxes: Number [5% GST]",
    "+ deliveryFee: Number [₹40]",
    "+ grandTotal: Number",
    "+ status: OrderStatusEnum",
    "+ paymentMethod: String",
    "+ estimatedDeliveryAt: Timestamp"
], "#FFFDFB", "#3D405B")

draw_box(ax, 72, 55, 24, 38, "MenuItem Collection", [
    "+ id: String [PK]",
    "+ name: String",
    "+ category: String",
    "+ price: Number [INR]",
    "+ description: String",
    "+ image: String [Storage URL]",
    "+ inStock: Boolean [Toggle]",
    "+ createdAt: Timestamp"
], "#F9F6F0", "#81B29A")

draw_box(ax, 40, 6, 24, 34, "OrderItemSnapshot", [
    "« Embedded Historical Object »",
    "+ menuItemId: String [FK Ref]",
    "+ name: String [Snapshot]",
    "+ price: Number [Snapshot]",
    "+ qty: Number"
], "#F4ECE3", "#B57C48")

draw_box(ax, 74, 12, 21, 24, "Counter Collection", [
    "+ _id: 'order_counter'",
    "+ seq: Number [Atomic]",
    "+ updatedAt: Timestamp"
], "#EFEBE4", "#8C6A53")

# Relationships
ax.annotate("", xy=(38, 72), xytext=(31, 72), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=2))
ax.text(34.5, 74, "1 : N", ha='center', fontsize=8.5, fontweight='bold', color="#3D405B")

ax.annotate("", xy=(52, 50), xytext=(52, 40), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=2, linestyle="--"))
ax.text(54, 45, "Embeds", ha='left', fontsize=8, fontweight='bold', color="#3D405B")

ax.annotate("", xy=(64, 23), xytext=(72, 55), arrowprops=dict(arrowstyle="->", color="#81B29A", lw=1.5, linestyle=":"))
ax.text(68, 38, "Historical\nSnapshot", ha='center', fontsize=7.5, color="#81B29A")

plt.savefig(os.path.join(out_dir, "fig3_1_er_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 3: USE CASE DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.2: Brewline Cafe System Use Case Diagram", (13, 8.5))

# Boundary
rect = patches.FancyBboxPatch((22, 5), 56, 90, boxstyle="round,pad=1,rounding_size=2",
                              facecolor="#FFFFFF", edgecolor="#3B2E28", linewidth=1.8, zorder=1)
ax.add_patch(rect)
ax.text(50, 92, "Brewline Cafe Application Boundary", ha='center', fontsize=11, fontweight='bold', color="#2E1F18")

def draw_actor(ax, x, y, name):
    ax.plot([x, x], [y-2, y+2], color='#3B2E28', lw=2.5, zorder=4) # spine
    circle = patches.Circle((x, y+3.5), 1.8, facecolor='#FFFFFF', edgecolor='#3B2E28', lw=2, zorder=4)
    ax.add_patch(circle) # head
    ax.plot([x-2.5, x+2.5], [y, y], color='#3B2E28', lw=2.5, zorder=4) # arms
    ax.plot([x, x-2], [y-2, y-5], color='#3B2E28', lw=2.5, zorder=4) # leg 1
    ax.plot([x, x+2], [y-2, y-5], color='#3B2E28', lw=2.5, zorder=4) # leg 2
    ax.text(x, y-7.5, name, ha='center', fontsize=8.5, fontweight='bold', color='#2E1F18')

draw_actor(ax, 10, 75, "Customer")
draw_actor(ax, 10, 28, "Guest User")
draw_actor(ax, 90, 75, "Administrator")
draw_actor(ax, 90, 30, "Kitchen Barista")

def draw_use_case(ax, x, y, w, h, text):
    ellipse = patches.Ellipse((x, y), w, h, facecolor="#F7F2EC", edgecolor="#C08552", lw=1.5, zorder=3)
    ax.add_patch(ellipse)
    ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='medium', color="#2E2620", zorder=4)

use_cases = [
    (36, 85, 20, 6, "Browse 17-Category Menu"),
    (64, 85, 20, 6, "Live Dietary & Price Filter"),
    (36, 73, 20, 6, "Manage Slide-Over Cart"),
    (64, 73, 20, 6, "Authenticate (Email/Google)"),
    (50, 61, 22, 6.5, "Checkout with Mandatory Details"),
    (50, 49, 22, 6.5, "Process Payment (Razorpay)"),
    (36, 37, 20, 6, "Real-Time 4-Stage Stepper"),
    (64, 37, 20, 6, "Receive Digital HTML Invoice"),
    (36, 25, 20, 6, "Submit 5-Star Rating & Review"),
    (64, 25, 20, 6, "Live Orders Status Advance"),
    (50, 13, 22, 6.5, "Manage Inventory & Stock Toggles")
]

for uc in use_cases:
    draw_use_case(ax, uc[0], uc[1], uc[2], uc[3], uc[4])

# Connecting lines
lines = [
    ((10, 75), (26, 85)), ((10, 75), (26, 73)), ((10, 75), (39, 61)), ((10, 75), (26, 37)),
    ((10, 28), (26, 85)), ((10, 28), (26, 73)), ((10, 28), (39, 61)),
    ((90, 75), (61, 61)), ((90, 75), (74, 25)), ((90, 75), (61, 13)),
    ((90, 30), (74, 25)), ((90, 30), (46, 37))
]
for pt1, pt2 in lines:
    ax.plot([pt1[0], pt2[0]], [pt1[1], pt2[1]], color='#8A7D6E', lw=1, linestyle='-', zorder=2)

plt.savefig(os.path.join(out_dir, "fig3_2_use_case_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 4: ACTIVITY DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.3: Customer Checkout and Order Fulfillment Activity Diagram", (13, 8))

# Swimlanes
ax.plot([33, 33], [5, 95], color='#D8CEBF', lw=1.5, linestyle='--')
ax.plot([66, 66], [5, 95], color='#D8CEBF', lw=1.5, linestyle='--')
ax.text(16, 96, "Customer Swimlane", ha='center', fontsize=10, fontweight='bold', color="#2E1F18")
ax.text(50, 96, "Brewline Web Server & Razorpay", ha='center', fontsize=10, fontweight='bold', color="#2E1F18")
ax.text(83, 96, "Kitchen Barista & Delivery", ha='center', fontsize=10, fontweight='bold', color="#2E1F18")

# Nodes
def draw_act(ax, x, y, text, w=22, h=7):
    rect = patches.FancyBboxPatch((x-w/2, y-h/2), w, h, boxstyle="round,pad=0.5,rounding_size=1",
                                  facecolor="#F7F2EC", edgecolor="#C08552", lw=1.4, zorder=3)
    ax.add_patch(rect)
    ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='medium', color="#2E1F18", zorder=4)

# Start node
start = patches.Circle((16, 88), 1.6, facecolor='#2E1F18', zorder=4)
ax.add_patch(start)

draw_act(ax, 16, 78, "Add Items to Cart\n& Open Drawer")
draw_act(ax, 16, 65, "Fill Name, Phone,\nEmail & Address")
draw_act(ax, 16, 52, "Validate Form Details\n& Select Razorpay")

draw_act(ax, 50, 52, "Create Razorpay Order\nvia Serverless API")
draw_act(ax, 50, 39, "Verify Signature &\nWrite Order to Firestore")
draw_act(ax, 50, 26, "Dispatch HTML Tax\nInvoice via Nodemailer")

draw_act(ax, 16, 26, "Redirect to Live Tracker\nwith Countdown ETA")

draw_act(ax, 83, 39, "Audio Chime & Advance\nStatus: Preparing")
draw_act(ax, 83, 26, "Handover to Courier:\nOut for Delivery")
draw_act(ax, 83, 13, "Delivery Confirmed:\nOrder Delivered")

draw_act(ax, 16, 13, "Submit 5-Star Rating\n& Review Feedback")

# End node
end_out = patches.Circle((16, 4), 2.0, facecolor='none', edgecolor='#2E1F18', lw=1.5, zorder=4)
end_in = patches.Circle((16, 4), 1.2, facecolor='#2E1F18', zorder=4)
ax.add_patch(end_out)
ax.add_patch(end_in)

# Connecting arrows
act_arrows = [
    ((16, 86.4), (16, 81.5)),
    ((16, 74.5), (16, 68.5)),
    ((16, 61.5), (16, 55.5)),
    ((27, 52), (39, 52)),
    ((50, 48.5), (50, 42.5)),
    ((50, 35.5), (50, 29.5)),
    ((39, 26), (27, 26)),
    ((61, 39), (72, 39)),
    ((83, 35.5), (83, 29.5)),
    ((83, 22.5), (83, 16.5)),
    ((72, 13), (27, 13)),
    ((16, 9.5), (16, 6))
]
for p1, p2 in act_arrows:
    ax.annotate("", xy=p2, xytext=p1, arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.5))

plt.savefig(os.path.join(out_dir, "fig3_3_activity_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 5: CLASS DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.4: System Structural Class Diagram", (13, 8))

draw_box(ax, 4, 52, 28, 42, "AuthContext", [
    "+ user: FirebaseUser",
    "+ profile: UserProfile",
    "+ loading: Boolean",
    "+ login(email, pwd)",
    "+ signup(email, pwd)",
    "+ loginWithGoogle()",
    "+ logout()",
    "+ updateProfile(updates)"
], "#FFF8F0", "#C08552")

draw_box(ax, 36, 52, 28, 42, "CartContext", [
    "+ cartItems: CartItem[]",
    "+ isCartOpen: Boolean",
    "+ addToCart(item)",
    "+ updateQuantity(id, delta)",
    "+ removeFromCart(id)",
    "+ clearCart()",
    "+ toggleCart()"
], "#FFFDFB", "#3D405B")

draw_box(ax, 68, 52, 28, 42, "PricingEngine", [
    "+ DEFAULT_DELIVERY_FEE = 40",
    "+ GST_RATE = 0.05",
    "+ calculateOrderTotals(",
    "    items, deliveryFee",
    "  ): OrderTotals",
    "+ formatCurrency(amount)"
], "#F9F6F0", "#81B29A")

draw_box(ax, 20, 6, 28, 38, "OrderController", [
    "+ onSnapshotOrder(orderId)",
    "+ createOrder(orderPayload)",
    "+ updateStatus(id, status)",
    "+ submitRating(id, rating, rev)",
    "+ deleteOrder(id)"
], "#F4ECE3", "#B57C48")

draw_box(ax, 54, 6, 28, 38, "MenuController", [
    "+ menu: MenuItem[]",
    "+ addMenuItem(newItem, file)",
    "+ toggleStock(item)",
    "+ deleteMenuItem(id, name)",
    "+ filterByCategory(cat)"
], "#EFEBE4", "#8C6A53")

# Associations
ax.plot([32, 36], [73, 73], color='#3D405B', lw=1.5)
ax.plot([64, 68], [73, 73], color='#3D405B', lw=1.5)
ax.plot([34, 34], [52, 44], color='#3D405B', lw=1.5)
ax.plot([68, 68], [52, 44], color='#3D405B', lw=1.5)

plt.savefig(os.path.join(out_dir, "fig3_4_class_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 6: OBJECT DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.5: Runtime Active Order Object Instance Diagram", (13, 8))

draw_box(ax, 6, 54, 38, 38, "currentUser : User", [
    "uid = 'usr_9481ad72'",
    "name = 'Aditya Sharma'",
    "email = 'aditya@example.com'",
    "phone = '+91 98765 43210'",
    "role = 'customer'",
    "address = '42 Marine Drive, Mumbai'"
], "#FFF8F0", "#C08552")

draw_box(ax, 56, 54, 38, 38, "activeOrder : Order", [
    "id = '7H-20260110-0042'",
    "userId = 'usr_9481ad72'",
    "subtotal = ₹420.00",
    "taxes = ₹21.00 [5% GST]",
    "deliveryFee = ₹40.00",
    "grandTotal = ₹481.00",
    "status = 'Out for Delivery'",
    "estimatedDeliveryAt = '2026-01-10T14:45:00Z'"
], "#FFFDFB", "#3D405B")

draw_box(ax, 10, 8, 36, 32, "item1 : OrderItemSnapshot", [
    "menuItemId = 'item_cappuccino_01'",
    "name = 'Artisanal Cappuccino'",
    "price = ₹220.00",
    "qty = 1"
], "#F4ECE3", "#B57C48")

draw_box(ax, 54, 8, 36, 32, "item2 : OrderItemSnapshot", [
    "menuItemId = 'item_croissant_04'",
    "name = 'Belgian Chocolate Croissant'",
    "price = ₹200.00",
    "qty = 1"
], "#F4ECE3", "#B57C48")

# Links
ax.plot([44, 56], [73, 73], color='#3D405B', lw=2)
ax.text(50, 75, "places", ha='center', fontsize=8.5, fontweight='bold', color="#3D405B")

ax.plot([62, 28], [54, 40], color='#8C6A53', lw=1.5, linestyle="--")
ax.plot([74, 72], [54, 40], color='#8C6A53', lw=1.5, linestyle="--")

plt.savefig(os.path.join(out_dir, "fig3_5_object_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 7: SEQUENCE DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.6: Real-Time Order Placement and Notification Sequence Diagram", (13, 8))

cols = [12, 31, 50, 69, 88]
labels = ["Customer View\n(Browser)", "Next.js App\n(Client)", "Serverless Route\n(/api/razorpay)", "Cloud Firestore\n(NoSQL DB)", "Nodemailer SMTP\n(Mail Server)"]

for i, col in enumerate(cols):
    ax.text(col, 92, labels[i], ha='center', va='center', fontsize=8.5, fontweight='bold', color="#2E1F18")
    ax.plot([col, col], [8, 86], color='#D8CEBF', lw=1.2, linestyle='--')

seq_steps = [
    (0, 1, 80, "1. Click 'Proceed to Pay' [Validated Form]"),
    (1, 2, 72, "2. POST /api/razorpay { amount: ₹481 }"),
    (2, 1, 64, "3. Return { orderId, keyId }"),
    (1, 0, 56, "4. Open Razorpay Checkout Modal"),
    (0, 1, 48, "5. Payment Authorized (Payment ID: rzp_104)"),
    (1, 3, 40, "6. addDoc('orders', orderSnapshot)"),
    (3, 1, 32, "7. Return Order ID (7H-0042)"),
    (1, 4, 24, "8. POST /api/send-order-email { orderDetails }"),
    (1, 0, 16, "9. Redirect to /track-order/7H-0042")
]

for src, dst, y, text in seq_steps:
    x1 = cols[src]
    x2 = cols[dst]
    ax.annotate("", xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#C08552" if "Payment" in text else "#3D405B", lw=1.5))
    ax.text((x1 + x2)/2, y + 2, text, ha='center', va='bottom', fontsize=7.5, fontweight='medium', color="#2E1F18")

plt.savefig(os.path.join(out_dir, "fig3_6_sequence_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 8: STATE CHART DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.7: Order Lifecycle State Machine Transition Diagram", (13, 7.5))

def draw_state(ax, x, y, name, w=22, h=9):
    rect = patches.FancyBboxPatch((x-w/2, y-h/2), w, h, boxstyle="round,pad=0.5,rounding_size=1.5",
                                  facecolor="#F7F2EC", edgecolor="#C08552", lw=1.8, zorder=3)
    ax.add_patch(rect)
    ax.text(x, y, name, ha='center', va='center', fontsize=9, fontweight='bold', color="#2E1F18", zorder=4)

start = patches.Circle((10, 50), 2.2, facecolor='#2E1F18', zorder=4)
ax.add_patch(start)

draw_state(ax, 28, 50, "Placed / Accepted\n[placedAt]")
draw_state(ax, 52, 50, "Preparing\n[preparingAt]")
draw_state(ax, 76, 50, "Out for Delivery\n[outForDeliveryAt]")
draw_state(ax, 76, 20, "Delivered\n[deliveredAt]")

end_out = patches.Circle((52, 20), 2.6, facecolor='none', edgecolor='#2E1F18', lw=1.6, zorder=4)
end_in = patches.Circle((52, 20), 1.6, facecolor='#2E1F18', zorder=4)
ax.add_patch(end_out)
ax.add_patch(end_in)

# Transitions
ax.annotate("", xy=(17, 50), xytext=(12.2, 50), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.8))
ax.annotate("", xy=(41, 50), xytext=(39, 50), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.8))
ax.text(40, 53, "Kitchen Accepts", ha='center', fontsize=7.5, color="#3D405B", fontweight='bold')

ax.annotate("", xy=(65, 50), xytext=(63, 50), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.8))
ax.text(64, 53, "Handover to Courier", ha='center', fontsize=7.5, color="#3D405B", fontweight='bold')

ax.annotate("", xy=(76, 25), xytext=(76, 45.5), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.8))
ax.text(82, 35, "Customer\nReceives Order", ha='left', fontsize=7.5, color="#3D405B", fontweight='bold')

ax.annotate("", xy=(55, 20), xytext=(65, 20), arrowprops=dict(arrowstyle="->", color="#3D405B", lw=1.8))
ax.text(60, 23, "Rated & Closed", ha='center', fontsize=7.5, color="#3D405B", fontweight='bold')

plt.savefig(os.path.join(out_dir, "fig3_7_state_chart_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 9: COMPONENT DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.8: Next.js and Firebase Subsystem Component Diagram", (13, 8))

draw_box(ax, 5, 50, 42, 42, "Customer Presentation Tier (React 19)", [
    "« Component » Navbar & Hero Section",
    "« Component » MenuGrid (17 Categories & Search)",
    "« Component » CartDrawer & Centralized Pricing",
    "« Component » CheckoutForm & Validation",
    "« Component » LiveStepper & Countdown ETA",
    "« Component » InvoiceModal & ProfileDrawer"
], "#FFF8F0", "#C08552")

draw_box(ax, 53, 50, 42, 42, "Administrative Operations Tier", [
    "« Component » AdminDashboard & Live Sync",
    "« Component » OrdersQueue & Kanban Stepper",
    "« Component » MenuInventoryEditor & StockToggle",
    "« Component » SalesAnalytics SVG Area Chart",
    "« Component » NotificationAudioChime"
], "#FFFDFB", "#3D405B")

draw_box(ax, 5, 6, 42, 36, "Next.js App Router API Routes", [
    "« Route » POST /api/razorpay",
    "« Route » POST /api/send-order-email",
    "« Context » AuthContext (Firebase Auth)",
    "« Context » CartContext (LocalStorage Sync)"
], "#F9F6F0", "#81B29A")

draw_box(ax, 53, 6, 42, 36, "Cloud Services & Database Tier", [
    "« Cloud NoSQL » Google Cloud Firestore",
    "« Cloud Storage » Firebase Media Bucket",
    "« Payment Gateway » Razorpay Gateway API",
    "« SMTP Mailer » Nodemailer (Gmail / Ethereal)"
], "#EFEBE4", "#8C6A53")

# Connectors
ax.annotate("", xy=(26, 42), xytext=(26, 50), arrowprops=dict(arrowstyle="<->", color="#3D405B", lw=1.8))
ax.annotate("", xy=(74, 42), xytext=(74, 50), arrowprops=dict(arrowstyle="<->", color="#3D405B", lw=1.8))
ax.annotate("", xy=(53, 24), xytext=(47, 24), arrowprops=dict(arrowstyle="<->", color="#8C6A53", lw=1.8))

plt.savefig(os.path.join(out_dir, "fig3_8_component_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

# -------------------------------------------------------------
# FIG 10: DEPLOYMENT DIAGRAM
# -------------------------------------------------------------
fig, ax = setup_canvas("Figure 3.9: Cloud-Native Serverless Physical Deployment Diagram", (13, 8))

# 3 Deployment Nodes
def draw_node(ax, x, y, w, h, title, items=[]):
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.8,rounding_size=1.5",
                                  facecolor="#FDFCFB", edgecolor="#3B2E28", linewidth=1.6, zorder=2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h - 4, f"« Node: {title} »", ha='center', fontsize=9.5, fontweight='bold', color="#2E1F18", zorder=3)
    ax.plot([x, x + w], [y + h - 7, y + h - 7], color="#8C6A53", lw=1, zorder=3)
    curr_y = y + h - 11
    for item in items:
        ax.text(x + 3, curr_y, item, ha='left', fontsize=8, fontfamily='monospace', color="#3B2E28", zorder=3)
        curr_y -= 3.8

draw_node(ax, 5, 48, 42, 44, "Client Device Tier", [
    "Operating System: Windows / macOS / Android / iOS",
    "Web Browser: Chrome v120+, Safari v17+, Firefox",
    "Protocol: HTTPS / TLS 1.3 Encryption",
    "Local Artifact: localStorage ('7h_active_orders')"
])

draw_node(ax, 53, 48, 42, 44, "Cloud Application Tier (Vercel)", [
    "Runtime: Node.js Serverless Environment",
    "Framework: Next.js 16.2.3 App Router",
    "Engine: React 19 SSR & Static Hydration",
    "API Endpoints: /api/razorpay, /api/send-order-email"
])

draw_node(ax, 5, 4, 42, 38, "Cloud Database & Storage (Google Firebase)", [
    "Database: Google Cloud Firestore (NoSQL)",
    "Authentication: Firebase Identity Service",
    "Object Storage: Firebase Cloud Storage Bucket",
    "Protocol: gRPC / WebSocket Real-Time Listeners"
])

draw_node(ax, 53, 4, 42, 38, "External Gateway & SMTP Services", [
    "Payment Gateway: Razorpay PCI-DSS Servers",
    "Mail Server: Google Gmail SMTP / Ethereal",
    "API Protocol: Secure REST JSON API Over HTTPS"
])

# Node communication links
ax.annotate("", xy=(53, 70), xytext=(47, 70), arrowprops=dict(arrowstyle="<->", color="#3D405B", lw=2))
ax.text(50, 72, "HTTPS", ha='center', fontsize=8, fontweight='bold', color="#3D405B")

ax.annotate("", xy=(74, 42), xytext=(74, 48), arrowprops=dict(arrowstyle="<->", color="#8C6A53", lw=2))
ax.text(76, 45, "REST API", ha='left', fontsize=8, fontweight='bold', color="#8C6A53")

ax.annotate("", xy=(26, 42), xytext=(26, 48), arrowprops=dict(arrowstyle="<->", color="#C08552", lw=2))
ax.text(28, 45, "WebSocket / gRPC", ha='left', fontsize=8, fontweight='bold', color="#C08552")

plt.savefig(os.path.join(out_dir, "fig3_9_deployment_diagram.png"), dpi=300, bbox_inches='tight')
plt.close()

print("All system design and UML figures (Figs 3.1 to 3.9) generated successfully in 300 DPI PNG!")
