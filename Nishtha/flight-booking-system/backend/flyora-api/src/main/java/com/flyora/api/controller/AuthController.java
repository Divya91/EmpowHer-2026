package com.flyora.api.controller;

import com.flyora.api.dto.request.LoginRequest;
import com.flyora.api.dto.request.RegisterRequest;
import com.flyora.api.dto.response.LoginResponse;
import com.flyora.api.dto.response.RegisterResponse;
import com.flyora.api.security.JwtService;
import com.flyora.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        RegisterResponse response =
                authService.register(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @RequestHeader("Authorization")
            String authorizationHeader
    ) {
        if (!authorizationHeader.startsWith("Bearer ")) {
            throw new RuntimeException(
                    "Authorization header must start with Bearer"
            );
        }

        String token =
                authorizationHeader.substring(7);

        String email =
                jwtService.extractEmail(token);

        String role =
                jwtService.extractRole(token);

        boolean valid =
                jwtService.isTokenValid(token, email);

        return ResponseEntity.ok(
                Map.of(
                        "valid", valid,
                        "email", email,
                        "role", role,
                        "message", "Token is valid"
                )
        );
    }
}