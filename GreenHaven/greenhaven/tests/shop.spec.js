/**
 * FEATURE: Shop – Product Browsing, Search, Filter, Sort
 *
 * BUSINESS RULES:
 * BR-SHOP-01: The shop page displays all products by default.
 * BR-SHOP-02: Searching by name filters products in real-time.
 * BR-SHOP-03: Filtering by category shows only products of that category.
 * BR-SHOP-04: Selecting "All" category resets the category filter.
 * BR-SHOP-05: Sorting by "Giá tăng dần" lists products from lowest to highest price.
 * BR-SHOP-06: Sorting by "Giá giảm dần" lists products from highest to lowest price.
 * BR-SHOP-07: If no products match the search/filter, an empty state message is shown.
 * BR-SHOP-08: Product cards display name, price, rating, and category.
 * BR-SHOP-09: Clicking a product card navigates to the product detail page.
 * BR-SHOP-10: Out-of-stock products show a "Hết hàng" badge; the Add-to-Cart button is disabled.
 */

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

test.describe("Shop – Browsing, Search, Filter, Sort", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/shop`);
    await expect(page.locator("[data-testid='product-grid']")).toBeVisible();
  });

  // BR-SHOP-01
  test("TC-SHOP-01: Shop page shows all products by default", async ({ page }) => {
    const cards = page.locator(".product-card");
    await expect(cards).toHaveCount(12);
  });

  // BR-SHOP-02
  test("TC-SHOP-02: Searching by name filters products", async ({ page }) => {
    await page.fill("[data-testid='search-input']", "Aloe");
    await expect(page.locator(".product-card")).toHaveCount(2);
  });

  // BR-SHOP-07
  test("TC-SHOP-03: Searching a non-existent name shows empty state", async ({ page }) => {
    await page.fill("[data-testid='search-input']", "xyznonexistentproduct");
    await expect(page.locator("[data-testid='no-results']")).toBeVisible();
  });

  // BR-SHOP-03
  test("TC-SHOP-04: Filtering by 'Echeveria' shows only Echeveria products", async ({ page }) => {
    await page.click("[data-testid='filter-Echeveria']");
    const cards = page.locator(".product-card");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    // All visible product categories should be Echeveria
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator(".product-category")).toContainText("Echeveria");
    }
  });

  // BR-SHOP-04
  test("TC-SHOP-05: Selecting 'All' category resets the filter to all products", async ({ page }) => {
    await page.click("[data-testid='filter-Cactus']");
    await expect(page.locator(".product-card")).not.toHaveCount(12);
    await page.click("[data-testid='filter-All']");
    await expect(page.locator(".product-card")).toHaveCount(12);
  });

  // BR-SHOP-05
  test("TC-SHOP-06: Sort by price ascending orders products lowest to highest", async ({ page }) => {
    await page.selectOption("[data-testid='sort-select']", "price-asc");
    const prices = await page.locator(".product-price").allTextContents();
    const nums = prices.map(p => parseInt(p.replace(/\D/g, ""), 10));
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeGreaterThanOrEqual(nums[i - 1]);
    }
  });

  // BR-SHOP-06
  test("TC-SHOP-07: Sort by price descending orders products highest to lowest", async ({ page }) => {
    await page.selectOption("[data-testid='sort-select']", "price-desc");
    const prices = await page.locator(".product-price").allTextContents();
    const nums = prices.map(p => parseInt(p.replace(/\D/g, ""), 10));
    for (let i = 1; i < nums.length; i++) {
      expect(nums[i]).toBeLessThanOrEqual(nums[i - 1]);
    }
  });

  // BR-SHOP-09
  test("TC-SHOP-08: Clicking product card navigates to product detail page", async ({ page }) => {
    await page.locator(".product-card").first().locator(".product-title").click();
    await expect(page).toHaveURL(/\/product\/\d+/);
    await expect(page.locator("#product-name")).toBeVisible();
  });

  // BR-SHOP-08
  test("TC-SHOP-09: Product cards show name, price, and rating", async ({ page }) => {
    const firstCard = page.locator(".product-card").first();
    await expect(firstCard.locator(".product-title")).toBeVisible();
    await expect(firstCard.locator(".product-price")).toBeVisible();
    await expect(firstCard.locator(".product-rating")).toBeVisible();
  });

});
