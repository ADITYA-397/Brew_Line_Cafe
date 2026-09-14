"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, UserPlus, X, Coffee } from "lucide-react";

export default function AuthModal({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(30, 24, 20, 0.6)",
            backdropFilter: "blur(4px)",
          }}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "440px",
            backgroundColor: "#F7F2EC",
            border: "1px solid #DCD3C6",
            borderRadius: "24px",
            padding: "36px 30px 28px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.18)",
            textAlign: "center",
            boxSizing: "border-box",
            zIndex: 10000,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "none",
              border: "none",
              color: "#8A7D6E",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "color 0.2s, background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#2E2620";
              e.currentTarget.style.backgroundColor = "rgba(46, 38, 32, 0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8A7D6E";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Coffee / Lock Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#EAE1D5",
              color: "#C08552",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 2px 8px rgba(192, 133, 82, 0.15)",
            }}
          >
            <Coffee size={26} strokeWidth={2.2} />
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: 700,
              color: "#2E2620",
              margin: "0 0 10px 0",
              lineHeight: 1.25,
            }}
          >
            Sign In Required
          </h3>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "14px",
              color: "#6E6255",
              margin: "0 0 26px 0",
              lineHeight: 1.5,
            }}
          >
            Please log in or create an account to add your favorite coffees & treats to the cart.
          </p>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              style={{
                width: "100%",
                backgroundColor: "#C08552",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9999px",
                padding: "13px 20px",
                fontSize: "14.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 8px rgba(192, 133, 82, 0.25)",
                transition: "background-color 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#A96F3F")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#C08552")}
            >
              <LogIn size={17} />
              <span>Log In to Your Account</span>
            </button>

            <button
              onClick={() => {
                onClose();
                router.push("/signup");
              }}
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                color: "#2E2620",
                border: "1.5px solid #DCD3C6",
                borderRadius: "9999px",
                padding: "12px 20px",
                fontSize: "14.5px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#F0EAE1";
                e.currentTarget.style.borderColor = "#C08552";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#DCD3C6";
              }}
            >
              <UserPlus size={17} />
              <span>Create a New Account</span>
            </button>

            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#8A7D6E",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                padding: "6px",
                marginTop: "4px",
                textDecoration: "underline",
              }}
            >
              Continue Browsing Menu
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
