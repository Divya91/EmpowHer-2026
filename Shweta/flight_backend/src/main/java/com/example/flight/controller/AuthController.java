package com.example.flight.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.flight.dto.*;
import com.example.flight.service.AuthService;
import com.example.flight.service.JwtService;
import com.example.flight.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    private final JwtService jwtService;

    private final RefreshTokenService refreshTokenService;

    // REGISTER

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        return ResponseEntity.ok(
                authService.register(request)
        );
    }

    // LOGIN

    @PostMapping("/login")
    public ResponseEntity<RefreshTokenResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(
                authService.login(request)
        );
    }

    // VERIFY EMAIL

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(
            @Valid @RequestBody VerifyEmailRequestDTO request) {

        return ResponseEntity.ok(
                authService.verifyEmail(request)
        );
    }

    // RESEND VERIFICATION OTP

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(
            @RequestParam String email) {

        return ResponseEntity.ok(
                authService.sendEmailVerificationOtp(email)
        );
    }

    // FORGOT PASSWORD

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {

        return ResponseEntity.ok(
                authService.forgotPassword(request)
        );
    }

    // RESET PASSWORD

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {

        return ResponseEntity.ok(
                authService.resetPassword(request)
        );
    }

    // REFRESH TOKEN

    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenResponseDTO> refreshToken(
            @Valid @RequestBody RefreshTokenRequestDTO request) {

        var refreshToken =
                refreshTokenService.verifyExpiration(
                        request.getRefreshToken()
                );

        var userDetails =
                org.springframework.security.core.userdetails.User
                        .withUsername(
                                refreshToken.getUser().getEmail()
                        )
                        .password(
                                refreshToken.getUser().getPasswordHash()
                        )
                        .roles(
                                refreshToken.getUser().getRole()
                        )
                        .build();

        String newAccessToken =
                jwtService.generateToken(userDetails);

        return ResponseEntity.ok(
                new RefreshTokenResponseDTO(
                        newAccessToken,
                        refreshToken.getToken()
                )
        );
    }
}