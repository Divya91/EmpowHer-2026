package com.example.flight.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.flight.entity.RefreshToken;
import com.example.flight.entity.User;
import com.example.flight.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final long refreshTokenDays = 7;

    public RefreshToken createRefreshToken(User user) {

        refreshTokenRepository.deleteByUser_UserId(user.getUserId());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(
                        LocalDateTime.now()
                                .plusDays(refreshTokenDays)
                )
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(String token) {

        RefreshToken refreshToken =
                refreshTokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid refresh token"
                                ));

        if (refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            refreshTokenRepository.deleteByToken(token);

            throw new RuntimeException(
                    "Refresh token has expired"
            );
        }

        return refreshToken;
    }

    public void deleteToken(String token) {

        refreshTokenRepository.deleteByToken(token);
    }
}