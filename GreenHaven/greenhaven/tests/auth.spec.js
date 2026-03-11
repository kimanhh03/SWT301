/**
 * FEATURE: Authentication (Login & Register)
 *
 * BUSINESS RULES:
 * BR-AUTH-01: User must provide a valid email format to register.
 * BR-AUTH-02: Password must be at least 6 characters.
 * BR-AUTH-03: Password confirmation must match the password.
 * BR-AUTH-04: Full name is required for registration.
 * BR-AUTH-05: Email must be unique — duplicate email is rejected.
 * BR-AUTH-06: Successful registration logs the user in automatically.
 * BR-AUTH-07: Login fails when email or password is incorrect.
 * BR-AUTH-08: All login fields must be filled in to submit.
 * BR-AUTH-09: After successful login, user is redirected to the Home page.
 * BR-AUTH-10: Logged-in user's name is displayed in the Navbar.
 */

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";
const UNIQUE_EMAIL = `test_${Date.now()}@example.com`;
const PASSWORD = "123456";
const NAME = "Test User";

test.describe("Authentication", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      localStorage.removeItem("gh_user");
      localStorage.removeItem("auth");
      localStorage.removeItem("gh_users");
    });
  });

  // BR-AUTH-04 + BR-AUTH-01 + BR-AUTH-02
  test("TC-AUTH-01: Register with valid information succeeds", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.fill("#name", NAME);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", PASSWORD);
    await page.click("#btn-register");
    await expect(page).toHaveURL(BASE + "/");
  });

  // BR-AUTH-04
  test("TC-AUTH-02: Register fails when name is empty", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", PASSWORD);
    await page.click("#btn-register");
    await expect(page.locator("[data-testid='register-error']")).toContainText("Vui lòng nhập họ tên!");
  });

  // BR-AUTH-02
  test("TC-AUTH-03: Register fails when password is less than 6 characters", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.fill("#name", NAME);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", "123");
    await page.fill("#confirm", "123");
    await page.click("#btn-register");
    await expect(page.locator("[data-testid='register-error']")).toContainText("ít nhất 6 ký tự");
  });

  // BR-AUTH-03
  test("TC-AUTH-04: Register fails when passwords do not match", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    await page.fill("#name", NAME);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", "wrongpass");
    await page.click("#btn-register");
    await expect(page.locator("[data-testid='register-error']")).toContainText("không khớp");
  });

  // BR-AUTH-05
  test("TC-AUTH-05: Register fails when email is already used", async ({ page }) => {
    await page.goto(`${BASE}/register`);
    // First registration
    await page.fill("#name", NAME);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", PASSWORD);
    await page.click("#btn-register");
    await expect(page).toHaveURL(BASE + "/");

    // Logout and try to register again with same email
    await page.evaluate(() => {
      localStorage.removeItem("gh_user");
      localStorage.removeItem("auth");
    });
    await page.goto(`${BASE}/register`);
    await page.fill("#name", "Another User");
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", PASSWORD);
    await page.click("#btn-register");
    await expect(page.locator("[data-testid='register-error']")).toContainText("đã được đăng ký");
  });

  // BR-AUTH-07
  test("TC-AUTH-06: Login fails with incorrect email or password", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill("#email", "wrong@email.com");
    await page.fill("#password", "wrongpass");
    await page.click("#btn-login");
    await expect(page.locator("[data-testid='login-error']")).toContainText("không chính xác");
  });

  // BR-AUTH-06 + BR-AUTH-09 + BR-AUTH-10
  test("TC-AUTH-07: Login succeeds and redirects to home with user name in navbar", async ({ page }) => {
    // Register first
    await page.goto(`${BASE}/register`);
    await page.fill("#name", NAME);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.fill("#confirm", PASSWORD);
    await page.click("#btn-register");
    await expect(page).toHaveURL(BASE + "/");

    // Logout
    await page.evaluate(() => { localStorage.removeItem("gh_user"); localStorage.removeItem("auth"); });
    await page.reload();

    // Login
    await page.goto(`${BASE}/login`);
    await page.fill("#email", UNIQUE_EMAIL);
    await page.fill("#password", PASSWORD);
    await page.click("#btn-login");
    await expect(page).toHaveURL(BASE + "/");
    await expect(page.locator("#nav-user-btn")).toContainText(NAME);
  });

});
