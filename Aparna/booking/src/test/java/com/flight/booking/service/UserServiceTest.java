package com.flight.booking.service;

import com.flight.booking.dto.LoginRequest;
import com.flight.booking.dto.SignupRequest;
import com.flight.booking.dto.UserResponse;
import com.flight.booking.entity.User;
import com.flight.booking.exception.ApiException;
import com.flight.booking.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Aparna Sharma")
                .email("aparna@meridian.com")
                .password("secret123")
                .role("USER")
                .build();
    }

    @Test
    @DisplayName("signup - New user creates account")
    void signup_newUser_createsUserAccount() {
        // Arrange
        SignupRequest request = SignupRequest.builder()
                .name("Aparna Sharma")
                .email("aparna@meridian.com")
                .password("secret123")
                .build();

        when(userRepository.existsByEmailIgnoreCase("aparna@meridian.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        // Act
        UserResponse response = userService.signup(request);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("aparna@meridian.com", response.getEmail());
    }

    @Test
    @DisplayName("signup - Duplicate email throws ApiException")
    void signup_duplicateEmail_throwsApiException() {
        // Arrange
        SignupRequest request = SignupRequest.builder()
                .name("Aparna")
                .email("aparna@meridian.com")
                .password("secret123")
                .build();

        when(userRepository.existsByEmailIgnoreCase("aparna@meridian.com")).thenReturn(true);

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> userService.signup(request));
        assertTrue(ex.getMessage().contains("already in use"));
    }

    @Test
    @DisplayName("login - Valid credentials returns user")
    void login_validCredentials_returnsUser() {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("aparna@meridian.com")
                .password("secret123")
                .build();

        when(userRepository.findByEmailIgnoreCase("aparna@meridian.com")).thenReturn(Optional.of(sampleUser));

        // Act
        UserResponse response = userService.login(request);

        // Assert
        assertNotNull(response);
        assertEquals("Aparna Sharma", response.getName());
    }

    @Test
    @DisplayName("login - Invalid password throws ApiException")
    void login_invalidPassword_throwsApiException() {
        // Arrange
        LoginRequest request = LoginRequest.builder()
                .email("aparna@meridian.com")
                .password("wrongpassword")
                .build();

        when(userRepository.findByEmailIgnoreCase("aparna@meridian.com")).thenReturn(Optional.of(sampleUser));

        // Act & Assert
        ApiException ex = assertThrows(ApiException.class, () -> userService.login(request));
        assertTrue(ex.getMessage().contains("Invalid email or password"));
    }
}
