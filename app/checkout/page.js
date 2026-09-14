"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import InvoiceModal from "../../components/InvoiceModal";
import CartDrawer from "../../components/CartDrawer";
import ProfileDrawer from "../../components/ProfileDrawer";
import { OrderConfirmationCard } from "../../components/order-confirmation-card";
import { calculateOrderTotals, DEFAULT_DELIVERY_FEE } from "../../lib/pricing";
import { AlertCircle, CheckCircle2, User, Phone, Mail, MapPin } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, setIsProfileOpen } = useCart();
  const { user, profile, updateProfile } = useAuth();

  // Form State initialized from logged in user if present, or editable empty with placeholders
  const [name, setName] = useState(profile?.name || user?.displayName || "");
  const [email, setEmail] = useState(user?.email || profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(
    profile?.addresses?.[0] || profile?.address || ""
  );

  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Order processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [orderCompleteMsg, setOrderCompleteMsg] = useState("");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Auto-fill user profile details whenever profile or user state loads
  useEffect(() => {
    if (profile) {
      if (profile.name && profile.name.trim() && profile.name.trim().toLowerCase() !== "guest") {
        setName(profile.name.trim());
      } else if (user?.displayName) {
        setName(user.displayName);
      }
      if (profile.email) {
        setEmail(profile.email.trim());
      } else if (user?.email) {
        setEmail(user.email.trim());
      }
      if (profile.phone) {
        setPhone(profile.phone.trim());
      } else if (user?.phoneNumber) {
        setPhone(user.phoneNumber.trim());
      }
      if (Array.isArray(profile.addresses) && profile.addresses.length > 0) {
        setAddress(profile.addresses[0]);
      } else if (profile.address) {
        setAddress(profile.address);
      }
    } else if (user) {
      if (user.displayName) setName(user.displayName);
      if (user.email) setEmail(user.email);
      if (user.phoneNumber) setPhone(user.phoneNumber);
    }
  }, [profile, user]);

  // Mandatory Validation Rules: User must fill Name, Phone, Email & Address to place order
  const isNameValid = Boolean(name && name.trim().length >= 2 && name.trim().toLowerCase() !== "guest");
  const isPhoneValid = Boolean(phone && phone.trim().replace(/\D/g, "").length >= 7);
  const isEmailValid = Boolean(email && email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()));
  const isAddressValid = Boolean(address && address.trim().length >= 5);

  const isFormValid = isNameValid && isPhoneValid && isEmailValid && isAddressValid;

  const missingFields = [];
  if (!isNameValid) missingFields.push("Full Name");
  if (!isPhoneValid) missingFields.push("Phone Number");
  if (!isEmailValid) missingFields.push("Email Address");
  if (!isAddressValid) missingFields.push("Delivery Address");

  // Centralized pricing calculations
  const { subtotal, taxes, deliveryFee, total } = calculateOrderTotals(cartItems);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const saveLocalOrderId = (id) => {
    try {
      const stored = JSON.parse(localStorage.getItem("7h_active_orders") || "[]");
      if (Array.isArray(stored) && !stored.includes(id)) {
        localStorage.setItem("7h_active_orders", JSON.stringify([...stored, id]));
      }
    } catch (e) {}
  };

  const handlePay = async (e) => {
    if (e) e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      alert("Your cart is empty. Please add items from the menu before checking out.");
      router.push("/#menu");
      return;
    }

    // Compulsory check: User must fill all required profile & delivery details to pay
    if (!isFormValid) {
      setShowValidationErrors(true);
      const deliverySection = document.getElementById("delivery-details-section");
      if (deliverySection) {
        deliverySection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    // Automatically sync updated details to user's profile in Firebase
    if (user && updateProfile) {
      try {
        const currentAddresses = Array.isArray(profile?.addresses)
          ? profile.addresses
          : profile?.address
          ? [profile.address]
          : [];
        const updatedAddresses = currentAddresses.includes(address.trim())
          ? currentAddresses
          : [address.trim(), ...currentAddresses];

        updateProfile({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          addresses: updatedAddresses,
        });
      } catch (syncErr) {
        console.warn("Could not sync profile:", syncErr);
      }
    }

    setIsProcessing(true);

    const now = new Date();
    const estDelivery = new Date(now.getTime() + 25 * 60 * 1000).toISOString();

    try {
      const ok = await loadRazorpay();
      if (!ok) {
        // Fallback demo order placement if offline/no Razorpay key
        const od = {
          userId: user?.uid || "guest",
          customerName: name || "Valued Customer",
          customerEmail: email || user?.email || "",
          customerAddress: address || "Dine-in / Pickup",
          customerPhone: phone || "",
          items: cartItems,
          total: subtotal,
          deliveryFee: deliveryFee,
          grandTotal: total,
          status: "placed",
          timestamp: now.toISOString(),
          placedAt: now.toISOString(),
          estimatedDeliveryAt: estDelivery,
          paymentMethod: "Online Payment",
        };
        const ref = await addDoc(collection(db, "orders"), od);
        saveLocalOrderId(ref.id);
        clearCart();
        setIsProcessing(false);
        router.push(`/track-order/${ref.id}`);
        return;
      }

      // Try Razorpay backend
      const res = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await res.json();

      if (!data.success) {
        // Fallback mock order
        const od = {
          userId: user?.uid || "guest",
          customerName: name || "Valued Customer",
          customerEmail: email || user?.email || "",
          customerAddress: address || "Dine-in / Pickup",
          customerPhone: phone || "",
          items: cartItems,
          total: subtotal,
          deliveryFee: deliveryFee,
          grandTotal: total,
          status: "placed",
          timestamp: now.toISOString(),
          placedAt: now.toISOString(),
          estimatedDeliveryAt: estDelivery,
          paymentMethod: "Online Payment",
        };
        const ref = await addDoc(collection(db, "orders"), od);
        saveLocalOrderId(ref.id);
        clearCart();
        setIsProcessing(false);
        router.push(`/track-order/${ref.id}`);
        return;
      }

      const opts = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TYpo90mJ5uVdGk",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Brewline Cafe",
        description: "Order Payment",
        order_id: data.order.id,
        prefill: {
          name: name || user?.displayName || "",
          contact: phone || "",
          email: email || user?.email || "",
        },
        handler: async (resp) => {
          const od = {
            userId: user?.uid || "guest",
            customerName: name || "Valued Customer",
            customerEmail: email || user?.email || "",
            customerAddress: address || "Dine-in / Pickup",
            customerPhone: phone || "",
            items: cartItems,
            total: subtotal,
            deliveryFee: deliveryFee,
            grandTotal: total,
            status: "placed",
            timestamp: now.toISOString(),
            placedAt: now.toISOString(),
            estimatedDeliveryAt: estDelivery,
            paymentMethod: "Paid via Razorpay",
            razorpayPaymentId: resp.razorpay_payment_id,
            razorpayOrderId: resp.razorpay_order_id,
          };
          const ref = await addDoc(collection(db, "orders"), od);
          saveLocalOrderId(ref.id);
          clearCart();
          setIsProcessing(false);

          // Send confirmation invoice email in background
          const targetEmail = email || user?.email;
          if (targetEmail) {
            fetch("/api/send-order-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderEmail: targetEmail,
                customerName: od.customerName,
                customerPhone: od.customerPhone,
                orderId: ref.id,
                subtotal: od.total,
                taxes: taxes,
                deliveryFee: deliveryFee,
                total: od.grandTotal,
                items: od.items,
                address: od.customerAddress,
                paymentMethod: "Razorpay",
                paymentId: resp.razorpay_payment_id,
              }),
            }).catch((emailErr) => console.error("Email send error:", emailErr));
          }

          // Redirect immediately to live tracking page
          router.push(`/track-order/${ref.id}`);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        theme: { color: "#C08552" },
      };

      const rzp = new window.Razorpay(opts);
      rzp.on("payment.failed", (r) => {
        alert("Payment Failed: " + (r.error?.description || "Transaction declined"));
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      // Create order as fallback
      const od = {
        userId: user?.uid || "guest",
        customerName: name || "Valued Customer",
        customerEmail: email || user?.email || "",
        customerAddress: address || "Dine-in / Pickup",
        customerPhone: phone || "",
        items: cartItems,
        total: subtotal,
        deliveryFee: deliveryFee,
        grandTotal: total,
        status: "placed",
        timestamp: now.toISOString(),
        placedAt: now.toISOString(),
        estimatedDeliveryAt: estDelivery,
        paymentMethod: "Direct Online",
      };
      const ref = await addDoc(collection(db, "orders"), od);
      saveLocalOrderId(ref.id);
      clearCart();
      setIsProcessing(false);
      router.push(`/track-order/${ref.id}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#EDE7DC",
        minHeight: "100vh",
        color: "#2E2620",
        fontFamily: "var(--font-body, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)",
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          borderBottom: "1px solid #D8CEBF",
          backgroundColor: "#EDE7DC",
          padding: "18px clamp(16px, 4vw, 64px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1160px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.45rem",
              fontWeight: 700,
              color: "#2E2620",
              textDecoration: "none",
              letterSpacing: "-0.01em",
            }}
          >
            Brewline.
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "#8A7D6E",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "8px",
              transition: "color 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#2E2620";
              e.currentTarget.style.backgroundColor = "rgba(46, 38, 32, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8A7D6E";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Menu</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          maxWidth: "1160px",
          margin: "0 auto",
          padding: "40px clamp(16px, 4vw, 64px) 80px",
          boxSizing: "border-box",
        }}
      >
        {/* Page Title Block */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.85rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: "#2E2620",
              margin: "0 0 8px 0",
              lineHeight: 1.2,
            }}
          >
            Checkout
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#8A7D6E",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Complete your details to place your warm order
          </p>
        </div>

        {/* Empty Cart Banner */}
        {cartItems.length === 0 && (
          <div
            style={{
              backgroundColor: "#F7F2EC",
              border: "1px solid #DCD3C6",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "16px", color: "#2E2620" }}>Your cart is empty</p>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#8A7D6E" }}>Add delicious artisan coffees and treats before checking out.</p>
            </div>
            <Link
              href="/#menu"
              style={{
                backgroundColor: "#C08552",
                color: "#FFFFFF",
                padding: "10px 22px",
                borderRadius: "9999px",
                fontSize: "14px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse Menu
            </Link>
          </div>
        )}

        {/* Two-Column Layout */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(28px, 4vw, 52px)",
            alignItems: "flex-start",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT COLUMN: Numbered Form Sections */}
          <div
            style={{
              flex: "1 1 540px",
              minWidth: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Delivery & Contact Details */}
            <div id="delivery-details-section">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#2E2620",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  Delivery & Contact Details
                </h2>

                {user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        backgroundColor: "#E8DFD3",
                        color: "#5C4A3E",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "9999px",
                      }}
                    >
                      <CheckCircle2 size={13} className="text-[#8C6A53]" />
                      Auto-filled from profile
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#C08552",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textDecoration: "underline",
                        padding: "4px",
                      }}
                    >
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login?redirect=/checkout"
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#C08552",
                      textDecoration: "underline",
                    }}
                  >
                    Sign in to auto-fill details
                  </Link>
                )}
              </div>

              {/* Compulsory Profile Details Reminder Banner */}
              {!isFormValid && (
                <div
                  style={{
                    backgroundColor: "#FFF8F0",
                    border: "1.5px solid #E5C3A6",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    boxShadow: "0 2px 10px rgba(192, 133, 82, 0.08)",
                  }}
                >
                  <AlertCircle size={22} className="text-[#C08552] shrink-0 mt-0.5" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 4px 0", fontSize: "14.5px", fontWeight: 700, color: "#7C4A27" }}>
                      Profile Details Required to Place Order
                    </h4>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13.5px", color: "#8A7D6E", lineHeight: 1.4 }}>
                      Please complete all required details below. Payment is locked until Name, Phone Number, Email, and Delivery Address are filled.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                      {missingFields.map((field) => (
                        <span
                          key={field}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            backgroundColor: "#FBE9DC",
                            color: "#9C4221",
                            fontSize: "12px",
                            fontWeight: 600,
                            padding: "3px 10px",
                            borderRadius: "6px",
                            border: "1px solid #F3C9AD",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#C05621" }} />
                          Missing {field}
                        </span>
                      ))}

                      {user && (
                        <button
                          type="button"
                          onClick={() => setIsProfileOpen(true)}
                          style={{
                            marginLeft: "auto",
                            background: "#C08552",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            padding: "6px 14px",
                            fontSize: "12.5px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A96F3F")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C08552")}
                        >
                          Complete in Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* NAME */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: showValidationErrors && !isNameValid ? "#C05621" : "#8A7D6E",
                        textTransform: "uppercase",
                      }}
                    >
                      NAME <span style={{ color: "#C05621" }}>*</span>
                    </label>
                    {isNameValid && (
                      <span style={{ fontSize: "11px", color: "#2E7D32", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: showValidationErrors && !isNameValid ? "2px solid #C05621" : "1px solid #DCD3C6",
                      padding: "4px 0 12px 0",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#2E2620",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {showValidationErrors && !isNameValid && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#C05621", fontWeight: 500 }}>
                      ⚠️ Full name is required to place your order
                    </p>
                  )}
                </div>

                {/* PHONE NUMBER */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: showValidationErrors && !isPhoneValid ? "#C05621" : "#8A7D6E",
                        textTransform: "uppercase",
                      }}
                    >
                      PHONE NUMBER <span style={{ color: "#C05621" }}>*</span>
                    </label>
                    {isPhoneValid && (
                      <span style={{ fontSize: "11px", color: "#2E7D32", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: showValidationErrors && !isPhoneValid ? "2px solid #C05621" : "1px solid #DCD3C6",
                      padding: "4px 0 12px 0",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#2E2620",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {showValidationErrors && !isPhoneValid && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#C05621", fontWeight: 500 }}>
                      ⚠️ Please enter a valid contact phone number (at least 7 digits)
                    </p>
                  )}
                </div>

                {/* EMAIL ADDRESS */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: showValidationErrors && !isEmailValid ? "#C05621" : "#8A7D6E",
                        textTransform: "uppercase",
                      }}
                    >
                      EMAIL ADDRESS (FOR INVOICE) <span style={{ color: "#C05621" }}>*</span>
                    </label>
                    {isEmailValid && (
                      <span style={{ fontSize: "11px", color: "#2E7D32", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah.jenkins@example.com"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: showValidationErrors && !isEmailValid ? "2px solid #C05621" : "1px solid #DCD3C6",
                      padding: "4px 0 12px 0",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#2E2620",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {showValidationErrors && !isEmailValid && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#C05621", fontWeight: 500 }}>
                      ⚠️ Please enter a valid email address to receive your order invoice
                    </p>
                  )}
                </div>

                {/* DELIVERY ADDRESS */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: showValidationErrors && !isAddressValid ? "#C05621" : "#8A7D6E",
                        textTransform: "uppercase",
                      }}
                    >
                      DELIVERY ADDRESS <span style={{ color: "#C05621" }}>*</span>
                    </label>
                    {isAddressValid && (
                      <span style={{ fontSize: "11px", color: "#2E7D32", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                        <CheckCircle2 size={12} /> Valid
                      </span>
                    )}
                  </div>

                  {/* Saved Addresses Quick Selector */}
                  {Array.isArray(profile?.addresses) && profile.addresses.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#8A7D6E", alignSelf: "center" }}>
                        Saved:
                      </span>
                      {profile.addresses.map((savedAddr, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAddress(savedAddr)}
                          style={{
                            border: address === savedAddr ? "1.5px solid #C08552" : "1px solid #DCD3C6",
                            backgroundColor: address === savedAddr ? "#F5EEE5" : "#FFFFFF",
                            color: address === savedAddr ? "#7C4A27" : "#2E2620",
                            fontSize: "12px",
                            fontWeight: address === savedAddr ? 600 : 500,
                            padding: "4px 10px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            maxWidth: "260px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            transition: "all 0.15s ease",
                          }}
                          title={savedAddr}
                        >
                          {savedAddr}
                        </button>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Flat 402, Oakwood Residency, 7th Main Road, Indiranagar, Bengaluru"
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      borderBottom: showValidationErrors && !isAddressValid ? "2px solid #C05621" : "1px solid #DCD3C6",
                      padding: "4px 0 12px 0",
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#2E2620",
                      outline: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      transition: "border-color 0.2s",
                    }}
                  />
                  {showValidationErrors && !isAddressValid && (
                    <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#C05621", fontWeight: 500 }}>
                      ⚠️ Complete delivery address is required for delivery
                    </p>
                  )}
                </div>
              </div>

              {/* Secure Payment Reassurance Note */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#8A7D6E",
                  marginTop: "32px",
                  paddingTop: "20px",
                  borderTop: "1px solid #E2D9CC",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C08552" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Guaranteed safe & secure checkout powered by Razorpay (Cards, UPI, Netbanking)</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Order Summary Card */}
          <div
            style={{
              flex: "0 0 350px",
              minWidth: "280px",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                backgroundColor: "#F7F2EC",
                borderRadius: "20px",
                padding: "28px 24px",
                border: "1px solid #DCD3C6",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                boxSizing: "border-box",
                width: "100%",
                position: "sticky",
                top: "100px",
              }}
            >
              {/* Heading */}
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: 600,
                  color: "#2E2620",
                  margin: "0 0 20px 0",
                  padding: 0,
                  lineHeight: 1.2,
                }}
              >
                Order Summary
              </h3>

              {/* Price Breakdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#8A7D6E" }}>Subtotal</span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#2E2620" }}>₹{subtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#8A7D6E" }}>Taxes (GST 5%)</span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#2E2620" }}>₹{taxes}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#8A7D6E" }}>Delivery Fee</span>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#2E2620" }}>₹{deliveryFee}</span>
                </div>
              </div>

              {/* Hairline Divider */}
              <div style={{ height: "1px", backgroundColor: "#DCD3C6", margin: "18px 0" }} />

              {/* Total Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
                <span style={{ fontSize: "17px", fontWeight: 700, color: "#2E2620" }}>Total</span>
                <span style={{ fontSize: "20px", fontWeight: 800, color: "#2E2620" }}>₹{total}</span>
              </div>

              {/* Primary Pay Button */}
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing || cartItems.length === 0}
                style={{
                  width: "100%",
                  backgroundColor:
                    cartItems.length === 0
                      ? "#C5B8A8"
                      : isProcessing
                      ? "#A96F3F"
                      : !isFormValid
                      ? "#B3A596"
                      : "#C08552",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "14px 20px",
                  fontSize: "15px",
                  fontWeight: 600,
                  cursor: isProcessing || cartItems.length === 0 ? "not-allowed" : "pointer",
                  display: "block",
                  boxSizing: "border-box",
                  minHeight: "48px",
                  boxShadow:
                    cartItems.length === 0 || !isFormValid
                      ? "none"
                      : "0 2px 8px rgba(192, 133, 82, 0.25)",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing && cartItems.length > 0 && isFormValid)
                    e.currentTarget.style.backgroundColor = "#A96F3F";
                }}
                onMouseLeave={(e) => {
                  if (!isProcessing && cartItems.length > 0 && isFormValid)
                    e.currentTarget.style.backgroundColor = "#C08552";
                }}
              >
                {cartItems.length === 0
                  ? "Cart is Empty"
                  : isProcessing
                  ? "Processing..."
                  : !isFormValid
                  ? "Fill Required Details to Pay"
                  : `Pay ₹${total}`}
              </button>

              {!isFormValid && cartItems.length > 0 && (
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "12px",
                    color: "#C05621",
                    textAlign: "center",
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  ⚠️ Name, Phone, Email & Address required before payment
                </p>
              )}

              {/* Secured by Razorpay */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  marginTop: "14px",
                  color: "#8A7D6E",
                  fontSize: "12.5px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Secured by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cart & Profile Drawer Overlays if opened */}
      <CartDrawer />
      <ProfileDrawer />

      {/* Order Confirmation Modal */}
      {orderCompleteMsg && lastOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 3000,
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <OrderConfirmationCard
            orderId={lastOrder.id?.slice(-8).toUpperCase() || ""}
            paymentMethod={lastOrder.paymentMethod || "Online Payment"}
            // eslint-disable-next-line react-hooks/purity
            dateTime={new Date(lastOrder.timestamp || Date.now()).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
            totalAmount={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
              lastOrder.grandTotal || lastOrder.total || total
            )}
            onGoToAccount={() => {
              setOrderCompleteMsg("");
              window.location.href = "/";
            }}
            title="Order Placed!"
            buttonText="Done"
          />
        </div>
      )}

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        order={lastOrder}
      />
    </div>
  );
}
