package tests;

import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import pages.LoginPage;
import utils.DriverFactory;

import java.time.Duration;

import static org.junit.jupiter.api.Assertions.assertTrue;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class LoginTest {

    static WebDriver driver;
    static WebDriverWait wait;
    static LoginPage loginPage;

    @BeforeAll
    static void setUp(){

        driver = DriverFactory.createDriver();

        wait = new WebDriverWait(driver, Duration.ofSeconds(10));

        driver.manage().window().maximize();

        loginPage = new LoginPage(driver);
    }

    @Test
    @Order(1)
    void testLoginSuccess(){

        loginPage.navigate();

        loginPage.login("tomsmith","SuperSecretPassword!");

        WebElement success = wait.until(
                ExpectedConditions.visibilityOfElementLocated(loginPage.getSuccessLocator())
        );

        assertTrue(success.getText().contains("You logged into a secure area!"));
    }

    @Test
    @Order(2)
    void testLoginFail(){

        loginPage.navigate();

        loginPage.login("wronguser","wrongpassword");

        WebElement error = wait.until(
                ExpectedConditions.visibilityOfElementLocated(loginPage.getErrorLocator())
        );

        assertTrue(error.getText().toLowerCase().contains("invalid"));
    }

    @AfterAll
    static void tearDown(){
        driver.quit();
    }
}