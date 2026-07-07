import { test, expect } from "@playwright/test";

test.describe("Haji Asal auth flows", () => {
  test("login page has tabs and test phone flow", async ({ page }) => {
    await page.goto("/hajiasal/login");

    await expect(page.getByRole("button", { name: "ورود" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ثبت‌نام" })).toBeVisible();

    await page.getByLabel("شماره موبایل").fill("09123456789");
    await page.getByRole("button", { name: /دریافت کد/ }).click();

    await expect(page.getByLabel("رقم 1")).toBeVisible({ timeout: 10_000 });
  });

  test("register route redirects to login tab", async ({ page }) => {
    await page.goto("/hajiasal/register");
    await expect(page).toHaveURL(/tab=register/);
  });
});
