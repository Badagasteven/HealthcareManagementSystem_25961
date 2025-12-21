package com.healthcare.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            logger.info("✓ Email sent successfully to: " + to);
            logger.info("  Subject: " + subject);
        } catch (Exception e) {
            logger.severe("✗ FAILED to send email to " + to);
            logger.severe("  Error: " + e.getMessage());
            logger.severe("  Subject: " + subject);
            // Log the OTP/content for development purposes
            logger.warning("  Email content (OTP for testing): " + text);
            logger.warning("  Please check your email configuration in application.properties");
            // Don't throw exception - allow the flow to continue
            // The OTP is still generated and can be used
            // In production, you might want to handle this differently
        }
    }

    public void sendOtpEmail(String to, String otp, String purpose) {
        String subject = "Your " + purpose + " OTP Code";
        String text = "Hello,\n\n" +
                "Your " + purpose.toLowerCase() + " OTP code is: " + otp + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you did not request this code, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Rwanda Healthcare System";
        
        sendSimpleMessage(to, subject, text);
    }
}
