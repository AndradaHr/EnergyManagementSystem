package com.project.User_Microservice.exceptions;

public class UserNotVerifiedException extends Exception {

    private final boolean newEmailSent;

    public UserNotVerifiedException(boolean newEmailSent) {
        this.newEmailSent = newEmailSent;
    }

}
