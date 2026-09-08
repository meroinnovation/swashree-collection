/**
 * Seeds Swashree Collection with REAL products scraped from surprisenepalgifts.com:
 *   - 25 gift hamper products with Cloudinary images
 *   - Real prices (NPR)
 *   - Logical categories
 *
 * Usage: npm run seed:real
 */
import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
let env = {};
for (const name of [".env.local", ".env"]) {
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

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const categories = [
  { name: "Gift Hampers", slug: "gift-hampers", description: "Curated gift hampers for every occasion — handpicked with love.", colorA: "#e11d48", colorB: "#9f1239" },
  { name: "Dad & Father Gifts", slug: "dad-father-gifts", description: "Special gifts to celebrate fathers and father figures.", colorA: "#1d4ed8", colorB: "#1e3a8a" },
  { name: "Sister & Rakhi Gifts", slug: "sister-rakhi-gifts", description: "Thoughtful gifts for sisters on Raksha Bandhan and beyond.", colorA: "#d946ef", colorB: "#a21caf" },
  { name: "Premium Combos", slug: "premium-combos", description: "Luxury combo sets for the ones you love most.", colorA: "#b45309", colorB: "#78350f" },
  { name: "Luxury Collections", slug: "luxury-collections", description: "Exclusive luxury collections curated by Upahaar Nepal.", colorA: "#0d9488", colorB: "#0f766e" },
];

const svg = (title, colorA, colorB) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
       <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
         <stop offset="0" stop-color="${colorA}"/><stop offset="1" stop-color="${colorB}"/>
       </linearGradient></defs>
       <rect width="900" height="900" fill="url(#g)"/>
       <circle cx="450" cy="420" r="180" fill="${colorA}" opacity="0.45"/>
       <text x="450" y="690" font-family="Georgia, serif" font-size="44" fill="#fff" text-anchor="middle">${title.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</text>
     </svg>`
  );

const products = [
  { name: "Timeless Moments Gift Hamper", price: 7635, compareAt: null, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788004236/surprise-nepal/images/The%20Priceless%20Bond.jpg", tags: ["featured","gift-hampers"] },
  { name: "The Dad's Essentials Edit", price: 9114, compareAt: null, category: "dad-father-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788337168/surprise-nepal/images/hf_20260902_071527_2b73bbe7-80e1-458c-aaa9-dd3513e8f4c1%20%281%29%20%281%29.jpg", tags: ["dad-father-gifts"] },
  { name: "For Dad, With Love", price: 12831, compareAt: null, category: "dad-father-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788266568/surprise-nepal/images/hf_20260901_123337_03d83f4d-dac3-42b8-9582-4444ea12dda2.jpg", tags: ["dad-father-gifts"] },
  { name: "Heritage Gift Basket", price: 12849, compareAt: 13151, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788693794/surprise-nepal/images/IMG_6865.jpg", tags: ["gift-hampers"] },
  { name: "The Modern Man Tech & Trim Set", price: 13745, compareAt: null, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788088838/surprise-nepal/images/Combo%202%20Manual.jpg", tags: ["premium-combos"] },
  { name: "The Gentleman's Essentials", price: 13765, compareAt: null, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787924196/surprise-nepal/images/third%20combo.jpg.jpg", tags: ["premium-combos"] },
  { name: "A Tribute to a Dad", price: 15721, compareAt: 16628, category: "dad-father-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788853481/surprise-nepal/images/IMG_6873.jpg", tags: ["dad-father-gifts"] },
  { name: "Father's Day Grooming Gift Hamper", price: 15872, compareAt: 16023, category: "dad-father-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788853524/surprise-nepal/images/IMG_6872.jpg", tags: ["dad-father-gifts"] },
  { name: "Maya Ko Upahaar", price: 30485, compareAt: 38312, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787399394/surprise-nepal/images/199%20brother%20combo.jpg", tags: ["premium-combos","featured"] },
  { name: "The Minimalist's Luxury", price: 5999, compareAt: 6999, category: "luxury-collections", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787081688/surprise-nepal/images/product_image-pomelli_photoshoot_image_1_1_0520-6523.webp", tags: ["luxury-collections"] },
  { name: "Khushi Ko Upahaar", price: 7635, compareAt: null, category: "sister-rakhi-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788002053/surprise-nepal/images/Curated%20Hamper%20for%20Sister.jpg", tags: ["sister-rakhi-gifts"] },
  { name: "A Box Full of Little Memories", price: 7635, compareAt: null, category: "sister-rakhi-gifts", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788002445/surprise-nepal/images/Perfect%20Rakhi%20Hamper%20for%20Sister.jpg", tags: ["sister-rakhi-gifts"] },
  { name: "Across the Miles Gift Hamper", price: 10690, compareAt: 10854, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788090829/surprise-nepal/images/Beyond%20Borders%20and%20Blessings.jpg", tags: ["gift-hampers"] },
  { name: "The Symphony of Memory", price: 11999, compareAt: 13999, category: "luxury-collections", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787078779/surprise-nepal/images/product_image-pomelli_photoshoot_image_1_1_0520-%285%29-6327.webp", tags: ["luxury-collections"] },
  { name: "The Melody of Love", price: 11999, compareAt: 13999, category: "luxury-collections", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787081495/surprise-nepal/images/product_image-pomelli_photoshoot_image_1_1_0520-%281%29-7903.webp", tags: ["luxury-collections"] },
  { name: "The Smart Gentleman", price: 15272, compareAt: null, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787999809/surprise-nepal/images/Fourth%20final.jpg.jpg", tags: ["premium-combos"] },
  { name: "Him Radiance & Style Combo", price: 15272, compareAt: null, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788086865/surprise-nepal/images/Combo%201%20Mannual.jpg", tags: ["premium-combos"] },
  { name: "A Box Full of Smiles", price: 18202, compareAt: null, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787923174/surprise-nepal/images/second%20combo.jpg", tags: ["gift-hampers"] },
  { name: "The Ultimate Tech Box", price: 19854, compareAt: null, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788001188/surprise-nepal/images/fifth%20final.jpg", tags: ["premium-combos"] },
  { name: "Sending You a Hug", price: 20996, compareAt: 25747, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788068950/surprise-nepal/images/Sending%20You%20a%20Hug.jpg", tags: ["gift-hampers","featured"] },
  { name: "Melody & Glow For Partner In Crime", price: 21303, compareAt: 26514, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787160139/surprise-nepal/images/chitti%20parash.jpg", tags: ["gift-hampers"] },
  { name: "Pampered Her", price: 24981, compareAt: 29579, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787164856/surprise-nepal/images/kfjdslkjfkdjfkdjfdkjfdj.jpg", tags: ["gift-hampers"] },
  { name: "Her Day, Her Way", price: 25850, compareAt: null, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1787922972/surprise-nepal/images/bd.jpg", tags: ["gift-hampers"] },
  { name: "Favourite Person Premium Gift Hamper", price: 27433, compareAt: 32644, category: "gift-hampers", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788068690/surprise-nepal/images/Favourite%20Person.jpg", tags: ["gift-hampers","featured"] },
  { name: "The Gentleman's Edit", price: 29116, compareAt: 30650, category: "premium-combos", image: "https://res.cloudinary.com/dxtm1zwiu/image/upload/v1788069365/surprise-nepal/images/Awesome%20Rakhi%20Hamper%20for%20your%20Brother.jpg", tags: ["premium-combos"] },
];

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const ct = res.headers.get("content-type") || "image/jpeg";
  const buf = Buffer.from(await res.arrayBuffer());
  return { buffer: buf, contentType: ct };
}

async function main() {
  console.log(`\nSeeding ${products.length} real products into ${projectId}/${dataset} …\n`);

  const catDocs = {};
  for (const c of categories) {
    const svgBuf = svg(c.name, c.colorA, c.colorB);
    const asset = await client.assets.upload("image", svgBuf, {
      contentType: "image/svg+xml",
      filename: `${c.slug}.svg`,
    });
    const doc = await client.createOrReplace({
      _id: `category-${c.slug}`,
      _type: "category",
      name: c.name,
      slug: { _type: "slug", current: c.slug },
      description: c.description,
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
      orderRank: categories.indexOf(c),
    });
    catDocs[c.slug] = { _ref: doc._id };
    process.stdout.write(`  ✓ ${c.name}\n`);
  }

  process.stdout.write("\n");

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const num = `[${i + 1}/${products.length}]`;
    process.stdout.write(`${num} ${p.name} … `);

    try {
      const { buffer, contentType } = await downloadImage(p.image);
      const uploaded = await client.assets.upload("image", buffer, {
        contentType,
        filename: `${slugify(p.name)}-${contentType.split("/")[1] || "jpg"}`,
      });

      await client.createOrReplace({
        _id: `product-${slugify(p.name)}`,
        _type: "product",
        name: p.name,
        slug: { _type: "slug", current: slugify(p.name) },
        category: catDocs[p.category],
        price: p.price,
        compareAtPrice: p.compareAt || undefined,
        images: [{ _type: "image", asset: { _type: "reference", _ref: uploaded._id } }],
        shortDescription: `A beautifully curated gift — handpicked by Swashree Collection.`,
        description: [
          { _type: "block", style: "normal", children: [{ _type: "span", text: `The ${p.name} is handpicked by our team for its quality and charm. Comes gift-ready in beautiful packaging.`, marks: [] }] },
        ],
        tags: p.tags,
        isFeatured: p.tags.includes("featured"),
        inStock: true,
        isGiftWrappable: true,
        sizes: [],
        colors: [],
      });

      process.stdout.write("OK\n");
    } catch (err) {
      process.stdout.write(`FAIL: ${err.message}\n`);
    }

    if (i < products.length - 1) await new Promise((r) => setTimeout(r, 200));
  }

  process.stdout.write("\n✓ Done!\n");
}

main().catch((err) => { console.error(err); process.exit(1); });
