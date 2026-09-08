package com.skyroute.service;

import com.skyroute.dto.auth.AuthRequest;
import com.skyroute.dto.auth.AuthResponse;
import com.skyroute.dto.auth.RegisterRequest;
import com.skyroute.entity.Role;
import com.skyroute.entity.User;
import com.skyroute.exception.BookingException;
import com.skyroute.repository.RoleRepository;
import com.skyroute.repository.UserRepository;
import com.skyroute.security.JwtTokenProvider;
import com.skyroute.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse authenticateUser(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new BookingException("User record not found", "USER_NOT_FOUND"));

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .roles(roles)
                .build();
    }

    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BookingException("Email address is already in use!", "EMAIL_ALREADY_EXISTS");
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseGet(() -> roleRepository.save(Role.builder().name("ROLE_USER").description("Standard User").build()));

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .dateOfBirth(request.getDateOfBirth())
                .isActive(true)
                .isEmailVerified(true)
                .roles(Collections.singleton(userRole))
                .build();

        userRepository.save(user);

        // Auto authenticate on successful registration
        return authenticateUser(AuthRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
    }
}
