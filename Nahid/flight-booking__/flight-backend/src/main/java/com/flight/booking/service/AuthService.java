package com.flight.booking.service;

import com.flight.booking.dto.request.LoginRequestDTO;
import com.flight.booking.dto.request.SignupRequestDTO;
import com.flight.booking.dto.response.LoginResponseDTO;
import com.flight.booking.dto.response.SignupResponseDTO;


public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO request);

    SignupResponseDTO signup(SignupRequestDTO request);

}