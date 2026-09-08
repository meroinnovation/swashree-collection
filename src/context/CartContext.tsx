"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  qty: number;
  size?: string;
  color?: string;
};

type CartCoupon =
  | {
      code: string;
      discountAmount: number;
      discountType: "percent" | "flat";
      discountValue: number;
    }
  | null;

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; productId: string; size?: string; color?: string }
  | { type: "SET_QTY"; productId: string; size?: string; color?: string; qty: number }
  | { type: "CLEAR" }
  | { type: "SET_COUPON"; coupon: CartCoupon }
  | { type: "HYDRATE"; items: CartItem[]; coupon: CartCoupon };

type CartState = { items: CartItem[]; coupon: CartCoupon };

const STORAGE_KEY = "swashree-cart-v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: Array.isArray(action.items) ? action.items : [], coupon: action.coupon };
    case "ADD": {
      const match = (i: CartItem) =>
        i.productId === action.item.productId && i.size === action.item.size && i.color === action.item.color;
      const existingIndex = state.items.findIndex(match);
      const items =
        existingIndex >= 0
          ? state.items.map((i, idx) =>
              idx === existingIndex ? { ...i, qty: i.qty + action.item.qty } : i
            )
          : [...state.items, action.item];
      return { ...state, items };
    }
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (i) =>
            !(i.productId === action.productId && i.size === action.size && i.color === action.color)
        ),
      };
    case "SET_QTY":
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.productId === action.productId && i.size === action.size && i.color === action.color
              ? { ...i, qty: Math.max(1, action.qty) }
              : i
          )
          .filter((i) => i.qty > 0),
      };
    case "SET_COUPON":
      return { ...state, coupon: action.coupon };
    case "CLEAR":
      return { items: [], coupon: null };
    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  count: number;
  coupon: CartCoupon;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  setQty: (productId: string, qty: number, size?: string, color?: string) => void;
  clearCart: () => void;
  setCoupon: (coupon: CartCoupon) => void;
  subtotal: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], coupon: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      dispatch({ type: "HYDRATE", items: parsed?.items ?? [], coupon: parsed?.coupon ?? null });
    } catch {
      dispatch({ type: "HYDRATE", items: [], coupon: null });
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items, coupon: state.coupon }));
      } catch {
        // storage unavailable
      }
    }
  }, [state, hydrated]);

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + i.price * i.qty, 0), [state.items]);
  const count = useMemo(() => state.items.reduce((sum, i) => sum + i.qty, 0), [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      count,
      coupon: state.coupon,
      subtotal,
      addItem: (item: CartItem) => dispatch({ type: "ADD", item }),
      removeItem: (productId: string, size?: string, color?: string) =>
        dispatch({ type: "REMOVE", productId, size, color }),
      setQty: (productId: string, qty: number, size?: string, color?: string) =>
        dispatch({ type: "SET_QTY", productId, qty, size, color }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      setCoupon: (coupon: CartCoupon) => dispatch({ type: "SET_COUPON", coupon }),
    }),
    [state.items, state.coupon, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}