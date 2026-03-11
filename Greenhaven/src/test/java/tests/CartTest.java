package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.CartPage;
import pages.HomePage;
import pages.LoginPage;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

public class CartTest extends BaseTest {

    static HomePage homePage;
    static CartPage cartPage;
    static LoginPage loginPage;
    static WebDriverWait wait;

    private static final String EMAIL    = "test@gmail.com";
    private static final String PASSWORD = "123456";

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    @BeforeAll
    static void init(){
        homePage  = new HomePage(driver);
        cartPage  = new CartPage(driver);
        loginPage = new LoginPage(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @BeforeEach
    void prepareDB() throws Exception {
        try {
            driver.get("http://localhost:5173");
            ((JavascriptExecutor) driver).executeScript("localStorage.clear();");
        } catch (Exception ignored) {}

        resetDatabase();
        seedUser("Test User", EMAIL, PASSWORD);
        sleep(1000);
    }

    private void loginAndGoHome(){
        loginPage.open();
        sleep(1500);

        loginPage.login(EMAIL, PASSWORD);
        wait.until(ExpectedConditions.not(
                ExpectedConditions.urlContains("login")
        ));
        sleep(1500);

        homePage.open();
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("button[data-testid^='add-to-cart']")
        ));
        sleep(1000);
    }

    private void goToCart(){
        cartPage.open();
        sleep(1500);
    }

    @Test
    void testAddToCartWithoutLogin(){
        homePage.open();
        sleep(1500);

        homePage.addFirstProductToCart();
        sleep(1000);

        wait.until(ExpectedConditions.urlContains("login"));
        sleep(2000);
        assertTrue(driver.getCurrentUrl().contains("login"));
    }

    @Test
    void testOutOfStockButtonDisabled(){
        homePage.open();
        sleep(1500);

        assertTrue(homePage.isOutOfStockDisabled());
        sleep(1000);
    }

    @Test
    void testAddToCartAfterLogin(){
        loginAndGoHome();

        homePage.addFirstProductToCart();
        sleep(1500);

        goToCart();
        sleep(1000);

        assertTrue(cartPage.isItemVisible(), "Item phải hiển thị trong cart");
    }

    @Test
    void testAddSameProductIncreaseQuantity(){
        loginAndGoHome();

        homePage.addFirstProductToCart();
        sleep(1500);

        homePage.open();
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.cssSelector("button[data-testid^='add-to-cart']")
        ));
        sleep(1000);

        homePage.addFirstProductToCart();
        sleep(1500);

        goToCart();
        sleep(1000);

        assertTrue(cartPage.getQuantity() >= 2, "Quantity phải >= 2");
    }

    @Test
    void testRemoveProductWhenQuantityZero(){
        loginAndGoHome();

        homePage.addFirstProductToCart();
        sleep(1500);

        goToCart();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='cart-item']")
        ));
        sleep(1000);

        cartPage.decreaseQuantity();
        sleep(1500);

        assertFalse(cartPage.isItemVisible(), "Item phải biến mất khi quantity về 0");
    }

    @Test
    void testQuantityCannotExceedStock(){
        loginAndGoHome();

        homePage.addFirstProductToCart();
        sleep(1500);

        goToCart();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='cart-item']")
        ));
        sleep(1000);

        for(int i = 0; i < 10; i++){
            cartPage.increaseQuantity();
            sleep(500);
        }

        sleep(1000);
        int qty = cartPage.getQuantity();
        System.out.println("Final quantity: " + qty);
        assertTrue(qty <= 5, "Quantity không được vượt quá stock (5)");
    }

    @Test
    void testIncreaseQuantityWithinStock(){
        loginAndGoHome();

        homePage.addFirstProductToCart();
        sleep(1500);

        goToCart();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.cssSelector("[data-testid='cart-item']")
        ));
        sleep(1000);

        int before = cartPage.getQuantity();
        cartPage.increaseQuantity();
        sleep(1500);

        int after = cartPage.getQuantity();
        System.out.println("Before: " + before + " | After: " + after);
        assertTrue(after > before, "Quantity phải tăng sau khi click increase");
    }
}