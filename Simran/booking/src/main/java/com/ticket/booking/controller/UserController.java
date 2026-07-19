package com.ticket.booking.controller;

import com.ticket.booking.dto.LoginRequest;
import com.ticket.booking.dto.SignupRequest;
import com.ticket.booking.dto.UserResponse;
import com.ticket.booking.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public UserResponse signup(@RequestBody SignupRequest request) {
        return userService.signup(request);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }
}