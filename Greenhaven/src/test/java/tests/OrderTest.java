package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import pages.CartPage;
import pages.CheckoutPage;
import pages.HomePage;
import pages.LoginPage;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrderTest extends BaseTest {

    static HomePage homePage;
    static CartPage cartPage;
    static LoginPage loginPage;
    static CheckoutPage checkoutPage;
    static WebDriverWait wait;

    private static final String EMAIL    = "test@gmail.com";
    private static final String PASSWORD = "123456";
    private static final String NAME     = "Test User";
    private static final String PHONE    = "0901234567";
    private static final String ADDRESS  = "123 Đường ABC, Phường XYZ";
    private static final String CITY     = "Hà Nội";

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    @BeforeAll
    static void init() {
        homePage     = new HomePage(driver);
        cartPage     = new CartPage(driver);
        loginPage    = new LoginPage(driver);
        checkoutPage = new CheckoutPage(driver);
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

    private void loginAndAddToCart() {
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

        homePage.addFirstProductToCart();
        sleep(1500);
    }

    private void fillAndSubmitCheckout() {
        checkoutPage.open();
        sleep(1500);

        checkoutPage.fillName(NAME);
        sleep(500);
        checkoutPage.fillPhone(PHONE);
        sleep(500);
        checkoutPage.fillAddress(ADDRESS);
        sleep(500);
        checkoutPage.selectCity(CITY);
        sleep(500);
        checkoutPage.clickPlaceOrder();
        sleep(1000);
    }

    @Test
    @Order(1)
    void testCheckoutWithEmptyCart() {
        loginPage.open();
        sleep(1500);

        loginPage.login(EMAIL, PASSWORD);
        wait.until(ExpectedConditions.not(
                ExpectedConditions.urlContains("login")
        ));
        sleep(1500);

        checkoutPage.open();
        sleep(2000);

        String url = driver.getCurrentUrl();
        System.out.println("URL after empty cart checkout: " + url);

        if (url.contains("checkout")) {
            checkoutPage.fillName(NAME);
            sleep(500);
            checkoutPage.fillPhone(PHONE);
            sleep(500);
            checkoutPage.fillAddress(ADDRESS);
            sleep(500);
            checkoutPage.selectCity(CITY);
            sleep(500);
            checkoutPage.clickPlaceOrder();
            sleep(2000);

            assertFalse(driver.getCurrentUrl().contains("order-success"),
                    "Không được đặt hàng khi giỏ hàng trống");
        } else {
            assertFalse(url.contains("order-success"),
                    "Không được vào trang order-success khi giỏ hàng trống");
        }
    }

    @Test
    @Order(2)
    void testCheckoutMissingName() {
        loginAndAddToCart();

        checkoutPage.open();
        sleep(1500);

        checkoutPage.fillPhone(PHONE);
        sleep(500);
        checkoutPage.fillAddress(ADDRESS);
        sleep(500);
        checkoutPage.selectCity(CITY);
        sleep(500);
        checkoutPage.clickPlaceOrder();
        sleep(2000);

        assertFalse(driver.getCurrentUrl().contains("order-success"),
                "Không được đặt hàng khi thiếu tên");
    }

    @Test
    @Order(3)
    void testCheckoutMissingPhone() {
        loginAndAddToCart();

        checkoutPage.open();
        sleep(1500);

        checkoutPage.fillName(NAME);
        sleep(500);
        checkoutPage.fillAddress(ADDRESS);
        sleep(500);
        checkoutPage.selectCity(CITY);
        sleep(500);
        checkoutPage.clickPlaceOrder();
        sleep(2000);

        assertFalse(driver.getCurrentUrl().contains("order-success"),
                "Không được đặt hàng khi thiếu SĐT");
    }

    @Test
    @Order(4)
    void testCheckoutMissingAddress() {
        loginAndAddToCart();

        checkoutPage.open();
        sleep(1500);

        checkoutPage.fillName(NAME);
        sleep(500);
        checkoutPage.fillPhone(PHONE);
        sleep(500);
        checkoutPage.selectCity(CITY);
        sleep(500);
        checkoutPage.clickPlaceOrder();
        sleep(2000);

        assertFalse(driver.getCurrentUrl().contains("order-success"),
                "Không được đặt hàng khi thiếu địa chỉ");
    }

    @Test
    @Order(5)
    void testOrderSuccessPageHasOrderId() {
        loginAndAddToCart();
        fillAndSubmitCheckout();

        wait.until(ExpectedConditions.urlContains("order-success"));
        sleep(2000);

        String url = driver.getCurrentUrl();
        System.out.println("Order success URL: " + url);

        assertTrue(url.contains("order-success"),
                "Phải redirect đến trang order-success");

        assertTrue(url.matches(".*order-success/[a-zA-Z0-9]+$"),
                "URL phải có dạng /order-success/{orderId}");

        String orderId = url.substring(url.lastIndexOf("/") + 1);
        assertFalse(orderId.isEmpty(), "Mã đơn hàng không được rỗng");
        assertTrue(orderId.length() >= 4, "Mã đơn hàng phải có ít nhất 4 ký tự");
        System.out.println("Order ID verified: " + orderId);
    }

    @Test
    @Order(6)
    void testCartClearedAfterOrder() {
        loginAndAddToCart();
        fillAndSubmitCheckout();

        wait.until(ExpectedConditions.urlContains("order-success"));
        sleep(2000);

        driver.get("http://localhost:5173/cart");
        sleep(2000);

        assertFalse(cartPage.isItemVisible(),
                "Giỏ hàng phải trống sau khi đặt hàng thành công");
    }
}