package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

    WebDriver driver;

    public LoginPage(WebDriver driver){
        this.driver = driver;
    }

    private By usernameField = By.id("username");
    private By passwordField = By.id("password");
    private By loginButton = By.cssSelector("button[type='submit']");
    private By successMsg = By.cssSelector(".flash.success");
    private By errorMsg = By.cssSelector(".flash.error");

    public void navigate(){
        driver.get("https://the-internet.herokuapp.com/login");
    }

    public void login(String username, String password){
        driver.findElement(usernameField).sendKeys(username);
        driver.findElement(passwordField).sendKeys(password);
        driver.findElement(loginButton).click();
    }

    public By getSuccessLocator(){
        return successMsg;
    }

    public By getErrorLocator(){
        return errorMsg;
    }
}