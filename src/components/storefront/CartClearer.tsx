"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export default function CartClearer() {
  const { clearCart } = useCart();
  const ran = useRef(false);

  useEffect(() => {
    if (!ran.current) {
      ran.current = true;
      clearCart();
    }
  }, [clearCart]);

  return null;
}