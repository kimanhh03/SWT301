package tests;

import Base.BaseTest;
import org.junit.jupiter.api.*;
import pages.RegisterPage;

public class RegisterTest extends BaseTest {

    static RegisterPage registerPage;

    @BeforeAll
    static void init(){

        registerPage = new RegisterPage(driver);
    }

    @Test
    void testRegister(){

        registerPage.openRegisterPage();

        registerPage.register(
                "newuser",
                "newuser@email.com",
                "123456"
        );
    }
}