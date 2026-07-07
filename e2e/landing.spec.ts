import { test, expect } from "@playwright/test";

test.describe("Raxin landing page", () => {
  test("hero, navigation, FAQ and contact form are visible", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /استارتاپت را به محصولی بساز/i }),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("link", { name: "تخصص" }).click();
    await expect(page.locator("#expertise")).toBeInViewport();

    await page.getByRole("link", { name: "کارها" }).click();
    await expect(page.locator("#work")).toBeInViewport();

    await expect(page.getByText("حاجی عسل")).toBeVisible();

    await page.getByRole("link", { name: "سوالات" }).click();
    await expect(page.locator("#faq")).toBeInViewport();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("نام")).toBeVisible();
    await expect(page.getByRole("button", { name: "ارسال درخواست" })).toBeVisible();
    await expect(page.getByText(/حریم خصوصی/)).toBeVisible();
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto("/#faq");

    const question = page.getByRole("button", {
      name: "زمان تحویل نسخه اولیه چقدر است؟",
    });
    await question.click();

    await expect(page.getByText(/۲ تا ۶ هفته/)).toBeVisible();
  });

  test("mobile viewport shows hero and menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /استارتاپت را به محصولی بساز/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: "باز کردن منو" }).click();
    await expect(page.getByRole("link", { name: "ارتباط" })).toBeVisible();
  });
});
