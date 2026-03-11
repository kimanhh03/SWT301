package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class HomePage extends BasePage {

    public HomePage(WebDriver driver){
        super(driver);
    }

    By addToCartButton =
            By.cssSelector("button[data-testid^='add-to-cart']:not([disabled])");

    By outOfStockButton =
            By.cssSelector("button[data-testid^='add-to-cart'][disabled]");

    By cartLink = By.cssSelector("[data-testid='cart-link']");

    public void open(){
        navigateTo("http://localhost:5173");
    }

    public void addFirstProductToCart(){
        click(addToCartButton);
    }

    public boolean isOutOfStockDisabled(){
        return driver.findElements(outOfStockButton).size() > 0;
    }

    public void goToCart(){
        click(cartLink);
    }
}