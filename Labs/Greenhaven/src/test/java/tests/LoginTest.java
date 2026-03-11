package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import pages.LoginPage;

public class LoginTest extends BaseTest {

    static LoginPage loginPage;

    @BeforeAll
    static void init(){

        loginPage = new LoginPage(driver);
    }

    @Test
    void testLogin(){

        loginPage.openLoginPage();

        loginPage.login(
                "test@email.com",
                "123456"
        );
    }
}