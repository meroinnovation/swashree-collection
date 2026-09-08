import product from "./product";
import category from "./category";
import order from "./order";
import coupon from "./coupon";
import siteSettings from "./siteSettings";

export const schemaTypes = [
  product,
  category,
  order,
  coupon,
  siteSettings,
];

export type Product = {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url?: string; width?: number; height?: number }>;
  shortDescription?: string;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured?: boolean;
  inStock?: boolean;
  isGiftWrappable?: boolean;
  category?: { name?: string; slug?: string };
  _createdAt?: string;
};