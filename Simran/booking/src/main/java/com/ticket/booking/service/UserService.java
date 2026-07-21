package com.ticket.booking.service;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import com.ticket.booking.entity.User;
import org.springframework.stereotype.Service;
import com.ticket.booking.exception.ApiException;
import com.ticket.booking.dto.LoginRequest;
import com.ticket.booking.dto.SignupRequest;
import com.ticket.booking.dto.UserResponse;
import com.ticket.booking.repository.UserRepository;
import com.ticket.booking.entity.Role;
import lombok.RequiredArgsConstructor;
import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new ApiException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(hash(request.getPassword()))
                .role(request.getEmail().toLowerCase().contains("admin") ? Role.ADMIN : Role.CUSTOMER)
                .build();

        return toResponse(userRepository.save(user));
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));

        if (!user.getPassword().equals(hash(request.getPassword()))) {
            throw new ApiException("Invalid email or password");
        }

        return toResponse(user);
    }

    public User getUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found: " + id));
    }

    private String hash(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name().toLowerCase());
    }
}
