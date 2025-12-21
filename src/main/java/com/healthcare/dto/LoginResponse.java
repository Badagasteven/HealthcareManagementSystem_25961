package com.healthcare.dto;

public class LoginResponse {
    private String token;
    private boolean mfaRequired;
    private String message;

    public LoginResponse() {
    }

    public LoginResponse(String token) {
        this.token = token;
        this.mfaRequired = false;
        this.message = "Login successful";
    }

    public LoginResponse(boolean mfaRequired, String message) {
        this.mfaRequired = mfaRequired;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isMfaRequired() {
        return mfaRequired;
    }

    public void setMfaRequired(boolean mfaRequired) {
        this.mfaRequired = mfaRequired;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
