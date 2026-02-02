public class InsuranceClaim {

    private String claimId;
    private double amount;
    private String claimStatus;

    private static final double PAYOUT_RATE = 0.85;

    public InsuranceClaim(String id, double claimAmount) {
        this.claimId = id;
        this.amount = claimAmount;
        this.claimStatus = "Pending";
    }

    public boolean processClaim(String statusUpdate) {
        if ("Pending".equals(claimStatus)) {
            claimStatus = statusUpdate;
            return true;
        }
        return false;
    }

    public double calculatePayout() {
        if ("Approved".equals(claimStatus)) {
            return amount * PAYOUT_RATE;
        }
        return 0;
    }

    public void updateClaimAmount(double newAmount) {
        if (newAmount > 0) {
            amount = newAmount;
        }
    }
}
