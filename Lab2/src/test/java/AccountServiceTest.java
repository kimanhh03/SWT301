import static org.junit.jupiter.api.Assertions.assertEquals;

import KimAnh.Account;
import KimAnh.AccountService;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;

public class AccountServiceTest {

    @ParameterizedTest
    @CsvFileSource(
            resources = "/test-data.csv",
            numLinesToSkip = 1
    )
    void testRegisterAccount(String username,
                             String password,
                             String email,
                             boolean expected) {

        Account account = new Account(username, password, email);
        AccountService service = new AccountService();

        boolean actual = service.registerAccount(account);

        assertEquals(expected, actual);
    }
}
