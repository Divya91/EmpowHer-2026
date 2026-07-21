package com.flight.booking.service.impl;

import com.flight.booking.dto.request.LoginRequestDTO;
import com.flight.booking.dto.response.LoginResponseDTO;
import com.flight.booking.entity.User;
import com.flight.booking.repository.UserRepository;
import com.flight.booking.service.AuthService;
import com.flight.booking.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.flight.booking.dto.request.SignupRequestDTO;
import com.flight.booking.dto.response.SignupResponseDTO;
import com.flight.booking.entity.Role;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return LoginResponseDTO.builder()
                .token(token)
                .name(user.getFirstName() + " " + user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login Successful")
                .build();
    }

    @Override
    public SignupResponseDTO signup(SignupRequestDTO request) {

        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Create User entity
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .createdAt(LocalDateTime.now())
                .build();

        // Save to database
        User savedUser = userRepository.save(user);

        // Return response
        return SignupResponseDTO.builder()
                .userId(savedUser.getId())
                .name(savedUser.getFirstName() + " " + savedUser.getLastName())
                .email(savedUser.getEmail())
                .message("Account created successfully")
                .build();
    }
}