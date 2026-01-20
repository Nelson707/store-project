package com.store.Store.security;

import org.springframework.stereotype.Component;

@Component
public class JwtUtils {

    private final String jwtSecret = "replace_with_secure_secret";

    public String generateToken(String username) {
        // TODO: implement JWT creation
        return "";
    }

    public boolean validateToken(String token) {
        // TODO: implement JWT validation
        return true;
    }

    public String getUsernameFromToken(String token) {
        // TODO: extract username
        return "";
    }
}
