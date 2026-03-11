package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import pages.RegisterPage;

import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class RegisterTest extends BaseTest {

    static RegisterPage registerPage;
    static WebDriverWait wait;

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }

    @BeforeAll
    static void init(){
        registerPage = new RegisterPage(driver);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    @BeforeEach
    void resetDB() throws Exception {
        resetDatabase();
        sleep(1000);
    }

    @Test
    @Order(1)
    void testPasswordTooShort(){
        registerPage.openRegisterPage();
        sleep(1500);

        registerPage.register("Kim Anh", "kimanh123@email.com", "123");
        sleep(1000);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                registerPage.errorMessage
        ));
        sleep(2000);

        String msg = registerPage.getErrorMessage();
        System.out.println("Error: " + msg);
        assertTrue(msg.contains("6 ký tự"),
                "The system displays an error message indicating password must be at least 6 characters.");
    }

    @Test
    @Order(2)
    void testRegisterDuplicateEmail() throws Exception {
        seedUser("Kim Anh", "kimanh@email.com", "123456");
        sleep(1000); // Chờ seed xong

        registerPage.openRegisterPage();
        sleep(1500);

        registerPage.register("Kim Anh", "kimanh@email.com", "123456");
        sleep(1000);

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                registerPage.errorMessage
        ));
        sleep(2000);

        String msg = registerPage.getErrorMessage();
        System.out.println("Error: " + msg);
        assertTrue(msg.contains("đã được đăng ký"),
                "The system displays an error message indicating that the email already exists.");
    }

    @Test
    @Order(3)
    void testRegisterSuccess(){
        registerPage.openRegisterPage();
        sleep(1500);

        registerPage.register("Kim Anh", "kimanh@email.com", "123456");
        sleep(1000);

        wait.until(ExpectedConditions.urlContains("login"));
        sleep(2000);

        assertTrue(driver.getCurrentUrl().contains("login"),
                "Should redirect to login page after successful registration.");
    }
}