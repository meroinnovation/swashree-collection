/**
 * Seeds Swashree Collection with sample content:
 *   - site settings (singleton)
 *   - 4 categories
 *   - 8 products (with generated SVG images)
 *   - a WELCOME10 coupon
 *
 * Usage:
 *   npm run seed
 *
 * Requires env vars (from .env.local): SANITY_PROJECT_ID / SANITY_DATASET /
 * SANITY_API_WRITE_TOKEN.
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
let env = {};
for (const name of [".env", ".env.local"]) {
  const file = join(__dirname, "..", name);
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
    }
  } catch {}
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN || env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2025-06-01", token, useCdn: false });

const svg = (title, colorA, colorB) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="${colorA}"/><stop offset="1" stop-color="${colorB}"/>
       </linearGradient></defs>
       <rect width="900" height="900" fill="url(#g)"/>
       <circle cx="450" cy="420" r="180" fill="${colorA}" opacity="0.45"/>
       <text x="450" y="690" font-family="Georgia, serif" font-size="44" fill="#fff" text-anchor="middle">${escapeXml(title)}</text>
     </svg>`
  );

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const escapeXml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const categories = [
  { name: "Gift Sets", colorA: "#e11d48", colorB: "#9f1239" },
  { name: "Handmade Jewelry", colorA: "#b45309", colorB: "#78350f" },
  { name: "Pashmina & Scarves", colorA: "#0d9488", colorB: "#0f766e" },
  { name: "Home Decor", colorA: "#7c3aed", colorB: "#5b21b6" },
];

const products = [
  ["Birthday Treat Gift Box", "Gift Sets", 1299, 1599, true, true],
  ["Personalized Name Mug Set", "Gift Sets", 899, 1099, true, true],
  ["Rose Gold Anklet", "Handmade Jewelry", 750, null, false, true],
  ["Pearl Beaded Bracelet", "Handmade Jewelry", 950, 1250, true, true],
  ["Pure Pashmina Shawl", "Pashmina & Scarves", 3800, 4500, true, true],
  ["Festive Silk Scarf", "Pashmina & Scarves", 1299, null, false, true],
  ["Boho Candle Set (3 pcs)", "Home Decor", 1100, 1400, true, true],
  ["Woven Wall Hanging", "Home Decor", 1600, null, false, true],
];

async function uploadImage(title, colorA, colorB) {
  const asset = await client.assets.upload("image", svg(title, colorA, colorB), {
    contentType: "image/svg+xml",
    filename: `${slugify(title)}.svg`,
  });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

async function main() {
  console.log(`Seeding "Swashree Collection" into ${projectId}/${dataset} …`);

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    storeName: "Swashree Collection",
    tagline: "Gifts & Fine Collections",
    phone: "98XXXXXXXX",
    whatsapp: "97798XXXXXXXX",
    email: "hello@swashreecollection.com",
    address: "Kathmandu, Nepal",
    facebook: "https://www.facebook.com",
    instagram: "https://www.instagram.com",
    announcement: "🎉 Free delivery on all orders above Rs. 2000 · Nationwide delivery",
    heroTitle: "Gifts that feel made just for them.",
    heroSubtitle:
      "Discover handpicked gifts, fashion and fine collections curated in Nepal — delivered to your door with love.",
    featuredHeading: "Featured Collections",
    deliveryFee: 100,
    freeShippingOver: 2000,
    extraDeliveryNote: "Rs. 100 flat across the Valley · COD, eSewa & Khalti accepted",
    codEnabled: true,
    esewaEnabled: true,
    khaltiEnabled: true,
    footerText: "Curated gifts and fine collections for every occasion. Handpicked with love in Nepal.",
  });
  console.log("✓ siteSettings");

  const categoryRefs = {};
  for (const c of categories) {
    const doc = await client.createOrReplace({
      _id: `category-${slugify(c.name)}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: slugify(c.name) },
      description: `Beautifully curated ${c.name.toLowerCase()} — handpicked by Swashree Collection.`,
      image: await uploadImage(c.name, c.colorA, c.colorB),
      orderRank: categories.indexOf(c),
    });
    categoryRefs[c.name] = { _ref: doc._id };
  }
  console.log(`✓ ${categories.length} categories`);

  for (const [name, catName, price, compareAtPrice, featured, gift] of products) {
    const cat = categories.find((c) => c.name === catName);
    await client.createOrReplace({
      _id: `product-${slugify(name)}`,
      _type: "product",
      name,
      slug: { _type: "slug", current: slugify(name) },
      category: categoryRefs[catName],
      price,
      compareAtPrice: compareAtPrice || undefined,
      images: [
        await uploadImage(name, cat.colorA, cat.colorB),
        await uploadImage(`${name} · detail`, cat.colorA, "#1e1b4b"),
      ],
      shortDescription: `A lovely addition to the ${cat.name.toLowerCase()} collection.`,
      description: [
        { _type: "block", style: "normal", children: [{ _type: "span", text: `The ${name} is handpicked by our team for its quality and charm. Comes gift-ready in beautiful packaging.`, marks: [] }] },
      ],
      sizes: catName === "Pashmina & Scarves" ? ["One Size"] : [],
      colors: catName === "Gift Sets" ? ["Pink", "Gold"] : [],
      tags: ["featured", slugify(catName)],
      isFeatured: featured,
      inStock: true,
      isGiftWrappable: gift,
    });
  }
  console.log(`✓ ${products.length} products`);

  await client.createOrReplace({
    _id: "couponWELCOME10",
    _type: "coupon",
    code: "WELCOME10",
    discountType: "percent",
    discountValue: 10,
    minOrderAmount: 1000,
    isActive: true,
    usedCount: 0,
  });
  console.log("✓ coupon WELCOME10");

  console.log("\nDone! Open /studio in your browser to review, edit and publish.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});