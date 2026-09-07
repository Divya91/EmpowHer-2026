package com.ticket.booking.service;

import com.ticket.booking.dto.LoginRequest;
import com.ticket.booking.dto.SignupRequest;
import com.ticket.booking.entity.Role;
import com.ticket.booking.entity.User;
import com.ticket.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(Role.PASSENGER)
                .build();

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Incorrect email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Incorrect email or password");
        }

        return user;
    }
}