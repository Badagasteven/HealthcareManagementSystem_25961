package com.healthcare.controller;

import com.healthcare.dto.LoginRequest;
import com.healthcare.dto.LoginResponse;
import com.healthcare.dto.PasswordResetDto;
import com.healthcare.dto.Verify2faRequest;
import com.healthcare.model.PasswordResetToken;
import com.healthcare.model.Person;
import com.healthcare.service.EmailService;
import com.healthcare.service.PersonService;
import com.healthcare.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Backend is running!");
    }

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final PersonService personService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                          PersonService personService, EmailService emailService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.personService = personService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Person person) {
        return ResponseEntity.ok(personService.create(person));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        Optional<Person> personOptional = personService.findByEmail(loginRequest.getEmail());
        if (personOptional.isPresent() && personOptional.get().isMfaEnabled()) {
            String otp = personService.generateOtp(loginRequest.getEmail());
            try {
                emailService.sendOtpEmail(loginRequest.getEmail(), otp, "2FA");
                return ResponseEntity.ok(new LoginResponse(true, "2FA code sent to your email."));
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Failed to send 2FA code. Please check email configuration.");
            }
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new LoginResponse(jwt));
    }
    
    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@RequestBody Verify2faRequest verify2faRequest) {
        if (personService.validateOtp(verify2faRequest.getEmail(), verify2faRequest.getOtp())) {
            final UserDetails userDetails = userDetailsService.loadUserByUsername(verify2faRequest.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new LoginResponse(jwt));
        }
        return ResponseEntity.status(400).body("Invalid 2FA code.");
    }

    @PostMapping("/enable-mfa")
    public ResponseEntity<?> enableMfa(@RequestBody String email) {
        personService.enableMfa(email);
        return ResponseEntity.ok("MFA enabled successfully.");
    }

    @PostMapping("/disable-mfa")
    public ResponseEntity<?> disableMfa(@RequestBody String email) {
        personService.disableMfa(email);
        return ResponseEntity.ok("MFA disabled successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email, HttpServletRequest request) {
        Optional<Person> userOptional = personService.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        Person person = userOptional.get();
        String token = personService.createPasswordResetTokenForPerson(person);

        String appUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
        emailService.sendSimpleMessage(person.getEmail(), "Password Reset Request",
                "To reset your password, click the link below:\n" + appUrl + "/reset-password?token=" + token);

        return ResponseEntity.ok("Password reset link sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDto passwordResetDto) {
        String result = personService.validatePasswordResetToken(passwordResetDto.getToken());

        if (result != null) {
            return ResponseEntity.status(400).body("Invalid token");
        }

        Optional<Person> userOptional = personService.getPasswordResetToken(passwordResetDto.getToken())
                .map(PasswordResetToken::getPerson)
                .flatMap(person -> personService.findByEmail(person.getEmail()));

        if (userOptional.isPresent()) {
            Person person = userOptional.get();
            personService.changeUserPassword(person, passwordResetDto.getPassword());
            return ResponseEntity.ok("Password reset successfully.");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }

    // New endpoints for frontend compatibility
    @PostMapping("/login-otp/request")
    public ResponseEntity<?> requestLoginOtp(@RequestBody java.util.Map<String, String> request) {
        try {
            String email = request != null ? request.get("email") : null;
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(400).body("Email is required.");
            }
            
            // Normalize email
            String normalizedEmail = email.trim().toLowerCase();
            
            Optional<Person> personOptional = personService.findByEmail(normalizedEmail);
            
            if (personOptional.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }

            String otp = personService.generateOtp(normalizedEmail);
            if (otp == null) {
                return ResponseEntity.status(500).body("Failed to generate OTP");
            }

            // Send email (won't throw exception, just logs if it fails)
            emailService.sendOtpEmail(normalizedEmail, otp, "Login");
            
            // Always return success since OTP was generated
            // Email failure is logged but doesn't block the flow
            return ResponseEntity.ok("OTP sent to your email.");
        } catch (Exception e) {
            System.err.println("Error in requestLoginOtp: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/login-otp/confirm")
    public ResponseEntity<?> confirmLoginOtp(@RequestBody Verify2faRequest verify2faRequest) {
        String email = verify2faRequest.getEmail();
        String otp = verify2faRequest.getOtp();
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(400).body("Email is required.");
        }
        
        if (otp == null || otp.trim().isEmpty()) {
            return ResponseEntity.status(400).body("OTP is required.");
        }
        
        // Normalize email
        String normalizedEmail = email.trim().toLowerCase();
        String normalizedOtp = otp.trim();
        
        if (personService.validateOtp(normalizedEmail, normalizedOtp)) {
            final UserDetails userDetails = userDetailsService.loadUserByUsername(normalizedEmail);
            final String jwt = jwtUtil.generateToken(userDetails);
            // Clear OTP after successful verification
            personService.clearOtp(normalizedEmail);
            return ResponseEntity.ok(new LoginResponse(jwt));
        }
        return ResponseEntity.status(400).body("Invalid OTP code. Please check and try again.");
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordResetOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(400).body("Email is required.");
        }
        
        Optional<Person> personOptional = personService.findByEmail(email);
        
        if (personOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        String otp = personService.generatePasswordResetOtp(email);
        if (otp == null) {
            return ResponseEntity.status(500).body("Failed to generate OTP");
        }

        // Send email (won't throw exception, just logs if it fails)
        emailService.sendOtpEmail(email, otp, "Password Reset");
        
        // Always return success since OTP was generated
        return ResponseEntity.ok("Password reset OTP sent to your email.");
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmPasswordResetOtp(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        
        if (email == null || otp == null) {
            return ResponseEntity.status(400).body("Email and OTP are required.");
        }
        
        if (personService.validatePasswordResetOtp(email, otp)) {
            // Clear OTP after successful verification
            personService.clearOtp(email);
            
            // If new password is provided, update it
            if (newPassword != null && !newPassword.isEmpty()) {
                Optional<Person> personOptional = personService.findByEmail(email);
                if (personOptional.isPresent()) {
                    personService.changeUserPassword(personOptional.get(), newPassword);
                    return ResponseEntity.ok("Password reset successfully.");
                }
            }
            
            return ResponseEntity.ok("OTP verified successfully.");
        }
        return ResponseEntity.status(400).body("Invalid OTP code.");
    }
}
