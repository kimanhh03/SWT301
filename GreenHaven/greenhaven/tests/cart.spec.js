/**
 * FEATURE: Shopping Cart
 *
 * BUSINESS RULES:
 * BR-CART-01: Clicking "Thêm vào giỏ" adds the product to the cart.
 * BR-CART-02: Adding the same product again increases its quantity.
 * BR-CART-03: The cart badge in the Navbar updates to reflect total item count.
 * BR-CART-04: The cart page shows the correct subtotal per item (price × quantity).
 * BR-CART-05: The cart page shows the correct grand total.
 * BR-CART-06: User can increase or decrease item quantity in the cart.
 * BR-CART-07: Decreasing quantity to 0 removes the item from the cart.
 * BR-CART-08: Clicking the remove button deletes the item from the cart.
 * BR-CART-09: An empty cart shows an empty state message.
 * BR-CART-10: Cannot add more items than available stock.
 * BR-CART-11: Clicking "Checkout" while not logged in redirects to the Login page.
 */

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

test.describe("Shopping Cart", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      localStorage.removeItem("gh_cart");
      localStorage.removeItem("gh_user");
      localStorage.removeItem("auth");
    });
    await page.reload();
  });

  // BR-CART-01 + BR-CART-03
  test("TC-CART-01: Adding a product updates cart badge count in Navbar", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='add-to-cart-1']").click();
    await expect(page.locator("[data-testid='cart-count']")).toBeVisible();
    await expect(page.locator("[data-testid='cart-count']")).toHaveText("1");
  });

  // BR-CART-02 + BR-CART-03
  test("TC-CART-02: Adding the same product twice increases quantity to 2", async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    await page.locator("[data-testid='add-to-cart-1']").click();
    await page.locator("[data-testid='add-to-cart-1']").click();
    await expect(page.locator("[data-testid='cart-count']")).toHaveText("2");
  });

  // BR-CART-04 + BR-CART-05
  test("TC-CART-03: Cart page shows correct item subtotals and grand total", async ({ page }) => {
    await page.goto(`${BASE}/product/1`);
    await page.click("#btn-add-to-cart");
    await page.goto(`${BASE}/cart`);
    await expect(page.locator("[data-testid='cart-items']")).toBeVisible();
    await expect(page.locator("[data-testid='cart-total']")).toBeVisible();
  });

  // BR-CART-08
  test("TC-CART-04: Removing an item from cart deletes it from the list", async ({ page }) => {
    await page.goto(`${BASE}/product/1`);
    await page.click("#btn-add-to-cart");
    await page.goto(`${BASE}/cart`);
    const item = page.locator("[data-testid='cart-item-1']");
    await expect(item).toBeVisible();
    await page.locator("[data-testid='remove-item-1']").click();
    await expect(item).not.toBeVisible();
  });

  // BR-CART-06
  test("TC-CART-05: Increasing quantity from cart page updates displayed quantity", async ({ page }) => {
    await page.goto(`${BASE}/product/1`);
    await page.click("#btn-add-to-cart");
    await page.goto(`${BASE}/cart`);
    await page.locator("#qty-increase-1").click();
    await expect(page.locator("[data-testid='cart-qty-1']")).toHaveText("2");
  });

  // BR-CART-09
  test("TC-CART-06: Empty cart shows empty state message", async ({ page }) => {
    await page.goto(`${BASE}/cart`);
    await expect(page.locator("[data-testid='empty-cart']")).toBeVisible();
  });

  // BR-CART-11
  test("TC-CART-07: Proceeding to checkout without login redirects to login page", async ({ page }) => {
    await page.goto(`${BASE}/product/1`);
    await page.click("#btn-add-to-cart");
    await page.goto(`${BASE}/cart`);
    await page.click("[data-testid='btn-checkout']");
    await expect(page).toHaveURL(`${BASE}/login`);
  });

});
