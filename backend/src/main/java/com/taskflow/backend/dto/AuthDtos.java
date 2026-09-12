package com.taskflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AuthDtos {

    public static class RegisterRequest {
        @NotBlank
        @Size(min = 3, max = 50)
        public String username;

        @NotBlank
        @Size(min = 6, max = 100)
        public String password;
    }

    public static class LoginRequest {
        @NotBlank
        public String username;

        @NotBlank
        public String password;
    }

    public static class AuthResponse {
        public String token;
        public String username;

        public AuthResponse(String token, String username) {
            this.token = token;
            this.username = username;
        }
    }
}
