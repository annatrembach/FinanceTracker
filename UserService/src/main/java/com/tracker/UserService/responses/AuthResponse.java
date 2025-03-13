package com.tracker.UserService.responses;

import org.apache.kafka.common.protocol.types.Field;

public class AuthResponse {
    private String jwt;
    private String message;
    private Boolean status;

    //Getters and Setters
    public String getJwt() {
        return jwt;
    }
    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getStatus() {
        return status;
    }
    public void setStatus(Boolean status) {
        this.status = status;
    }
}
