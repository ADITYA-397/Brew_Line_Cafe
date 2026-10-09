import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

out_dir = r"c:\Users\Aditya\Desktop\cafe2\blackbook\figures"
os.makedirs(out_dir, exist_ok=True)

fig, ax = plt.subplots(figsize=(13, 8), dpi=300)
fig.patch.set_facecolor('#FFFFFF')
ax.set_facecolor('#FCFAF8')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')
plt.title("Figure 2.1: Brewline Cafe — System Functional Decomposition Architecture", 
          fontsize=13, fontweight='bold', color='#2E1F18', pad=18, fontfamily='serif')

def draw_block(ax, x, y, w, h, title, items=[], color="#F4ECE3", border="#8C6A53"):
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.5,rounding_size=1.2",
                                  facecolor=color, edgecolor=border, linewidth=1.4, zorder=2)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h - 3.2, title, ha='center', va='center', fontsize=9, fontweight='bold', color="#2E1F18", zorder=3)
    ax.plot([x, x + w], [y + h - 5.5, y + h - 5.5], color=border, linewidth=0.9, zorder=3)
    curr_y = y + h - 8.5
    for item in items:
        ax.text(x + 2, curr_y, item, ha='left', va='center', fontsize=7.6, color="#3B2E28", zorder=3)
        curr_y -= 3.0

# Root Node
root = patches.FancyBboxPatch((35, 87), 30, 9, boxstyle="round,pad=0.5,rounding_size=1.5",
                             facecolor="#3B2E28", edgecolor="#241A14", linewidth=1.5, zorder=3)
ax.add_patch(root)
ax.text(50, 91.5, "Brewline Cafe Platform", ha='center', va='center', fontsize=11, fontweight='bold', color="#FFFFFF", zorder=4)

# 4 Core Functional Branches
draw_block(ax, 3, 48, 22, 32, "1. Menu & Catalog", [
    "• 17 Canonical Categories",
    "• Real-time Keyword Search",
    "• Veg Only Filter Chip",
    "• Beverages & Price Filters",
    "• Floating Menu Navigator"
], "#FFF8F0", "#C08552")

draw_block(ax, 27, 48, 22, 32, "2. Cart & Pricing", [
    "• Slide-over Cart Drawer",
    "• Line-item Steppers (+/-)",
    "• 5% Statutory GST Math",
    "• ₹40 Packaging/Delivery",
    "• Auth Guard Validation"
], "#FFFDFB", "#3D405B")

draw_block(ax, 51, 48, 22, 32, "3. Checkout & Payment", [
    "• Strict 4-Field Validation",
    "• Address Synchronization",
    "• Razorpay Modal Gateway",
    "• Nodemailer HTML Invoice",
    "• 8.5\" x 11\" Invoice Modal"
], "#F9F6F0", "#81B29A")

draw_block(ax, 75, 48, 22, 32, "4. Tracking & Operations", [
    "• Real-time Stepper Sync",
    "• Countdown ETA Timer",
    "• Post-delivery Rating Card",
    "• Admin Live Kanban Queue",
    "• Instant Inventory Toggles"
], "#EFEBE4", "#8C6A53")

# Bottom Supporting Cloud Infrastructure Node
draw_block(ax, 15, 6, 70, 32, "Foundation: Google Cloud Firebase & Vercel Serverless Architecture", [
    "• Firebase Authentication: Secure Email/Password & Google OAuth Single Sign-On (Popup)",
    "• Google Cloud Firestore: Distributed multi-region NoSQL document database with active onSnapshot listeners",
    "• Firebase Cloud Storage: Media asset bucket for menu dishes and client-compressed user profile avatars",
    "• Next.js 16 Serverless API Routes: Node.js endpoints (/api/razorpay, /api/send-order-email)",
    "• Client Optimization: Lenis smooth scroll, GSAP editorial animations, Framer Motion drawer spring physics"
], "#FAF7F2", "#B57C48")

# Connecting lines from root
ax.plot([50, 50], [87, 83], color='#3B2E28', lw=1.5)
ax.plot([14, 86], [83, 83], color='#3B2E28', lw=1.5)
ax.plot([14, 14], [83, 80], color='#3B2E28', lw=1.5)
ax.plot([38, 38], [83, 80], color='#3B2E28', lw=1.5)
ax.plot([62, 62], [83, 80], color='#3B2E28', lw=1.5)
ax.plot([86, 86], [83, 80], color='#3B2E28', lw=1.5)

# Connecting to Foundation
for x_pos in [14, 38, 62, 86]:
    ax.annotate("", xy=(x_pos, 38), xytext=(x_pos, 48), arrowprops=dict(arrowstyle="->", color="#8C6A53", lw=1.2, linestyle=":"))

plt.savefig(os.path.join(out_dir, "fig2_1_functional_decomposition.png"), dpi=300, bbox_inches='tight')
plt.close()
print("Figure 2.1 generated successfully!")
