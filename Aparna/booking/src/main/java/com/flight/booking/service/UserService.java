package com.flight.booking.service;

import com.flight.booking.dto.LoginRequest;
import com.flight.booking.dto.SignupRequest;
import com.flight.booking.dto.UserResponse;
import com.flight.booking.dto.UserUpdateRequest;
import com.flight.booking.entity.Role;
import com.flight.booking.entity.User;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

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

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = getUserOrThrow(id);
        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail().trim().toLowerCase());
        }
        return toResponse(userRepository.save(user));
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
