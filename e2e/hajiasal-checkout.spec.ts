import { test, expect } from "@playwright/test";

test.describe("Haji Asal checkout happy path", () => {
  test("browse shop, add product, complete checkout", async ({ page }) => {
    await page.goto("/hajiasal/shop");

    await expect(page.getByRole("heading", { name: /فروشگاه/i })).toBeVisible({
      timeout: 15_000,
    });

    const firstProduct = page.locator('a[href^="/hajiasal/product/"]').first();
    await firstProduct.click();

    await expect(page.getByRole("button", { name: "افزودن به سبد" })).toBeVisible();
    await page.getByRole("button", { name: "افزودن به سبد" }).click();

    await page.goto("/hajiasal/checkout");

    await page.getByRole("button", { name: "بعدی" }).click();

    await page.getByLabel("نام و نام خانوادگی").fill("علی تستی");
    await page.getByLabel("شماره موبایل").fill("09123456789");
    await page.getByLabel("استان").selectOption("تهران");
    await page.getByLabel("شهر").selectOption("تهران");
    await page.getByLabel("آدرس کامل").fill("خیابان ولیعصر، پلاک ۱");
    await page.getByLabel("کد پستی").fill("1234567890");
    await page.getByRole("button", { name: "بعدی" }).click();

    await page.getByRole("button", { name: "بعدی" }).click();

    await page.getByRole("button", { name: /ثبت سفارش/ }).click();

    await expect(page).toHaveURL(/\/hajiasal\/checkout\/success/, {
      timeout: 15_000,
    });
    await expect(page.getByText(/سفارش.*ثبت/)).toBeVisible();
  });
});
