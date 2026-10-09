import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import os
from datetime import datetime, timedelta

# Create output directories
out_dir = r"c:\Users\Aditya\Desktop\cafe2\blackbook\figures"
os.makedirs(out_dir, exist_ok=True)

# Define tasks, start dates, durations (in weeks), and categories
tasks = [
    ("1. Inception & Feasibility Study", "2025-10-06", 2, "#8C6A53"),
    ("2. Domain Analysis & Stakeholder Elicitation", "2025-10-13", 2, "#8C6A53"),
    ("3. Cloud Firestore NoSQL Schema Design", "2025-10-20", 2, "#B57C48"),
    ("4. UML Modeling & System Architecture", "2025-10-27", 2, "#B57C48"),
    ("5. UI Design System & Component Library", "2025-11-03", 2, "#D4A373"),
    ("6. 17-Category Menu & Filter Grid", "2025-11-10", 2, "#D4A373"),
    ("7. Cart Context & Centralized Pricing", "2025-11-17", 2, "#E07A5F"),
    ("8. Auth & Profile with Image Compression", "2025-11-24", 2, "#E07A5F"),
    ("9. Checkout Validation & Razorpay Gateway", "2025-12-01", 2, "#3D405B"),
    ("10. Real-Time Order Tracking Stepper", "2025-12-08", 2, "#3D405B"),
    ("11. Nodemailer Email Invoicing & Modal", "2025-12-15", 2, "#81B29A"),
    ("12. Admin Dashboard & Inventory Toggles", "2025-12-22", 2, "#81B29A"),
    ("13. Integration, Unit & User Acceptance Testing", "2025-12-29", 2, "#2A9D8F"),
    ("14. Final Blackbook Documentation & Review", "2026-01-05", 2, "#264653")
]

fig, ax = plt.subplots(figsize=(13, 7.5), dpi=300)

y_positions = np.arange(len(tasks))

# Plot bars
for idx, (task_name, start_str, duration_weeks, color) in enumerate(tasks):
    start_dt = datetime.strptime(start_str, "%Y-%m-%d")
    end_dt = start_dt + timedelta(weeks=duration_weeks)
    start_num = mdates.date2num(start_dt)
    end_num = mdates.date2num(end_dt)
    duration_days = end_num - start_num
    
    # Rounded bar look
    ax.barh(idx, duration_days, left=start_num, height=0.55, align='center',
            color=color, edgecolor='none', alpha=0.92, zorder=3)
    
    # Add week duration label inside or next to bar
    ax.text(end_num + 1.2, idx, f"{duration_weeks} wks", 
            va='center', ha='left', fontsize=8.5, fontweight='bold', color='#3B2E28')

ax.set_yticks(y_positions)
ax.set_yticklabels([t[0] for t in tasks], fontsize=9.5, fontweight='bold', color='#2E1F18')
ax.invert_yaxis()  # Top-down order

# Format X-axis with dates
ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.MO, interval=2))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d, %Y'))
plt.xticks(rotation=20, ha='right', fontsize=9, fontweight='medium', color='#5C4A3E')

# Styling and Grid
ax.set_facecolor('#FCFAF8')
fig.patch.set_facecolor('#FFFFFF')

ax.grid(axis='x', color='#EAE3D9', linestyle='--', linewidth=0.8, zorder=0)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#D8CEBF')
ax.spines['bottom'].set_color('#D8CEBF')

# Title and Subtitles
plt.title("Figure 1.1: Brewline Cafe — 12-Week Agile Development Gantt Chart (Oct 2025 – Jan 2026)", 
          fontsize=12, fontweight='bold', color='#2E1F18', pad=20, fontfamily='serif')

# Legend for Phases
phases = [
    ("Inception & Elicitation", "#8C6A53"),
    ("System Modeling & Schema", "#B57C48"),
    ("Frontend Catalog & UI", "#D4A373"),
    ("Cart & Auth State", "#E07A5F"),
    ("Payments & Tracking", "#3D405B"),
    ("Invoicing & Admin", "#81B29A"),
    ("QA Testing & Blackbook", "#264653")
]

legend_patches = [plt.Rectangle((0,0),1,1, color=color, alpha=0.9) for _, color in phases]
plt.legend(legend_patches, [label for label, _ in phases], 
           loc='upper center', bbox_to_anchor=(0.5, -0.14),
           ncol=4, frameon=True, facecolor='#FDFCFB', edgecolor='#EAE3D9',
           fontsize=8.5)

plt.tight_layout()
out_path = os.path.join(out_dir, "fig1_1_gantt_chart.png")
plt.savefig(out_path, dpi=300, bbox_inches='tight')
print(f"Gantt chart successfully saved at: {out_path}")
