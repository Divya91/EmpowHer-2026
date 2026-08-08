package com.example.flight.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.flight.dto.LoginRequestDTO;
import com.example.flight.dto.RegisterRequestDTO;
import com.example.flight.entity.User;
import com.example.flight.repository.UserRepository;
import com.example.flight.service.CustomUserDetailsService;
import com.example.flight.service.JwtService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    // Register User
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role("customer")
                .build();

        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("User Registered Successfully");
    }

    // Login User
    @PostMapping("/login")
    public String login(@RequestBody LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        return jwtService.generateToken(userDetails);
    }
}
