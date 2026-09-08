import { createClient } from "next-sanity";
import type { SanityDocument } from "next-sanity";
import { apiVersion, dataset, projectId, readToken, useCdn } from "@/sanity/env";

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  useCdn: useCdn,
  perspective: "published",
  stega: { enabled: false, studioUrl: "/studio" },
  token: readToken || undefined,
});

const fetchOptions = { next: { revalidate: 60, tags: ["content"] } };

export const productsQuery = /* groq */ `
  *[_type == "product"] | order(_createdAt desc) [0...100] {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    "images": images[]{ asset->{url, metadata{dimensions}} },
    shortDescription,
    sizes,
    colors,
    tags,
    isFeatured,
    inStock,
    isGiftWrappable,
    "category": category->{ name, "slug": slug.current }
  }
`;

export const productBySlugQuery = /* groq */ `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    "images": images[]{ asset->{url, metadata{dimensions}} },
    shortDescription,
    description,
    sizes,
    colors,
    tags,
    isFeatured,
    inStock,
    isGiftWrappable,
    "category": category->{ name, "slug": slug.current, description },
    "related": *[_type == "product" && category._ref == ^.category._ref && _id != ^._id][0..3] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      price,
      compareAtPrice,
      "images": images[0]{ asset->{url, metadata{dimensions}} },
      inStock
    }
  }
`;

export const featuredProductsQuery = /* groq */ `
  *[_type == "product" && isFeatured == true] | order(_createdAt desc) [0...8] {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    "images": images[0..2]{ asset->{url, metadata{dimensions}} },
    shortDescription,
    inStock
  }
`;

export const categoriesQuery = /* groq */ `
  *[_type == "category"] | order(orderRank asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image{ asset->{url, metadata{dimensions}} }
  }
`;

export const categoryBySlugQuery = /* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": image{ asset->{url, metadata{dimensions}} }
  }
`;

export const productsByCategoryQuery = /* groq */ `
  *[_type == "product" && category->slug.current == $slug] | order(_createdAt desc) {
    _id,
    _createdAt,
    name,
    "slug": slug.current,
    price,
    compareAtPrice,
    "images": images[]{ asset->{url, metadata{dimensions}} },
    shortDescription,
    inStock,
    "category": category->{ name }
  }
`;

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    storeName,
    tagline,
    "logo": logo{ asset->{url} },
    phone,
    whatsapp,
    email,
    address,
    facebook,
    instagram,
    tiktok,
    announcement,
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage{ asset->{url} },
    featuredHeading,
    deliveryFee,
    freeShippingOver,
    extraDeliveryNote,
    codEnabled,
    esewaEnabled,
    khaltiEnabled,
    footerText
  }
`;

export async function sanityFetch<T = unknown>(query: string, params?: Record<string, unknown>): Promise<T | undefined> {
  if (!projectId) return undefined;
  try {
    return (await client.fetch(query, params, fetchOptions)) as T;
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return undefined;
  }
}

export type SiteSettings = SanityDocument & {
  storeName?: string;
  tagline?: string;
  logo?: { url?: string };
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  announcement?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: { url?: string };
  featuredHeading?: string;
  deliveryFee?: number;
  freeShippingOver?: number;
  extraDeliveryNote?: string;
  codEnabled?: boolean;
  esewaEnabled?: boolean;
  khaltiEnabled?: boolean;
  footerText?: string;
};

export type ProductImage = { url?: string; width?: number; height?: number };
export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
};

export type Category = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  orderRank?: number;
  image?: ProductImage;
};

export type PortableTextBlock = {
  _type?: string;
  style?: string;
  children?: Array<{ text?: string; marks?: string[]; _type?: string }>;
  markDefs?: Array<{ _key?: string; markType?: string; href?: string }>;
};

export type ProductDetail = {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  compareAtPrice?: number;
  images?: ProductImage[];
  shortDescription?: string;
  description?: PortableTextBlock[];
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  isFeatured?: boolean;
  inStock?: boolean;
  isGiftWrappable?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  category?: { name?: string; slug?: string; description?: string };
  related?: ProductDetail[];
  _createdAt?: string;
};