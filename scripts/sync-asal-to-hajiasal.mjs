import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  existsSync,
  readdirSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL("..", import.meta.url)));

const skipFiles = new Set(["components/layout/Header.tsx"]);

const routePages = [
  "about/page.tsx",
  "cart/page.tsx",
  "checkout/page.tsx",
  "checkout/success/page.tsx",
  "contact/page.tsx",
  "faq/page.tsx",
  "not-found.tsx",
  "product/[slug]/page.tsx",
  "shop/page.tsx",
  "track-order/page.tsx",
  "wishlist/page.tsx",
];

function transform(content) {
  let out = content.replace(/from "@\//g, 'from "@asal/');

  const pathPrefixes = [
    "shop",
    "cart",
    "checkout",
    "about",
    "contact",
    "faq",
    "product",
    "wishlist",
    "track-order",
    "account",
    "login",
    "register",
  ];
  const pathPattern = pathPrefixes.join("|");

  out = out.replace(
    new RegExp(`href="/(${pathPattern})(?=/|")`, "g"),
    'href="/hajiasal/$1',
  );
  out = out.replace(/href={`\/product\//g, "href={`/hajiasal/product/");
  out = out.replace(/pathname === "\/"/g, 'pathname === "/hajiasal"');

  return out;
}

function writeTransformed(fromPath, toPath) {
  const content = readFileSync(fromPath, "utf8");
  mkdirSync(dirname(toPath), { recursive: true });
  writeFileSync(toPath, transform(content), "utf8");
  console.log(`  synced ${relative(root, toPath)}`);
}

function walkComponents(dir, toDir, rel = "") {
  for (const entry of readdirSync(join(dir, rel))) {
    const relPath = rel ? `${rel}/${entry}` : entry;
    const from = join(dir, relPath);
    if (statSync(from).isDirectory()) {
      walkComponents(dir, toDir, relPath);
      continue;
    }
    if (!/\.tsx?$/.test(entry)) continue;
    const normalized = relPath.replace(/\\/g, "/");
    if (skipFiles.has(`components/${normalized}`)) {
      console.log(`  skip components/${normalized}`);
      continue;
    }
    writeTransformed(from, join(toDir, relPath));
  }
}

console.log("Syncing components...");
walkComponents(
  join(root, "Asal/src/components"),
  join(root, "src/hajiasal/components"),
);

console.log("Syncing data...");
for (const file of ["products.json", "site.json"]) {
  writeTransformed(
    join(root, "Asal/src/data", file),
    join(root, "src/hajiasal/data", file),
  );
}

console.log("Syncing lib/products.ts...");
writeTransformed(
  join(root, "Asal/src/lib/products.ts"),
  join(root, "src/hajiasal/lib/products.ts"),
);

console.log("Syncing globals.css...");
const asalCss = readFileSync(join(root, "Asal/src/app/globals.css"), "utf8");
const hajiasalCss = `@import "tailwindcss" source(none);\n@source "../../hajiasal/**/*.{js,ts,jsx,tsx}";\n\n${asalCss.replace(/^@import "tailwindcss";\s*/m, "")}`;
writeFileSync(join(root, "src/hajiasal/styles/globals.css"), hajiasalCss, "utf8");
console.log("  synced src/hajiasal/styles/globals.css");

console.log("Syncing placeholder...");
const placeholderFrom = join(root, "Asal/public/images/placeholder.svg");
const placeholderTo = join(root, "public/images/hajiasal/placeholder.svg");
mkdirSync(dirname(placeholderTo), { recursive: true });
copyFileSync(placeholderFrom, placeholderTo);
console.log("  synced public/images/hajiasal/placeholder.svg");

console.log("Syncing route pages...");
for (const page of routePages) {
  const from = join(root, "Asal/src/app", page);
  const to = join(root, "src/app/hajiasal", page);
  if (!existsSync(from)) continue;
  writeTransformed(from, to);
}

console.log("Done.");
