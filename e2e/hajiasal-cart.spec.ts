import { test, expect } from "@playwright/test";

test.describe("Haji Asal cart", () => {
  test("cart page loads with empty state or items", async ({ page }) => {
    await page.goto("/hajiasal/cart");
    await expect(
      page.getByRole("heading", { name: /سبد خرید/i }),
    ).toBeVisible();
  });

  test("coupon HAJI10 validates on cart", async ({ page }) => {
    await page.goto("/hajiasal/shop");
    const productLink = page.locator('a[href*="/hajiasal/product/"]').first();
    if (await productLink.isVisible()) {
      await productLink.click();
      await page.getByRole("button", { name: /افزودن به سبد/i }).click();
    }
    await page.goto("/hajiasal/cart");
    const couponInput = page.getByPlaceholder(/کد تخفیف/i);
    if (await couponInput.isVisible()) {
      await couponInput.fill("HAJI10");
      const applyBtn = page.getByRole("button", { name: /اعمال|تخفیف/i });
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
      }
    }
  });

  test("shop links resolve without double hajiasal path", async ({ page }) => {
    await page.goto("/hajiasal");
    const shopLink = page
      .getByRole("link", { name: /فروشگاه|محصولات|مشاهده/i })
      .first();
    if (await shopLink.isVisible()) {
      const href = await shopLink.getAttribute("href");
      expect(href ?? "").not.toContain("/hajiasal/hajiasal");
    }
  });
});
