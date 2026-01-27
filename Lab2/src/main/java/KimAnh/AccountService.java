package KimAnh;

import java.util.regex.Pattern;

public class AccountService {

    // Kiểm tra email hợp lệ
    public boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }

        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
        return Pattern.matches(emailRegex, email);
    }

    // Kiểm tra password theo business rules
    private boolean isValidPassword(String password) {
        if (password == null || password.length() <= 6) {
            return false;
        }

        boolean hasUpperCase = false;
        boolean hasLowerCase = false;
        boolean hasSpecialChar = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) {
                hasUpperCase = true;
            } else if (Character.isLowerCase(c)) {
                hasLowerCase = true;
            } else if (!Character.isLetterOrDigit(c)) {
                hasSpecialChar = true;
            }
        }

        return hasUpperCase && hasLowerCase && hasSpecialChar;
    }

    // Đăng ký tài khoản
    public boolean registerAccount(Account account) {
        if (account == null) {
            return false;
        }

        // kiểm tra username
        if (account.getUsername() == null || account.getUsername().length() < 3) {
            return false;
        }

        // kiểm tra password
        if (!isValidPassword(account.getPassword())) {
            return false;
        }

        // kiểm tra email
        if (!isValidEmail(account.getEmail())) {
            return false;
        }

        return true;
    }
}
