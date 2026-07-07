import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsPath = path.join(root, "src", "hajiasal", "data", "products.json");
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

for (const p of products) {
  p.images = [
    `/images/hajiasal/products/${p.id}.webp`,
    `/images/hajiasal/products/${p.id}-alt.webp`,
  ];
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2) + "\n");
console.log(`Updated ${products.length} products`);
