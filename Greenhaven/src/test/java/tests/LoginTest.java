package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import pages.LoginPage;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTest extends BaseTest {

    static LoginPage loginPage;
    static WebDriverWait wait;

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    @BeforeAll
    static void init() {
        loginPage = new LoginPage(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @BeforeEach
    void prepareDB() throws Exception {
        resetDatabase();
        seedUser("Kim Anh", "kimanh@email.com", "123456");
        sleep(1000);
    }

    @Test
    @Order(1)
    void testLoginEmptyFields() {
        loginPage.openLoginPage();
        sleep(1500);

        loginPage.login("", "");
        sleep(2000);

        assertTrue(driver.getCurrentUrl().contains("login"),
                "Should stay on login page when fields are empty.");
    }

    @Test
    @Order(2)
    void testLoginInvalidCredential() {
        loginPage.openLoginPage();
        sleep(1500);

        loginPage.login("kimanh@email.com", "wrongpassword");
        sleep(1000);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                loginPage.errorMessage
        ));
        sleep(2000);

        String msg = loginPage.getErrorMessage();
        System.out.println("Error: " + msg);
        assertTrue(msg.contains("không chính xác"),

                "The system displays an error message when credentials are invalid.");

    }

    @Test
    @Order(3)
    void testLoginSuccess() {
        loginPage.openLoginPage();
        sleep(1500);

        loginPage.login("kimanh@email.com", "123456");
        sleep(1000);

        wait.until(ExpectedConditions.not(
                ExpectedConditions.urlContains("login")
        ));
        sleep(2000);

        assertFalse(driver.getCurrentUrl().contains("login"),
                "Should redirect to home page after successful login.");
    }
}