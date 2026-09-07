package com.flightbooking.service;

import com.flightbooking.dto.AuthResponse;
import com.flightbooking.dto.RegisterRequest;
import com.flightbooking.entity.User;
import com.flightbooking.exception.BookingException;
import com.flightbooking.exception.ResourceNotFoundException;
import com.flightbooking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse registerUser(RegisterRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new BookingException("Email is already registered: " + request.getEmail());
        }

        User.Role userRole = User.Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("ADMIN")) {
            userRole = User.Role.ADMIN;
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .build();

        User saved = repository.save(user);

        return AuthResponse.builder()
                .token(null)
                .tokenType(null)
                .userId(saved.getUserId())
                .email(saved.getEmail())
                .firstName(saved.getFirstName())
                .lastName(saved.getLastName())
                .role(saved.getRole().name())
                .build();
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return repository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return repository.findByEmail(email);
    }

    public User updateUser(Long id, User user) {
        User existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        existing.setEmail(user.getEmail());
        if (user.getPasswordHash() != null && !user.getPasswordHash().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }
        existing.setFirstName(user.getFirstName());
        existing.setLastName(user.getLastName());
        if (user.getRole() != null) {
            existing.setRole(user.getRole());
        }

        return repository.save(existing);
    }

    public void deleteUser(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id);
        }
        repository.deleteById(id);
    }
}