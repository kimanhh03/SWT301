package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage extends BasePage {

    public RegisterPage(WebDriver driver){
        super(driver);
    }

    private By fullname        = By.cssSelector("[data-testid='input-name']");
    private By email           = By.cssSelector("[data-testid='input-email']");
    private By password        = By.cssSelector("[data-testid='input-password']");
    private By confirmPassword = By.cssSelector("[data-testid='input-confirm']");
    private By registerBtn     = By.cssSelector("[data-testid='btn-register']");
    public  By errorMessage    = By.cssSelector("[data-testid='register-error']");

    public void openRegisterPage(){
        navigateTo("http://localhost:5173/register");
    }

    public void register(String name, String mail, String pass){
        type(fullname, name);
        type(email, mail);
        type(password, pass);
        type(confirmPassword, pass);
        click(registerBtn);
    }

    public String getErrorMessage(){
        return getText(errorMessage);
    }
}