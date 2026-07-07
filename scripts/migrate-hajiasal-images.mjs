import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicImages = path.join(root, "public", "images");
const hajiasalImages = path.join(publicImages, "hajiasal");

const siteJsonPath = path.join(root, "src", "hajiasal", "data", "site.json");
const productsJsonPath = path.join(root, "src", "hajiasal", "data", "products.json");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`skip missing: ${path.relative(root, src)}`);
    return false;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

function copyDirectory(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return 0;

  ensureDir(destDir);
  let count = 0;

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    copyIfExists(path.join(srcDir, entry.name), path.join(destDir, entry.name));
    count += 1;
  }

  return count;
}

function toHajiasalPath(imagePath) {
  if (!imagePath.startsWith("/images/")) return imagePath;
  if (imagePath.startsWith("/images/hajiasal/")) return imagePath;
  return imagePath.replace(/^\/images\//, "/images/hajiasal/");
}

function migrateJsonPaths() {
  const site = JSON.parse(fs.readFileSync(siteJsonPath, "utf8"));

  if (site.hero?.image) {
    site.hero.image = toHajiasalPath(site.hero.image);
  }

  if (Array.isArray(site.categories)) {
    site.categories = site.categories.map((category) => ({
      ...category,
      image: toHajiasalPath(category.image),
    }));
  }

  if (Array.isArray(site.team)) {
    site.team = site.team.map((member) => ({
      ...member,
      image: toHajiasalPath(member.image),
    }));
  }

  fs.writeFileSync(siteJsonPath, `${JSON.stringify(site, null, 2)}\n`);

  const products = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
  const updatedProducts = products.map((product) => ({
    ...product,
    images: Array.isArray(product.images)
      ? product.images.map((image) => toHajiasalPath(image))
      : product.images,
  }));

  fs.writeFileSync(productsJsonPath, `${JSON.stringify(updatedProducts, null, 2)}\n`);
}

function main() {
  ensureDir(hajiasalImages);

  const copied = {
    hero: copyIfExists(
      path.join(publicImages, "hero.svg"),
      path.join(hajiasalImages, "hero.svg"),
    ),
    placeholder: copyIfExists(
      path.join(publicImages, "placeholder.svg"),
      path.join(hajiasalImages, "placeholder.svg"),
    ),
    categories: copyDirectory(
      path.join(publicImages, "categories"),
      path.join(hajiasalImages, "categories"),
    ),
    products: copyDirectory(
      path.join(publicImages, "products"),
      path.join(hajiasalImages, "products"),
    ),
    team: copyDirectory(
      path.join(publicImages, "team"),
      path.join(hajiasalImages, "team"),
    ),
  };

  migrateJsonPaths();

  console.log("Haji Asal image migration complete:");
  console.log(`  hero: ${copied.hero ? "copied" : "missing"}`);
  console.log(`  placeholder: ${copied.placeholder ? "copied" : "missing"}`);
  console.log(`  categories: ${copied.categories} files`);
  console.log(`  products: ${copied.products} files`);
  console.log(`  team: ${copied.team} files`);
  console.log("  updated site.json + products.json paths");
}

main();
