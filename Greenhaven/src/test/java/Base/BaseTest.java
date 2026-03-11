package Base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BaseTest {

    protected static WebDriver driver;
    private static final String API = "http://localhost:3001";

    @BeforeAll
    static void setup() throws Exception {
        resetDatabase();
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) driver.quit();
    }

    protected static void resetDatabase() throws Exception {
        HttpClient client = HttpClient.newHttpClient();

        HttpResponse<String> res = client.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(API + "/users"))
                        .GET().build(),
                HttpResponse.BodyHandlers.ofString()
        );

        System.out.println("Users before reset: " + res.body());

        Pattern p = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"");
        Matcher m = p.matcher(res.body());
        while (m.find()) {
            String id = m.group(1);
            HttpResponse<String> delRes = client.send(
                    HttpRequest.newBuilder()
                            .uri(URI.create(API + "/users/" + id))
                            .DELETE().build(),
                    HttpResponse.BodyHandlers.ofString()
            );
            System.out.println("Deleted user id=" + id + " | status=" + delRes.statusCode());
        }

        deleteAll(client, "/cart");
        deleteAll(client, "/wishlist");
        deleteAll(client, "/orders");
        deleteAll(client, "/reviews");

        Thread.sleep(500);

        HttpResponse<String> verify = client.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(API + "/users"))
                        .GET().build(),
                HttpResponse.BodyHandlers.ofString()
        );
        System.out.println("Users after reset: " + verify.body());
    }

    private static void deleteAll(HttpClient client, String endpoint) throws Exception {
        HttpResponse<String> res = client.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(API + endpoint))
                        .GET().build(),
                HttpResponse.BodyHandlers.ofString()
        );

        Pattern p = Pattern.compile("\"id\"\\s*:\\s*\"([^\"]+)\"");
        Matcher m = p.matcher(res.body());
        while (m.find()) {
            String id = m.group(1);
            client.send(
                    HttpRequest.newBuilder()
                            .uri(URI.create(API + endpoint + "/" + id))
                            .DELETE().build(),
                    HttpResponse.BodyHandlers.ofString()
            );
        }
    }

    protected static void seedUser(String name, String email, String password) throws Exception {
        String body = String.format(
                "{\"name\":\"%s\",\"email\":\"%s\",\"password\":\"%s\",\"createdAt\":\"%s\"}",
                name, email, password, java.time.Instant.now().toString()
        );
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(
                HttpRequest.newBuilder()
                        .uri(URI.create(API + "/users"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(body))
                        .build(),
                HttpResponse.BodyHandlers.ofString()
        );
        System.out.println("SeedUser status: " + response.statusCode());
        System.out.println("SeedUser body: " + response.body());
        Thread.sleep(500);
    }
}