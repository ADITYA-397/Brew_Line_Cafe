"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";
import { Plus, Minus, ArrowUp, Check, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Spoon + Knife icon matching reference image 1
const SpoonKnifeIcon = () => (
  <svg width="18" height="20" viewBox="0 0 20 22" fill="currentColor" className="shrink-0">
    {/* Spoon */}
    <path d="M5.5 1.5C4 1.5 3 3 3 5c0 2 1 3.5 2 4.2V19.5C5 20.3 5.7 21 6.5 21S8 20.3 8 19.5V9.2C9 8.5 10 7 10 5c0-2-1-3.5-2.5-3.5C6.7 1.5 6.1 1.5 5.5 1.5z" />
    {/* Knife */}
    <path d="M14 1.5c-1 0-1.8 1.2-1.8 2.5v6.5c0 .6.4 1 1 1h.3v8c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5V3c0-1.2-.5-1.5-2.5-1.5z" />
  </svg>
);

// Canonical category metadata with icons and descriptions
const CATEGORY_META = {
  "Between the Breads": {
    icon: "🥪",
    displayName: "Between the Breads",
    description: "Freshly prepared gourmet sandwiches crafted with our in-house slow-fermented artisanal breads.",
    isBeverage: false,
  },
  "Burgers": {
    icon: "🍔",
    displayName: "Burgers",
    description: "Handcrafted gourmet patties paired with seasoned golden fries.",
    isBeverage: false,
  },
  "Veg. Hot Dogs": {
    icon: "🌭",
    displayName: "Veg Hot Dogs",
    description: "Toasted brioche rolls packed with seasoned fillings and signature cafe glazes.",
    isBeverage: false,
  },
  "Veg Hot Dogs": {
    icon: "🌭",
    displayName: "Veg Hot Dogs",
    description: "Toasted brioche rolls packed with seasoned fillings and signature cafe glazes.",
    isBeverage: false,
  },
  "Starters & Appetizers": {
    icon: "🍿",
    displayName: "Starters & Appetizers",
    description: "Crispy, savory bites and golden fries perfect for sharing.",
    isBeverage: false,
  },
  "Soups": {
    icon: "🥣",
    displayName: "Soups",
    description: "Warm, comforting bowls simmered with fresh vegetables and herbs.",
    isBeverage: false,
  },
  "Pasta": {
    icon: "🍝",
    displayName: "Pasta",
    description: "Al dente pasta tossed in rich artisanal Italian and pink sauces.",
    isBeverage: false,
  },
  "Pizza": {
    icon: "🍕",
    displayName: "Pizza",
    description: "Stone-baked artisanal pizzas with bubbly mozzarella and premium toppings.",
    isBeverage: false,
  },
  "Main Course (Indo-Chinese)": {
    icon: "🍜",
    displayName: "Main Course (Indo-Chinese)",
    description: "Wok-tossed street style noodles, fried rice, and savory gravies.",
    isBeverage: false,
  },
  "Wholesome Meals & Sizzlers": {
    icon: "🥗",
    displayName: "Wholesome Meals & Sizzlers",
    description: "Hearty combo platters and smoking sizzling specialties.",
    isBeverage: false,
  },
  "Sides & Breads": {
    icon: "🍞",
    displayName: "Sides & Breads",
    description: "Crispy herb garlic baguettes and toasted Italian bruschetta.",
    isBeverage: false,
  },
  "Hot Coffee": {
    icon: "☕",
    displayName: "Hot Coffee",
    description: "Artisanal espresso brewed from freshly ground roasted coffee beans.",
    isBeverage: true,
  },
  "Cold Coffee": {
    icon: "🧊",
    displayName: "Cold Coffee",
    description: "Thick, chilled frappes and iced coffee delights blended to perfection.",
    isBeverage: true,
  },
  "Milkshakes": {
    icon: "🥤",
    displayName: "Milkshakes",
    description: "Velvety thick shakes made with real dairy ice cream and rich flavors.",
    isBeverage: true,
  },
  "Cupcake Milkshakes": {
    icon: "🧁",
    displayName: "Cupcake Milkshakes",
    description: "Whole freshly baked cupcakes blended right into decadent thick shakes.",
    isBeverage: true,
  },
  "Refreshers & Iced Teas": {
    icon: "🍹",
    displayName: "Refreshers & Iced Teas",
    description: "Crisp, chilled fruity refreshers and sparkling coolers.",
    isBeverage: true,
  },
  "Mug Cakes": {
    icon: "☕",
    displayName: "Mug Cakes",
    description: "Warm freshly baked individual sponge cakes loaded with decadent toppings.",
    isBeverage: false,
  },
  "Desserts & Bakery": {
    icon: "🍰",
    displayName: "Desserts & Bakery",
    description: "Handcrafted pastries, brownies, macarons, and bespoke celebration cakes.",
    isBeverage: false,
  },
};

const ORDERED_CATEGORY_KEYS = [
  "Between the Breads",
  "Burgers",
  "Veg. Hot Dogs",
  "Starters & Appetizers",
  "Soups",
  "Pasta",
  "Pizza",
  "Main Course (Indo-Chinese)",
  "Wholesome Meals & Sizzlers",
  "Sides & Breads",
  "Hot Coffee",
  "Cold Coffee",
  "Milkshakes",
  "Cupcake Milkshakes",
  "Refreshers & Iced Teas",
  "Mug Cakes",
  "Desserts & Bakery"
];

function getCategorySlug(categoryName) {
  return "cat-" + categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Single Menu Item Row Component matching reference image
function FullMenuItem({ item }) {
  const { cartItems, addToCart, updateQuantity, setIsAuthModalOpen } = useCart();
  const { user } = useAuth();

  const cartItem = cartItems.find(
    (ci) => (item.id && ci.id === item.id) || (item.name && ci.name === item.name)
  );
  const quantity = user && cartItem ? cartItem.qty : 0;
  const itemIdentifier = item.id || item.name;

  return (
    <div className="border-b border-[#3B2E28]/10 pb-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          {/* Veg indicator + Name */}
          <div className="flex items-start gap-2.5 min-w-0">
            <span
              className="inline-flex items-center justify-center w-4 h-4 border-[1.5px] border-emerald-600 rounded-[3px] p-[2px] shrink-0 mt-1"
              title="Pure Vegetarian"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            </span>
            <h4 className="font-heading font-semibold text-lg md:text-[19px] text-[#2E1F18] leading-snug">
              {item.name}
            </h4>
          </div>

          {/* Price + Add / Quantity stepper */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-heading font-bold text-base md:text-lg text-[#B57C48]">
              ₹{Number(item.price).toFixed(0)}
            </span>

            <div className="relative flex items-center justify-center min-w-[32px] h-8">
              <AnimatePresence mode="wait" initial={false}>
                {quantity === 0 ? (
                  <motion.button
                    key="add-btn"
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!user) {
                        setIsAuthModalOpen(true);
                        return;
                      }
                      addToCart(item);
                    }}
                    className="w-8 h-8 rounded-full bg-[#B57C48] text-white flex items-center justify-center hover:bg-[#9E6938] active:scale-90 transition-colors shadow-sm shrink-0 cursor-pointer"
                    title={`Add ${item.name} to cart`}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus size={16} strokeWidth={2.4} />
                  </motion.button>
                ) : (
                  <motion.div
                    key="qty-control"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.15 }}
                    className="h-8 px-1.5 rounded-full border border-[#B57C48]/40 bg-[#FAF7F2] flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          setIsAuthModalOpen(true);
                          return;
                        }
                        updateQuantity(itemIdentifier, -1);
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#2E1F18] hover:bg-[#3B2E28]/10 active:scale-90 transition-all cursor-pointer"
                      title={`Decrease ${item.name} quantity`}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus size={13} strokeWidth={2.4} />
                    </button>
                    <span className="min-w-[18px] text-center font-heading font-bold text-xs sm:text-sm text-[#2E1F18] select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                          setIsAuthModalOpen(true);
                          return;
                        }
                        updateQuantity(itemIdentifier, 1);
                      }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#2E1F18] hover:bg-[#3B2E28]/10 active:scale-90 transition-all cursor-pointer"
                      title={`Increase ${item.name} quantity`}
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={13} strokeWidth={2.4} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm md:text-[14.5px] text-[#6B5A4E] italic font-serif leading-relaxed mt-2.5">
          {item.description || "Freshly prepared for you with the finest ingredients."}
        </p>
      </div>
    </div>
  );
}

export default function FullMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("");
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [filterBeverages, setFilterBeverages] = useState(false);
  const [filterUnder150, setFilterUnder150] = useState(false);
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);

  const { cartItems, toggleCart } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const categoryRefs = useRef({});

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsMenuPopupOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const totalMenuItemsCount = useMemo(() => {
    return items.filter((i) => i.inStock !== false).length;
  }, [items]);

  // Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "menu"),
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setItems(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching menu items:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Organize items into categories
  const groupedMenu = useMemo(() => {
    return items.reduce((acc, item) => {
      if (item.inStock === false) return acc;

      // Apply quick filters
      if (filterUnder150 && Number(item.price) > 150) return acc;

      const cat = item.category || "Other";
      const meta = CATEGORY_META[cat];
      if (filterBeverages && (!meta || !meta.isBeverage)) return acc;

      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [items, filterUnder150, filterBeverages]);

  // Sort categories in canonical order
  const sortedCategories = useMemo(() => {
    const keys = Object.keys(groupedMenu);
    return keys.sort((a, b) => {
      const idxA = ORDERED_CATEGORY_KEYS.indexOf(a);
      const idxB = ORDERED_CATEGORY_KEYS.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [groupedMenu]);

  // Set default active category
  useEffect(() => {
    if (sortedCategories.length > 0 && !activeCategory) {
      setActiveCategory(sortedCategories[0]);
    }
  }, [sortedCategories, activeCategory]);

  // Scroll listener for active category indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      for (let i = sortedCategories.length - 1; i >= 0; i--) {
        const cat = sortedCategories[i];
        const slug = getCategorySlug(cat);
        const el = document.getElementById(slug);
        if (el && el.offsetTop <= scrollPos) {
          setActiveCategory(cat);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedCategories]);

  // Smooth scroll to category
  const scrollToCategory = (cat) => {
    setActiveCategory(cat);
    const slug = getCategorySlug(cat);
    const el = document.getElementById(slug);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFEA] text-[#2E1F18] font-serif antialiased selection:bg-[#B57C48]/20 selection:text-[#2E1F18]">
      {/* Main Container */}
      <main className="pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        
        {/* Page Top Header with Return Link and Cart Action */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between gap-4 border-b border-[#3B2E28]/10 pb-5">
            <div>
              <Link 
                href="/#menu" 
                className="text-xs uppercase tracking-widest font-heading font-semibold text-[#8C6A53] hover:text-[#2E1F18] transition-colors inline-flex items-center gap-1.5 mb-2"
              >
                ← Back to Featured
              </Link>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-[#2E1F18] tracking-tight">
                Our Full Menu
              </h1>
            </div>

            <button
              onClick={toggleCart}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#B57C48]/30 bg-white/90 text-[#3B2E28] hover:bg-[#F2ECE4] transition-colors font-heading text-xs sm:text-sm font-semibold shadow-xs cursor-pointer shrink-0"
              aria-label="Open Shopping Cart"
              title="Open Cart"
            >
              <ShoppingBag size={17} className="text-[#B57C48]" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#B57C48] text-white text-xs flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sticky Category Navigation & Filter Bar */}
        <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-12 px-4 sm:px-6 lg:px-12 py-3 bg-[#F4EFEA]/95 backdrop-blur-md border-y border-[#3B2E28]/10 shadow-xs mb-10">
          {/* Categories Pill Navigation */}
          <div className="overflow-x-auto scrollbar-none pb-2 pt-1 flex items-center gap-2 md:flex-wrap">
            {sortedCategories.map((cat) => {
              const meta = CATEGORY_META[cat] || {
                icon: "🍽️",
                displayName: cat,
              };
              const isActive = activeCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-medium whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#B57C48] text-white shadow-sm scale-[1.02]"
                      : "bg-[#EAE3D9] text-[#3B2E28] hover:bg-[#DFD6CA] border border-[#3B2E28]/10"
                  }`}
                >
                  <span className="text-sm sm:text-base">{meta.icon}</span>
                  <span>{meta.displayName || cat}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-2.5 pt-2 border-t border-[#3B2E28]/10 overflow-x-auto scrollbar-none">
            {/* Veg Only */}
            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-medium transition-all shrink-0 cursor-pointer ${
                filterVegOnly
                  ? "bg-emerald-700 text-white shadow-xs"
                  : "bg-white/80 border border-emerald-700/40 text-emerald-800 hover:bg-emerald-50"
              }`}
            >
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-[1.5px] border-current rounded-[2px] p-[1.5px]">
                <span className="w-1 h-1 rounded-full bg-current"></span>
              </span>
              <span>Veg Only</span>
              {filterVegOnly && <Check size={12} strokeWidth={2.6} />}
            </button>

            {/* Beverages */}
            <button
              onClick={() => setFilterBeverages(!filterBeverages)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-medium transition-all shrink-0 cursor-pointer ${
                filterBeverages
                  ? "bg-[#B57C48] text-white shadow-xs"
                  : "bg-white/80 border border-[#B57C48]/40 text-[#8C6A53] hover:bg-[#F2ECE4]"
              }`}
            >
              <span>Beverages</span>
              {filterBeverages && <Check size={12} strokeWidth={2.6} />}
            </button>

            {/* Under ₹150 */}
            <button
              onClick={() => setFilterUnder150(!filterUnder150)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-heading font-medium transition-all shrink-0 cursor-pointer ${
                filterUnder150
                  ? "bg-[#B57C48] text-white shadow-xs"
                  : "bg-white/80 border border-[#B57C48]/40 text-[#8C6A53] hover:bg-[#F2ECE4]"
              }`}
            >
              <span>Under ₹150</span>
              {filterUnder150 && <Check size={12} strokeWidth={2.6} />}
            </button>

            {(filterVegOnly || filterBeverages || filterUnder150) && (
              <button
                onClick={() => {
                  setFilterVegOnly(false);
                  setFilterBeverages(false);
                  setFilterUnder150(false);
                }}
                className="text-xs text-[#8C6A53] hover:text-[#2E1F18] underline ml-2 shrink-0 cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#B57C48] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedCategories.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-[#6B5A4E]">No items match the active filters.</p>
            <button
              onClick={() => {
                setFilterVegOnly(false);
                setFilterBeverages(false);
                setFilterUnder150(false);
              }}
              className="mt-4 px-5 py-2 rounded-full bg-[#B57C48] text-white text-sm font-heading font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Category Sections */
          <div className="space-y-16 md:space-y-20">
            {sortedCategories.map((category) => {
              const meta = CATEGORY_META[category] || {
                icon: "🍽️",
                displayName: category,
                description: "Freshly prepared with the finest ingredients.",
              };
              const categoryItems = groupedMenu[category] || [];
              const slug = getCategorySlug(category);

              return (
                <section
                  key={category}
                  id={slug}
                  ref={(el) => (categoryRefs.current[category] = el)}
                  className="scroll-mt-48"
                >
                  {/* Category Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl md:text-4xl">{meta.icon}</span>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-[#2E1F18] tracking-tight">
                        {meta.displayName || category}
                      </h3>
                    </div>
                    {meta.description && (
                      <p className="text-sm md:text-base italic text-[#6B5A4E] font-serif mt-1.5 max-w-2xl">
                        {meta.description}
                      </p>
                    )}
                  </div>

                  {/* Two-Column Responsive Items Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-8">
                    {categoryItems.map((item) => (
                      <FullMenuItem key={item.id || item.name} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}

        {/* Bottom Note & Back to Top */}
        <div className="mt-20 pt-8 border-t border-[#3B2E28]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#7B6C61] font-serif">
          <p className="italic text-center sm:text-left">
            Prices exclude applicable local taxes. Standard prep-time: 15 mins.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 text-[#B57C48] hover:text-[#9E6938] font-heading font-medium transition-colors cursor-pointer group"
          >
            <span>Back to top</span>
            <span className="w-6 h-6 rounded-full border border-[#B57C48]/40 flex items-center justify-center group-hover:bg-[#B57C48] group-hover:text-white transition-all">
              <ArrowUp size={13} strokeWidth={2.2} />
            </span>
          </button>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOATING MENU BUTTON & POPUP ANCHORED AT BOTTOM-RIGHT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isMenuPopupOpen && (
            <>
              {/* Invisible/Subtle Backdrop to close when clicking outside */}
              <motion.div
                key="menu-popup-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setIsMenuPopupOpen(false)}
                className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
              />

              {/* Popup Menu Panel matching Reference 2 */}
              <motion.div
                key="menu-popup-panel"
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 12 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="relative z-50 mb-3 w-[290px] sm:w-[320px] max-w-[calc(100vw-32px)] bg-[#16171B] text-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.65)] border border-white/10 font-sans overflow-hidden"
                style={{
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.08]">
                  <span className="font-semibold text-sm tracking-wide text-[#FF455B]">
                    Your Menu
                  </span>
                  <span className="font-bold text-sm text-[#FF455B]">
                    {totalMenuItemsCount}
                  </span>
                </div>

                {/* Categories List with Narrow Custom Scrollbar */}
                <div className="max-h-[360px] overflow-y-auto popup-scrollbar px-3 py-2 space-y-0.5">
                  {sortedCategories.map((cat) => {
                    const count = groupedMenu[cat]?.length || 0;
                    const isActive = activeCategory === cat;
                    const meta = CATEGORY_META[cat];
                    const displayName = meta?.displayName || cat;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setIsMenuPopupOpen(false);
                          scrollToCategory(cat);
                        }}
                        className={`w-full flex items-center justify-between py-2.5 px-3 rounded-xl text-[13.5px] sm:text-[14px] transition-colors text-left cursor-pointer group ${
                          isActive
                            ? "text-[#FF455B] font-semibold bg-white/[0.05]"
                            : "text-[#ECEEF4] hover:text-white hover:bg-white/[0.05] font-normal"
                        }`}
                      >
                        <span className="truncate pr-3">{displayName}</span>
                        <span
                          className={`text-xs shrink-0 font-medium ${
                            isActive ? "text-[#FF455B] font-bold" : "text-[#8D909B] group-hover:text-white"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom-Right Trigger: toggles between [ 🍴 Menu ] and [ ✕ Close ] */}
        <div className="relative z-50">
          {!isMenuPopupOpen ? (
            <motion.button
              key="btn-open-menu"
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuPopupOpen(true)}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#1E1F24] hover:bg-[#272931] text-white border border-white/15 shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all cursor-pointer font-sans"
              aria-label="Open Menu Navigator"
            >
              <SpoonKnifeIcon />
              <span className="font-semibold text-sm sm:text-base tracking-wide text-white">Menu</span>
            </motion.button>
          ) : (
            <motion.button
              key="btn-close-menu"
              type="button"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuPopupOpen(false)}
              className="inline-flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-[#262830] hover:bg-[#30333D] text-white border border-white/12 shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-all cursor-pointer text-xs sm:text-sm font-semibold font-sans"
              aria-label="Close Menu Navigator"
            >
              <X size={14} strokeWidth={2.5} />
              <span>Close</span>
            </motion.button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
