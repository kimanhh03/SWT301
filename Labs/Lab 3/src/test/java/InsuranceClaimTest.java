import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

public class InsuranceClaimTest {

    @Test
    void testProcessClaimWhenPending() {
        InsuranceClaim claim = new InsuranceClaim("C001", 1000);
        assertTrue(claim.processClaim("Approved"));
    }

    @Test
    void testCalculatePayoutWhenApproved() {
        InsuranceClaim claim = new InsuranceClaim("C002", 2000);
        claim.processClaim("Approved");
        assertEquals(1700, claim.calculatePayout());
    }

    @Test
    void testUpdateClaimAmountWithInvalidValue() {
        InsuranceClaim claim = new InsuranceClaim("C003", 1500);
        claim.updateClaimAmount(-500);
        claim.processClaim("Approved");
        assertEquals(1275, claim.calculatePayout());
    }
}
