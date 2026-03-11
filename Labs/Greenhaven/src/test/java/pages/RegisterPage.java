package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class RegisterPage extends BasePage {

    public RegisterPage(WebDriver driver){
        super(driver);
    }

    private By fullName = By.cssSelector("input[placeholder='Jane Doe']");
    private By email = By.cssSelector("input[type='email']");
    private By password = By.cssSelector("input[type='password']");
    private By registerButton = By.xpath("//button[contains(text(),'Create Account')]");

    public void openRegisterPage(){
        navigateTo("http://localhost:5173/register");
    }

    public void register(String name,String mail,String pass){

        type(fullName,name);
        type(email,mail);
        type(password,pass);

        click(registerButton);
    }
}