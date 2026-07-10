import { test, expect } from "@playwright/test";

test.describe("Raxin landing page", () => {
  test("hero, mode toggle, work and contact IDE are visible", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /محصول دیجیتال/i }),
    ).toBeVisible({ timeout: 15_000 });

    await expect(page.getByText("راکسین‌شاپ").first()).toBeVisible();

    const executive = page.getByRole("button", { name: "Executive" });
    await executive.click();
    await expect(
      page.getByRole("heading", { name: /پایداری و رشد/i }),
    ).toBeVisible();

    await page.getByRole("link", { name: "کارها" }).first().click();
    await expect(page.locator("#work")).toBeInViewport();
    await expect(page.getByText("حاجی عسل")).toBeVisible();
    await expect(page.getByText("مرهم").first()).toBeVisible();

    await page.locator("#terminal").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("دستور ترمینال")).toBeVisible();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("نام")).toBeVisible();
    await expect(page.getByRole("button", { name: /Run/i })).toBeVisible();
  });

  test("terminal help command works", async ({ page }) => {
    await page.goto("/#terminal");
    const input = page.getByLabel("دستور ترمینال");
    await input.fill("help");
    await input.press("Enter");
    await expect(page.getByText("Available commands:")).toBeVisible();
  });

  test("mobile viewport shows hero and menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /محصول دیجیتال/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: "باز کردن منو" }).click();
    await expect(page.getByRole("link", { name: "ارتباط" })).toBeVisible();
  });
});
