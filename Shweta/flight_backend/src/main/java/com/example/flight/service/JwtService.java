package com.example.flight.service;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Secret key (keep it secure in a real project)
    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkeymysecretkey";

    private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate JWT Token
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour
                .signWith(key)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {

        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    // Validate Token
    public boolean validateToken(String token, UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername());
    }
}
