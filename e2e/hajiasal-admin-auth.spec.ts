import { test, expect } from "@playwright/test";

test.describe("Haji Asal admin auth", () => {
  test("admin login page loads", async ({ page }) => {
    await page.goto("/hajiasal/admin");
    await expect(page.getByLabel(/رمز عبور/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /ورود/i })).toBeVisible();
  });

  test("rejects wrong password", async ({ page }) => {
    await page.goto("/hajiasal/admin");
    await page.getByLabel(/رمز عبور/i).fill("wrong-password");
    await page.getByRole("button", { name: /ورود/i }).click();
    await expect(page.getByText(/رمز|نامعتبر|غلط/i)).toBeVisible({
      timeout: 10_000,
    });
  });
});
