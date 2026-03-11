/**
 * FEATURE: Wishlist
 *
 * BUSINESS RULES:
 * BR-WISH-01: Clicking the heart icon on a product adds it to the wishlist.
 * BR-WISH-02: The wishlist badge in the Navbar updates when a product is added.
 * BR-WISH-03: Clicking the heart icon again on a saved product removes it from the wishlist.
 * BR-WISH-04: The wishlist page displays all saved products.
 * BR-WISH-05: Products can be added to the cart directly from the wishlist page.
 * BR-WISH-06: Products can be removed from the wishlist page.
 * BR-WISH-07: Wishlist is empty if no products have been added; an empty state is shown.
 * BR-WISH-08: On the product detail page, the wishlist button toggles to reflect wishlist state.
 */

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";
const EMAIL = `wish_${Date.now()}@test.com`;

async function registerUser(page) {
  await page.goto(`${BASE}/register`);
  await page.fill("#name", "Wish User");
  await page.fill("#email", EMAIL);
  await page.fill("#password", "password123");
  await page.fill("#confirm", "password123");
  await page.click("#btn-register");
  await expect(page).toHaveURL(BASE + "/");
}

test.describe("Wishlist", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // BR-WISH-07
  test("TC-WISH-01: Wishlist page shows empty state when no products are saved", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/wishlist`);
    await expect(page.locator("[data-testid='empty-wishlist']")).toBeVisible();
  });

  // BR-WISH-01 + BR-WISH-02
  test("TC-WISH-02: Adding a product to wishlist updates Navbar badge", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='wishlist-btn-1']").click();
    await expect(page.locator("[data-testid='nav-wishlist'] .badge-count")).toBeVisible();
    await expect(page.locator("[data-testid='nav-wishlist'] .badge-count")).toHaveText("1");
  });

  // BR-WISH-04
  test("TC-WISH-03: Wishlist page shows the product that was added", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='wishlist-btn-1']").click();
    await page.goto(`${BASE}/wishlist`);
    await expect(page.locator("[data-testid='wishlist-item-1']")).toBeVisible();
  });

  // BR-WISH-03
  test("TC-WISH-04: Clicking wishlist button again removes product from wishlist", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='wishlist-btn-1']").click();
    await page.locator("[data-testid='wishlist-btn-1']").click();
    const badge = page.locator("[data-testid='nav-wishlist'] .badge-count");
    await expect(badge).not.toBeVisible();
  });

  // BR-WISH-05
  test("TC-WISH-05: Adding a product from wishlist page updates cart count", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='wishlist-btn-1']").click();
    await page.goto(`${BASE}/wishlist`);
    await page.locator("[data-testid='wishlist-add-cart-1']").click();
    await expect(page.locator("[data-testid='cart-count']")).toHaveText("1");
  });

  // BR-WISH-06
  test("TC-WISH-06: Removing product from wishlist page removes it from the list", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='wishlist-btn-1']").click();
    await page.goto(`${BASE}/wishlist`);
    await expect(page.locator("[data-testid='wishlist-item-1']")).toBeVisible();
    await page.locator("[data-testid='wishlist-remove-1']").click();
    await expect(page.locator("[data-testid='empty-wishlist']")).toBeVisible();
  });

  // BR-WISH-08
  test("TC-WISH-07: Wishlist button on product detail page toggles state correctly", async ({ page }) => {
    await registerUser(page);
    await page.goto(`${BASE}/product/1`);
    const btn = page.locator("[data-testid='btn-wishlist-detail']");
    await btn.click();
    await expect(btn).toHaveClass(/active/);
    await btn.click();
    await expect(btn).not.toHaveClass(/active/);
  });

});
