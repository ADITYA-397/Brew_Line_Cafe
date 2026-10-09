import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

out_dir = r"c:\Users\Aditya\Desktop\cafe2\blackbook\figures"
os.makedirs(out_dir, exist_ok=True)

def create_ui_mockup(filename, title, subtitle, header_items, main_panels):
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_facecolor('#F9F6F0')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Browser Frame Top Bar
    top_bar = patches.FancyBboxPatch((0, 92), 100, 8, boxstyle="round,pad=0,rounding_size=0.5",
                                     facecolor='#2E1F18', edgecolor='#1F140F', zorder=2)
    ax.add_patch(top_bar)
    for i, color in enumerate(['#E76F51', '#F4A261', '#2A9D8F']):
        circle = patches.Circle((3 + i*2.5, 96), 1.0, facecolor=color, zorder=3)
        ax.add_patch(circle)
    ax.text(50, 96, f"https://brewline-cafe.web.app{header_items.get('url', '/')}", 
            ha='center', va='center', fontsize=8, color='#D8CEBF', fontfamily='monospace', zorder=3)

    # Navbar
    nav = patches.Rectangle((0, 82), 100, 10, facecolor='#FFFFFF', edgecolor='#EAE3D9', zorder=2)
    ax.add_patch(nav)
    ax.text(5, 87, "Brewline.", fontsize=11, fontweight='bold', color='#2E1F18', fontfamily='serif', zorder=3)
    ax.text(14, 87, "COFFEE & PEOPLE", fontsize=6, fontweight='bold', color='#B57C48', fontfamily='sans-serif', zorder=3)

    nav_links = ["Home", "Our Story", "Menu", "Visit Us"]
    for i, nl in enumerate(nav_links):
        ax.text(35 + i*10, 87, nl, fontsize=8, color='#2E1F18' if i==header_items.get('active_nav', 0) else '#8C6A53',
                fontweight='bold' if i==header_items.get('active_nav', 0) else 'normal', zorder=3)
    
    ax.text(82, 87, "🛒 Cart", fontsize=8, fontweight='bold', color='#2E1F18', zorder=3)
    ax.text(92, 87, "👤 Account", fontsize=8, fontweight='bold', color='#B57C48', zorder=3)

    # Title area
    ax.text(50, 75, title, ha='center', fontsize=14, fontweight='bold', color='#2E1F18', fontfamily='serif')
    if subtitle:
        ax.text(50, 70, subtitle, ha='center', fontsize=8.5, color='#8C6A53', fontfamily='serif', fontstyle='italic')

    # Main Panels
    for panel in main_panels:
        rect = patches.FancyBboxPatch((panel['x'], panel['y']), panel['w'], panel['h'],
                                      boxstyle="round,pad=0.5,rounding_size=1",
                                      facecolor=panel.get('bg', '#FFFFFF'), edgecolor=panel.get('border', '#DCD3C6'),
                                      linewidth=1.2, zorder=3)
        ax.add_patch(rect)
        ax.text(panel['x'] + panel['w']/2, panel['y'] + panel['h'] - 4, panel['title'],
                ha='center', va='center', fontsize=9, fontweight='bold', color=panel.get('tcolor', '#2E1F18'), zorder=4)
        
        curr_y = panel['y'] + panel['h'] - 8
        for line in panel.get('lines', []):
            ax.text(panel['x'] + 3, curr_y, line, ha='left', va='center', fontsize=7.2, color='#3B2E28', zorder=4)
            curr_y -= 3.2

    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, filename), dpi=300, bbox_inches='tight')
    plt.close()

# Generate High-Fidelity UI Figures
create_ui_mockup(
    "fig3_10_ui_landing_page.png",
    "Coffee, Coast & Good Company.",
    "More than coffee — it's a feeling. Great brews, breathtaking views, and even better people.",
    {'url': '/', 'active_nav': 0},
    [
        {'x': 8, 'y': 15, 'w': 40, 'h': 48, 'title': "Artisanal Brand Story & Craft Roasts", 
         'lines': ["• Slow-fermented artisanal breads & sourdoughs", "• Ethically sourced single-origin Arabica beans", "• Handcrafted pour-overs & velvet cold frappes", "• Warm seaside ambiance with acoustic vibes", "• [ Explore Menu & Order Online → ]"], 'bg': '#FAF7F2', 'border': '#C08552'},
        {'x': 52, 'y': 15, 'w': 40, 'h': 48, 'title': "Today's Ritual: Coconut Latte", 
         'lines': ["• Category: Artisanal Specialty Brew", "• Double shot espresso with organic coconut milk", "• Infused with raw Madagascar vanilla bean", "• Price: ₹240.00 | Freshly Brewed Daily", "• Pure Vegetarian [🌱] & Dairy-Free [🥥]"], 'bg': '#FFFFFF', 'border': '#8C6A53'}
    ]
)

create_ui_mockup(
    "fig3_11_ui_menu_grid.png",
    "Our Artisanal Full Menu",
    "17 Canonical Categories with Instant Keyword Search & Quick Dietary Filters",
    {'url': '/menu', 'active_nav': 2},
    [
        {'x': 5, 'y': 12, 'w': 28, 'h': 52, 'title': "Category Navigation & Filters", 
         'lines': ["Categories (17 Canonical):", "• Between the Breads (Sandwiches)", "• Burgers & Veg Hot Dogs", "• Starters, Soups & Appetizers", "• Pasta & Stone-Baked Pizza", "• Hot & Cold Specialty Coffee", "• Milkshakes & Mug Cakes", "Filter Chips: [🌱 Veg Only] [☕ Beverages] [₹ <150]"], 'bg': '#FDFCF9', 'border': '#C08552'},
        {'x': 36, 'y': 12, 'w': 28, 'h': 52, 'title': "Caramel Flan Latte  🌱", 
         'lines': ["Double shot espresso with steamed velvet milk", "and house-made slow-simmered caramel sauce.", "Price: ₹240.00", "Dietary: Pure Vegetarian", "[ + Add to Cart ]  |  Qty: [ -  1  + ]"], 'bg': '#FFFFFF', 'border': '#D8CEBF'},
        {'x': 67, 'y': 12, 'w': 28, 'h': 52, 'title': "Hazelnut Cold Coffee  🌱", 
         'lines': ["Rich dark roast espresso blended with dairy cream", "and aromatic roasted hazelnut praline syrup.", "Price: ₹180.00", "Dietary: Pure Vegetarian", "[ + Add to Cart ]  |  Qty: [ -  2  + ]"], 'bg': '#FFFFFF', 'border': '#D8CEBF'}
    ]
)

create_ui_mockup(
    "fig3_12_ui_cart_drawer.png",
    "Your Warm Shopping Cart",
    "Slide-over Cart Drawer with Real-Time Dynamic Pricing & Tax Computation",
    {'url': '/#cart', 'active_nav': 2},
    [
        {'x': 10, 'y': 12, 'w': 48, 'h': 52, 'title': "Order Line Items", 
         'lines': ["1. Caramel Flan Latte 🌱", "   Unit: ₹240.00  |  Quantity: [ -  1  + ]  |  Total: ₹240.00", "2. Hazelnut Cold Coffee 🌱", "   Unit: ₹180.00  |  Quantity: [ -  2  + ]  |  Total: ₹360.00", "3. Belgian Chocolate Croissant 🥐", "   Unit: ₹200.00  |  Quantity: [ -  1  + ]  |  Total: ₹200.00", "--------------------------------------------------------", "Actions: [ Clear Entire Cart 🗑️ ]   [ + Add More Items ]"], 'bg': '#FFFFFF', 'border': '#8C6A53'},
        {'x': 62, 'y': 12, 'w': 28, 'h': 52, 'title': "Order Summary", 
         'lines': ["Subtotal:          ₹800.00", "GST Tax (5%):       ₹40.00", "Delivery & Pack:    ₹40.00", "----------------------------", "Grand Total:       ₹880.00", "", "[ PROCEED TO CHECKOUT → ]", "Secured by 256-bit SSL"], 'bg': '#F7F2EC', 'border': '#C08552'}
    ]
)

create_ui_mockup(
    "fig3_13_ui_checkout.png",
    "Order Checkout & Fulfillment",
    "Strict 4-Field Mandatory Form Validation with Razorpay Gateway Integration",
    {'url': '/checkout', 'active_nav': 2},
    [
        {'x': 8, 'y': 12, 'w': 50, 'h': 52, 'title': "Delivery & Contact Details (Mandatory)", 
         'lines': ["• Full Name:      [ Aditya Sharma               ] ✓ Valid", "• Phone Number:   [ +91 98765 43210             ] ✓ Valid", "• Email Address:  [ aditya@example.com          ] ✓ Valid", "• Delivery Addr:  [ Flat 402, Sunshine Heights  ] ✓ Valid", "Saved Addresses: [ Flat 402, Sunshine Heights ] [ Office 12B ]", "Validation Engine: Strict 4-field guard blocks payment until complete.", "Auto-Profile Sync: Address saved automatically to Firestore profile."], 'bg': '#FFFFFF', 'border': '#3D405B'},
        {'x': 62, 'y': 12, 'w': 30, 'h': 52, 'title': "Payment Breakdown", 
         'lines': ["Subtotal:        ₹800.00", "Taxes (GST 5%):   ₹40.00", "Delivery Fee:     ₹40.00", "--------------------------", "Total Payable:   ₹880.00", "", "[ PAY ₹880 (RAZORPAY) ]", "UPI • Cards • Netbanking", "Secured by Razorpay PCI-DSS"], 'bg': '#FDFCF9', 'border': '#C08552'}
    ]
)

create_ui_mockup(
    "fig3_14_ui_order_tracking.png",
    "Track Your Warm Order",
    "Real-Time 4-Stage Stepper with Live Preparation Countdown Timer",
    {'url': '/track-order/7H-20260110-0042', 'active_nav': 2},
    [
        {'x': 10, 'y': 12, 'w': 38, 'h': 52, 'title': "Live 4-Stage Status Stepper", 
         'lines': ["● 1. Order Placed        14:15  [Confirmed]", "● 2. Preparing           14:18  [Barista crafting]", "● 3. Out for Delivery    14:32  [Rider on the way!]", "○ 4. Delivered           --:--  [Pending arrival]", "", "Estimated Arrival: 18 mins remaining", "Live Sync: Updates every 30s via Cloud Firestore"], 'bg': '#FFFFFF', 'border': '#3D405B'},
        {'x': 52, 'y': 12, 'w': 38, 'h': 52, 'title': "Order Details & Delivery Destination", 
         'lines': ["Order ID: #7H-0042  |  Paid via Razorpay UPI", "Items: 1x Caramel Latte, 2x Hazelnut Cold Coffee", "Delivery Address: 42 Marine Drive, Mumbai 400005", "Recipient: Aditya Sharma (+91 98765 43210)", "Digital Tax Invoice dispatched to: aditya@example.com", "[ Print Official Tax Receipt ]  |  [ Back to Menu ]"], 'bg': '#F7F2EC', 'border': '#8C6A53'}
    ]
)

create_ui_mockup(
    "fig3_15_ui_delivered_rating.png",
    "Thank You for Choosing Brewline!",
    "Order Delivered Confirmation & Interactive 5-Star Experience Feedback Card",
    {'url': '/track-order/7H-20260110-0042', 'active_nav': 2},
    [
        {'x': 15, 'y': 12, 'w': 70, 'h': 52, 'title': "Delivery Experience Feedback Card", 
         'lines': ["Status: Order Delivered ✓  (Delivered at 14:48)", "Thank you for dining with us! We hope you loved your craft beverages.", "", "Rate Your Experience: [ ★ ★ ★ ★ ★ ] (5/5 Stars Selected)", "Feedback Review: 'The caramel latte was piping hot and perfectly balanced!'", "", "[ Submit Feedback Review ]", "Re-order CTAs: [ Order Again ☕ ]    [ Return to Home 🏠 ]"], 'bg': '#FFFFFF', 'border': '#81B29A'}
    ]
)

create_ui_mockup(
    "fig3_16_ui_admin_portal.png",
    "Brewline Administrative Portal",
    "Live Orders Queue, Real-Time Revenue Analytics, and Menu Stock Toggles",
    {'url': '/admin', 'active_nav': 3},
    [
        {'x': 5, 'y': 12, 'w': 42, 'h': 52, 'title': "Live Orders Queue & Kanban Controller", 
         'lines': ["• #0042 | Aditya S. | ₹481 | Status: [ Out for Delivery ▼ ]", "• #0041 | Sarah J.  | ₹240 | Status: [ Preparing        ▼ ]", "• #0040 | Rahul M.  | ₹880 | Status: [ Delivered        ▼ ]", "Audio Chime: Active for new incoming orders", "Filters: [ All ] [ Accepted ] [ Preparing ] [ Out for Delivery ]", "FCFS Prioritization: Chronological order sorting"], 'bg': '#FFFFFF', 'border': '#3D405B'},
        {'x': 51, 'y': 12, 'w': 44, 'h': 52, 'title': "Revenue Analytics & Menu Editor", 
         'lines': ["KPIs: Revenue: ₹48,920 | Total Orders: 142 | Pending: 3", "12-Month Sales Curve: Interactive SVG Area Chart", "Menu Catalog Inventory Editor:", "• Belgian Mug Cake: [ Available  ● ] (Toggle Stock)", "• Hazelnut Cold Coffee: [ Available  ● ]", "• French Vanilla Frappe: [ Sold Out   ○ ]", "[ + Add New Menu Item with Photo Upload ]"], 'bg': '#FFFDFB', 'border': '#C08552'}
    ]
)

create_ui_mockup(
    "fig3_17_ui_invoice_modal.png",
    "Official Digital Tax Invoice",
    "Standard 8.5\" x 11\" Letter-Size Printable Invoice with Point-in-Time Snapshot",
    {'url': '/#invoice', 'active_nav': 2},
    [
        {'x': 18, 'y': 10, 'w': 64, 'h': 56, 'title': "BREWLINE CAFE — TAX INVOICE", 
         'lines': ["Invoice No: #INV-7H-0042  |  Date: Jan 10, 2026, 14:15 IST", "Bill To: Aditya Sharma (+91 98765 43210)", "Address: 42 Marine Drive, Colaba, Mumbai 400005", "Payment: Paid via Razorpay (ID: pay_8492019482)", "-----------------------------------------------------------------", "Item Description                  Qty    Unit Price    Line Total", "1. Caramel Flan Latte              1       ₹240.00       ₹240.00", "2. Hazelnut Cold Coffee            2       ₹180.00       ₹360.00", "-----------------------------------------------------------------", "Subtotal: ₹600.00  |  GST (5%): ₹30.00  |  Delivery: ₹40.00", "GRAND TOTAL PAID: ₹670.00 (Inclusive of all taxes)", "[ 🖨️ Print Invoice ]     [ ✕ Close Modal ]"], 'bg': '#FFFFFF', 'border': '#2E1F18'}
    ]
)

print("All 8 UI screen figures (Figures 3.10 to 3.17) generated successfully in 300 DPI PNG!")
