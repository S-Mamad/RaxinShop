import { test, expect } from "@playwright/test";

test.describe("Haji Asal cart", () => {
  test("cart page loads with empty state or items", async ({ page }) => {
    await page.goto("/hajiasal/cart");
    await expect(
      page.getByRole("heading", { name: /سبد خرید/i }),
    ).toBeVisible();
  });

  test("shop links resolve without double hajiasal path", async ({ page }) => {
    await page.goto("/hajiasal");
    const shopLink = page.getByRole("link", { name: /فروشگاه|محصولات|مشاهده/i }).first();
    if (await shopLink.isVisible()) {
      const href = await shopLink.getAttribute("href");
      expect(href ?? "").not.toContain("/hajiasal/hajiasal");
    }
  });
});
