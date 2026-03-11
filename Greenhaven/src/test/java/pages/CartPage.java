package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;

public class CartPage extends BasePage {

    public CartPage(WebDriver driver){
        super(driver);
    }

    By cartItem = By.cssSelector("[data-testid='cart-item']");
    By quantity = By.cssSelector("[data-testid='cart-qty']");
    By increase = By.cssSelector("[data-testid='increase']");
    By decrease = By.cssSelector("[data-testid='decrease']");

    public void open(){
        navigateTo("http://localhost:5173/cart");
    }

    public boolean isItemVisible(){
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(cartItem));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public int getQuantity(){
        return Integer.parseInt(getText(quantity).trim());
    }

    public void increaseQuantity(){
        click(increase);
    }

    public void decreaseQuantity(){
        click(decrease);
    }
}