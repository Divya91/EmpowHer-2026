package com.flight.booking.controller;

import com.flight.booking.dto.request.LoginRequestDTO;
import com.flight.booking.dto.request.SignupRequestDTO;
import com.flight.booking.dto.response.LoginResponseDTO;
import com.flight.booking.dto.response.SignupResponseDTO;
import com.flight.booking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<SignupResponseDTO> signup(
            @Valid @RequestBody SignupRequestDTO request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.signup(request));
    }
}