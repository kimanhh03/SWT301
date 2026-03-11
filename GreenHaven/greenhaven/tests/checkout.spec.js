/**
 * FEATURE: Checkout & Order Placement
 *
 * BUSINESS RULES:
 * BR-CHK-01: Checkout page is only accessible when user is logged in.
 * BR-CHK-02: Full name is required to place an order.
 * BR-CHK-03: Phone number is required and must match the format 0XXXXXXXXX (10 digits).
 * BR-CHK-04: Delivery address is required.
 * BR-CHK-05: City/province selection is required.
 * BR-CHK-06: User can choose between COD and bank transfer payment methods.
 * BR-CHK-07: Placing a valid order clears the cart.
 * BR-CHK-08: After successful order placement, user is redirected to the Order Success page.
 * BR-CHK-09: The Order Success page displays the assigned order ID.
 * BR-CHK-10: Placed orders appear in the Order History page.
 */

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";
const EMAIL = `checkout_${Date.now()}@test.com`;
const PASSWORD = "password123";
const NAME = "Checkout User";

async function registerAndLogin(page) {
  await page.goto(`${BASE}/register`);
  await page.fill("#name", NAME);
  await page.fill("#email", EMAIL);
  await page.fill("#password", PASSWORD);
  await page.fill("#confirm", PASSWORD);
  await page.click("#btn-register");
  await expect(page).toHaveURL(BASE + "/");
}

async function addProductToCart(page, productId = 1) {
  await page.goto(`${BASE}/product/${productId}`);
  await page.click("#btn-add-to-cart");
}

test.describe("Checkout & Order Placement", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  // BR-CHK-02
  test("TC-CHK-01: Checkout form validation fails when name is empty", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-phone']", "0901234567");
    await page.fill("[data-testid='input-address']", "123 Main St");
    await page.selectOption("[data-testid='select-city']", "Hà Nội");
    await page.locator("[data-testid='input-name']").fill("");
    await page.click("[data-testid='btn-place-order']");
    await expect(page.locator("[data-testid='error-name']")).toContainText("Vui lòng nhập họ tên!");
  });

  // BR-CHK-03
  test("TC-CHK-02: Checkout fails with invalid phone number format", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-name']", NAME);
    await page.fill("[data-testid='input-phone']", "12345");
    await page.fill("[data-testid='input-address']", "123 Main St");
    await page.selectOption("[data-testid='select-city']", "Hà Nội");
    await page.click("[data-testid='btn-place-order']");
    await expect(page.locator("[data-testid='error-phone']")).toContainText("không hợp lệ");
  });

  // BR-CHK-04
  test("TC-CHK-03: Checkout fails when delivery address is empty", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-name']", NAME);
    await page.fill("[data-testid='input-phone']", "0901234567");
    await page.selectOption("[data-testid='select-city']", "TP. Hồ Chí Minh");
    await page.click("[data-testid='btn-place-order']");
    await expect(page.locator("[data-testid='error-address']")).toContainText("Vui lòng nhập địa chỉ");
  });

  // BR-CHK-05
  test("TC-CHK-04: Checkout fails when city is not selected", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-name']", NAME);
    await page.fill("[data-testid='input-phone']", "0901234567");
    await page.fill("[data-testid='input-address']", "123 Main St");
    await page.click("[data-testid='btn-place-order']");
    await expect(page.locator("[data-testid='error-city']")).toContainText("Vui lòng chọn");
  });

  // BR-CHK-06
  test("TC-CHK-05: User can select bank transfer payment method", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.click("#payment-transfer");
    await expect(page.locator("#payment-transfer")).toBeChecked();
  });

  // BR-CHK-07 + BR-CHK-08 + BR-CHK-09
  test("TC-CHK-06: Successful order clears cart and shows order success page with order ID", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-name']", NAME);
    await page.fill("[data-testid='input-phone']", "0901234567");
    await page.fill("[data-testid='input-address']", "123 Main St");
    await page.selectOption("[data-testid='select-city']", "Hà Nội");
    await page.click("[data-testid='btn-place-order']");
    await expect(page).toHaveURL(/\/order-success\//);
    await expect(page.locator("[data-testid='order-id']")).toBeVisible();
    // Cart should be cleared
    await expect(page.locator("[data-testid='cart-count']")).not.toBeVisible();
  });

  // BR-CHK-10
  test("TC-CHK-07: Placed orders appear in order history page", async ({ page }) => {
    await registerAndLogin(page);
    await addProductToCart(page);
    await page.goto(`${BASE}/checkout`);
    await page.fill("[data-testid='input-name']", NAME);
    await page.fill("[data-testid='input-phone']", "0901234567");
    await page.fill("[data-testid='input-address']", "456 Test Ave");
    await page.selectOption("[data-testid='select-city']", "Đà Nẵng");
    await page.click("[data-testid='btn-place-order']");
    await expect(page).toHaveURL(/\/order-success\//);
    await page.goto(`${BASE}/orders`);
    await expect(page.locator("[data-testid='orders-list']")).toBeVisible();
    const orders = page.locator(".order-card");
    await expect(orders).toHaveCount(1);
  });

});
