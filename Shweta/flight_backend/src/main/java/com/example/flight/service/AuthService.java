package com.example.flight.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.example.flight.dto.ForgotPasswordRequestDTO;
import com.example.flight.dto.LoginRequestDTO;
import com.example.flight.dto.RefreshTokenResponseDTO;
import com.example.flight.dto.RegisterRequestDTO;
import com.example.flight.dto.ResetPasswordRequestDTO;
import com.example.flight.dto.VerifyEmailRequestDTO;
import com.example.flight.entity.EmailOtp;
import com.example.flight.entity.OtpType;
import com.example.flight.entity.RefreshToken;
import com.example.flight.entity.User;
import com.example.flight.repository.EmailOtpRepository;
import com.example.flight.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final CustomUserDetailsService userDetailsService;

    private final JwtService jwtService;

    private final RefreshTokenService refreshTokenService;

    private final EmailOtpRepository emailOtpRepository;

    private final EmailService emailService;


    // ================= REGISTER =================

    @Transactional
    public String register(RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already registered"
            );
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(
                        passwordEncoder.encode(request.getPassword())
                )
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role("USER")
                .emailVerified(false)
                .build();

        userRepository.save(user);

        // Send verification OTP
        sendEmailVerificationOtp(user.getEmail());

        return "Registration successful. OTP sent to your email.";
    }


    // ================= LOGIN =================

    public RefreshTokenResponseDTO login(
            LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(
                        request.getEmail()
                );

        String accessToken =
                jwtService.generateToken(userDetails);

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return new RefreshTokenResponseDTO(
                accessToken,
                refreshToken.getToken()
        );
    }


    // ================= EMAIL VERIFICATION =================

    public String sendEmailVerificationOtp(
            String email) {

        userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        String otp = generateOtp();

        EmailOtp emailOtp = EmailOtp.builder()
                .email(email)
                .otp(otp)
                .type(OtpType.EMAIL_VERIFICATION)
                .expiryTime(
                        LocalDateTime.now().plusMinutes(10)
                )
                .used(false)
                .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(
                email,
                otp,
                "EMAIL_VERIFICATION"
        );

        return "Verification OTP sent";
    }


    public String verifyEmail(
            VerifyEmailRequestDTO request) {

        EmailOtp otp =
                emailOtpRepository
                        .findTopByEmailAndTypeAndUsedFalseOrderByIdDesc(
                                request.getEmail(),
                                OtpType.EMAIL_VERIFICATION
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "OTP not found"
                                )
                        );

        if (otp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("OTP expired");
        }

        if (!otp.getOtp()
                .equals(request.getOtp())) {

            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setEmailVerified(true);

        userRepository.save(user);

        otp.setUsed(true);

        emailOtpRepository.save(otp);

        return "Email verified successfully";
    }


    // ================= FORGOT PASSWORD =================

    public String forgotPassword(
            ForgotPasswordRequestDTO request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        String otp = generateOtp();

        EmailOtp emailOtp = EmailOtp.builder()
                .email(user.getEmail())
                .otp(otp)
                .type(OtpType.PASSWORD_RESET)
                .expiryTime(
                        LocalDateTime.now().plusMinutes(10)
                )
                .used(false)
                .build();

        emailOtpRepository.save(emailOtp);

        emailService.sendOtpEmail(
                user.getEmail(),
                otp,
                "PASSWORD_RESET"
        );

        return "Password reset OTP sent to your email";
    }


    // ================= RESET PASSWORD =================

    public String resetPassword(
            ResetPasswordRequestDTO request) {

        EmailOtp otp =
                emailOtpRepository
                        .findTopByEmailAndTypeAndUsedFalseOrderByIdDesc(
                                request.getEmail(),
                                OtpType.PASSWORD_RESET
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "OTP not found"
                                )
                        );

        if (otp.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("OTP expired");
        }

        if (!otp.getOtp()
                .equals(request.getOtp())) {

            throw new RuntimeException("Invalid OTP");
        }

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        otp.setUsed(true);

        emailOtpRepository.save(otp);

        return "Password reset successfully";
    }


    // ================= OTP GENERATOR =================

    private String generateOtp() {

        return String.valueOf(
                100000 + new Random().nextInt(900000)
        );
    }
}
