/**
 * Generates local product/category SVG images (no external CDN dependency).
 * Run: node scripts/generate-images.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const productsPath = join(root, "src/data/products.json");
const sitePath = join(root, "src/data/site.json");

const categoryPalettes = {
  mountain: ["#D97706", "#92400E", "#FEF3C7"],
  thyme: ["#B45309", "#78350F", "#FFEDD5"],
  multifloral: ["#CA8A04", "#854D0E", "#FEF9C3"],
  "royal-jelly": ["#EAB308", "#A16207", "#FEF08A"],
  honeycomb: ["#F59E0B", "#B45309", "#FDE68A"],
  specialty: ["#DC2626", "#991B1B", "#FECACA"],
  "gift-set": ["#7C3AED", "#5B21B6", "#EDE9FE"],
};

function honeySvg(id, colors, label) {
  const [c1, c2, c3] = colors;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c3}"/>
      <stop offset="50%" stop-color="${c1}22"/>
      <stop offset="100%" stop-color="${c2}44"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="${c1}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="jar-${id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg-${id})"/>
  <circle cx="400" cy="320" r="280" fill="url(#glow-${id})"/>
  <g transform="translate(400,380)">
    <path d="M-120,-80 L120,-80 L140,180 Q140,220 100,220 L-100,220 Q-140,220 -140,180 Z" fill="url(#jar-${id})" opacity="0.9"/>
    <ellipse cx="0" cy="-80" rx="120" ry="28" fill="${c2}"/>
    <ellipse cx="0" cy="40" rx="90" ry="70" fill="${c3}" opacity="0.5"/>
    <path d="M-60,120 Q0,160 60,120" stroke="${c2}" stroke-width="4" fill="none" opacity="0.6"/>
  </g>
  <g opacity="0.15" fill="${c2}">
    <polygon points="120,120 140,150 110,150"/>
    <polygon points="680,200 700,230 670,230"/>
    <polygon points="200,650 220,680 190,680"/>
    <polygon points="600,580 620,610 590,610"/>
  </g>
</svg>`;
}

function heroSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img" aria-label="عسل طبیعی">
  <defs>
    <linearGradient id="hero-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1C1917"/>
      <stop offset="40%" stop-color="#3D2B1F"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <radialGradient id="hero-glow" cx="60%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#hero-bg)"/>
  <circle cx="1100" cy="400" r="500" fill="url(#hero-glow)"/>
  <circle cx="400" cy="700" r="300" fill="#D97706" opacity="0.08"/>
</svg>`;
}

mkdirSync(join(root, "public/images/products"), { recursive: true });
mkdirSync(join(root, "public/images/categories"), { recursive: true });

const products = JSON.parse(readFileSync(productsPath, "utf-8"));

for (const product of products) {
  const palette =
    categoryPalettes[product.category] || categoryPalettes.mountain;
  const svg = honeySvg(product.id, palette, product.title);
  const filename = `${product.id}.svg`;
  writeFileSync(join(root, "public/images/products", filename), svg);
  product.images = [
    `/images/products/${filename}`,
    `/images/products/${filename}`,
  ];
}

writeFileSync(join(root, "public/images/hero.svg"), heroSvg());
writeFileSync(
  join(root, "public/images/placeholder.svg"),
  honeySvg("placeholder", categoryPalettes.mountain, "حاجی عسل"),
);

const site = JSON.parse(readFileSync(sitePath, "utf-8"));
site.hero.image = "/images/hero.svg";
for (const cat of site.categories) {
  const palette = categoryPalettes[cat.id] || categoryPalettes.mountain;
  const svg = honeySvg(`cat-${cat.id}`, palette, cat.label);
  writeFileSync(
    join(root, "public/images/categories", `${cat.id}.svg`),
    svg,
  );
  cat.image = `/images/categories/${cat.id}.svg`;
}

writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n");
writeFileSync(sitePath, JSON.stringify(site, null, 2) + "\n");
console.log(`Generated ${products.length} product images + categories + hero`);
