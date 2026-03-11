package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage extends BasePage {

    public LoginPage(WebDriver driver){
        super(driver);
    }

    private By email = By.cssSelector("input[type='email']");
    private By password = By.cssSelector("input[type='password']");
    private By loginButton = By.xpath("//button[contains(text(),'Login')]");

    public void openLoginPage(){

        navigateTo("http://localhost:5173/login");
    }

    public void login(String user,String pass){

        type(email,user);
        type(password,pass);
        click(loginButton);
    }
}