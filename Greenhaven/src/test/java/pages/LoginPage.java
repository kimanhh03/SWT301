package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    public LoginPage(WebDriver driver){
        super(driver);
    }

    private By email        = By.cssSelector("[data-testid='input-email']");
    private By password     = By.cssSelector("[data-testid='input-password']");
    private By loginBtn     = By.cssSelector("[data-testid='btn-login']");
    public  By errorMessage = By.cssSelector("[data-testid='login-error']");

    public void open(){
        navigateTo("http://localhost:5173/login");
    }

    public void openLoginPage(){
        open();
    }

    public void login(String user, String pass){
        type(email, user);
        type(password, pass);

        System.out.println("Email value: '" + driver.findElement(email).getAttribute("value") + "'");
        System.out.println("Password value: '" + driver.findElement(password).getAttribute("value") + "'");

        click(loginBtn);
    }

    public String getErrorMessage(){
        return getText(errorMessage);
    }
}