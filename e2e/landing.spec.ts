import { test, expect } from "@playwright/test";

test.describe("Raxin landing page", () => {
  test("hero, navigation, FAQ and contact form are visible", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /محصول دیجیتال/i }),
    ).toBeVisible({ timeout: 15_000 });

    await page.getByRole("link", { name: "تخصص" }).click();
    await expect(page.locator("#expertise")).toBeInViewport();

    await page.getByRole("link", { name: "کارها" }).click();
    await expect(page.locator("#work")).toBeInViewport();

    await expect(page.getByText("حاجی عسل")).toBeVisible();

    await page.locator("#faq").scrollIntoViewIfNeeded();
    await expect(page.getByText("زمان تحویل MVP چقدر است؟")).toBeVisible();

    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByLabel("نام")).toBeVisible();
    await expect(page.getByRole("button", { name: "ارسال درخواست" })).toBeVisible();
  });

  test("FAQ accordion expands on click", async ({ page }) => {
    await page.goto("/#faq");

    const question = page.getByRole("button", {
      name: "زمان تحویل MVP چقدر است؟",
    });
    await question.click();

    await expect(page.getByText(/۲ تا ۶ هفته/)).toBeVisible();
  });
});
