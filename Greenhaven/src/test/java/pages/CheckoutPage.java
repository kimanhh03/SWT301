package pages;

import Base.BasePage;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class CheckoutPage extends BasePage {

    public CheckoutPage(WebDriver driver) {
        super(driver);
    }

    private By nameField    = By.cssSelector("[data-testid='shipping-name']");
    private By phoneField   = By.cssSelector("[data-testid='shipping-phone']");
    private By addressField = By.cssSelector("[data-testid='shipping-address']");
    private By citySelect   = By.cssSelector("select#select-city");
    private By placeOrder   = By.cssSelector("[data-testid='place-order']");

    public void open() {
        navigateTo("http://localhost:5173/checkout");
    }

    public void fillName(String name) {
        type(nameField, name);
    }

    public void fillPhone(String phone) {
        type(phoneField, phone);
    }

    public void fillAddress(String address) {
        type(addressField, address);
    }

    public void selectCity(String city) {
        try {
            Select select = new Select(driver.findElement(citySelect));
            select.selectByVisibleText(city);
        } catch (Exception e) {
            try {
                Select select = new Select(driver.findElement(citySelect));
                select.selectByIndex(1);
            } catch (Exception ignored) {}
        }
    }

    public void fillShippingInfo(String name, String phone, String address) {
        fillName(name);
        fillPhone(phone);
        fillAddress(address);
        selectCity("Hà Nội");
    }

    public void clickPlaceOrder() {
        click(placeOrder);
    }

    public void placeOrder(String name, String phone, String address) {
        fillShippingInfo(name, phone, address);
        clickPlaceOrder();
    }
}