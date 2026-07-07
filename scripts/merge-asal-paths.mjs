import fs from "fs";
import path from "path";

const roots = [
  "src/hajiasal",
  "src/app/hajiasal",
  "src/app/api",
];

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.(ts|tsx|json)$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

function transform(content) {
  return content
    .replace(/@\//g, "@asal/")
    .replace(/href="\/shop/g, 'href="/hajiasal/shop')
    .replace(/href="\/checkout/g, 'href="/hajiasal/checkout')
    .replace(/href="\/cart/g, 'href="/hajiasal/cart')
    .replace(/href="\/wishlist/g, 'href="/hajiasal/wishlist')
    .replace(/href="\/track-order/g, 'href="/hajiasal/track-order')
    .replace(/href="\/contact/g, 'href="/hajiasal/contact')
    .replace(/href="\/faq/g, 'href="/hajiasal/faq')
    .replace(/href="\/about/g, 'href="/hajiasal/about')
    .replace(/href="\/"/g, 'href="/hajiasal"')
    .replace(/`\/product\//g, "`/hajiasal/product/")
    .replace(/"\/product\//g, '"/hajiasal/product/')
    .replace(/'\/product\//g, "'/hajiasal/product/")
    .replace(/canonical: `\/product\//g, "canonical: `/hajiasal/product/")
    .replace(/\$\{siteUrl\}\/product\//g, "${siteUrl}/hajiasal/product/")
    .replace(/href={`\/?shop/g, "href={`/hajiasal/shop")
    .replace(/href={`\/?track-order`}/g, "href={`/hajiasal/track-order`}");
}

let updated = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    const original = fs.readFileSync(file, "utf8");
    const next = transform(original);
    if (next !== original) {
      fs.writeFileSync(file, next);
      updated += 1;
    }
  }
}

console.log(`Updated ${updated} files`);
