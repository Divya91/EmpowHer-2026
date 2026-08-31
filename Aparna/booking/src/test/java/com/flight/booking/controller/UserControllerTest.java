package com.flight.booking.controller;

import com.flight.booking.dto.UserResponse;
import com.flight.booking.exception.ApiException;
import com.flight.booking.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    private UserResponse sampleUserResponse() {
        return UserResponse.builder()
                .id(1L)
                .name("Aparna Sharma")
                .email("aparna@meridian.com")
                .role("USER")
                .build();
    }

    @Test
    @DisplayName("signup - Valid user returns 200 OK and user profile")
    void signup_validUser_returns200AndUserProfile() throws Exception {
        // Arrange
        when(userService.signup(any())).thenReturn(sampleUserResponse());

        String jsonRequest = """
            {
              "name": "Aparna Sharma",
              "email": "aparna@meridian.com",
              "password": "secret123"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("aparna@meridian.com"));
    }

    @Test
    @DisplayName("signup - Duplicate email returns 400 Bad Request")
    void signup_duplicateEmail_returnsBadRequest() throws Exception {
        // Arrange
        when(userService.signup(any())).thenThrow(new ApiException("Email is already in use"));

        String jsonRequest = """
            {
              "name": "Aparna",
              "email": "aparna@meridian.com",
              "password": "secret123"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/users/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Email is already in use"));
    }

    @Test
    @DisplayName("login - Valid credentials returns 200 OK")
    void login_validCredentials_returns200AndUser() throws Exception {
        // Arrange
        when(userService.login(any())).thenReturn(sampleUserResponse());

        String jsonRequest = """
            {
              "email": "aparna@meridian.com",
              "password": "secret123"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Aparna Sharma"));
    }

    @Test
    @DisplayName("login - Invalid credentials returns 400 Bad Request")
    void login_invalidCredentials_returnsBadRequest() throws Exception {
        // Arrange
        when(userService.login(any())).thenThrow(new ApiException("Invalid email or password"));

        String jsonRequest = """
            {
              "email": "aparna@meridian.com",
              "password": "wrong"
            }
            """;

        // Act & Assert
        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
