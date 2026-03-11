package pages;

import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.*;

import java.time.Duration;

public class BasePage {

    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver){

        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    protected WebElement waitForElement(By locator){

        return wait.until(ExpectedConditions.presenceOfElementLocated(locator));
    }

    protected void click(By locator){

        waitForElement(locator).click();
    }

    protected void type(By locator, String text){

        WebElement element = waitForElement(locator);
        element.clear();
        element.sendKeys(text);
    }

    protected String getText(By locator){

        return waitForElement(locator).getText();
    }

    public void navigateTo(String url){

        driver.get(url);
    }
}