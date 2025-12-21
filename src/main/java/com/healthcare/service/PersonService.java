package com.healthcare.service;

import com.healthcare.model.Person;
import com.healthcare.model.PasswordResetToken;
import com.healthcare.model.Role;
import com.healthcare.repository.PersonRepository;
import com.healthcare.repository.PasswordResetTokenRepository;
import com.healthcare.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class PersonService {
  private final PersonRepository repo;
  private final PasswordResetTokenRepository tokenRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;

  public PersonService(PersonRepository repo, PasswordResetTokenRepository tokenRepository,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
    this.repo = repo;
    this.tokenRepository = tokenRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public Person create(Person person) {
    if (repo.existsByEmail(person.getEmail())) {
      throw new RuntimeException("Email already exists");
    }
    person.setPassword(passwordEncoder.encode(person.getPassword()));
    Role patientRole = roleRepository.findByName("PATIENT");
    person.setRoles(Set.of(patientRole));
    return repo.save(person);
  }

  public Page<Person> list(Pageable pageable) {
    return repo.findAll(pageable);
  }

  public Page<Person> list(String roleName, Pageable pageable) {
    return repo.findByRoles_Name(roleName, pageable);
  }

  public Person get(Long id) {
    return repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
  }
  
  public Optional<Person> findByEmail(String email) {
    if (email == null) {
      return Optional.empty();
    }
    // Use case-insensitive lookup
    return repo.findByEmailIgnoreCase(email.trim());
  }

  public Person update(Long id, Person updated) {
    Person existing = get(id);
    existing.setFullName(updated.getFullName());
    existing.setVillage(updated.getVillage());
    if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
      existing.setPassword(passwordEncoder.encode(updated.getPassword()));
    }
    return repo.save(existing);
  }

  public void delete(Long id) {
    repo.deleteById(id);
  }

  public String createPasswordResetTokenForPerson(Person person) {
    String token = UUID.randomUUID().toString();
    PasswordResetToken myToken = new PasswordResetToken(token, person);
    tokenRepository.save(myToken);
    return token;
  }

  public String validatePasswordResetToken(String token) {
    final Optional<PasswordResetToken> passToken = tokenRepository.findByToken(token);

    return !passToken.isPresent() ? "invalidToken"
            : isTokenExpired(passToken.get()) ? "expired"
            : null;
  }

  public Optional<PasswordResetToken> getPasswordResetToken(String token) {
    return tokenRepository.findByToken(token);
  }

  private boolean isTokenExpired(PasswordResetToken passToken) {
    final Calendar cal = Calendar.getInstance();
    return passToken.getExpiryDate().before(cal.getTime());
  }
  
  public void changeUserPassword(Person person, String password) {
      person.setPassword(passwordEncoder.encode(password));
      repo.save(person);
  }

  public void enableMfa(String email) {
      repo.findByEmail(email).ifPresent(person -> {
          person.setMfaEnabled(true);
          repo.save(person);
      });
  }

  public void disableMfa(String email) {
      repo.findByEmail(email).ifPresent(person -> {
          person.setMfaEnabled(false);
          repo.save(person);
      });
  }

  public String generateOtp(String email) {
      if (email == null) {
          return null;
      }
      
      // Normalize email to lowercase
      String normalizedEmail = email.trim().toLowerCase();
      
      Optional<Person> personOpt = repo.findByEmailIgnoreCase(normalizedEmail);
      
      return personOpt.map(person -> {
          // Generate 6-digit OTP (ensures leading zeros are preserved)
          String otp = String.format("%06d", new java.util.Random().nextInt(999999));
          person.setMfaSecret(otp);
          repo.save(person);
          System.out.println("Generated OTP for " + normalizedEmail + ": " + otp);
          return otp;
      }).orElse(null);
  }

  public boolean validateOtp(String email, String otp) {
      if (email == null || otp == null) {
          return false;
      }
      
      // Normalize email to lowercase and trim
      String normalizedEmail = email.trim().toLowerCase();
      // Trim OTP and ensure it's a string
      String normalizedOtp = otp.trim();
      
      Optional<Person> personOpt = repo.findByEmailIgnoreCase(normalizedEmail);
      
      return personOpt.map(person -> {
          String storedOtp = person.getMfaSecret();
          if (storedOtp == null) {
              System.out.println("OTP Validation - No OTP stored for: " + normalizedEmail);
              return false;
          }
          // Compare trimmed OTPs
          boolean matches = normalizedOtp.equals(storedOtp.trim());
          System.out.println("OTP Validation - Email: " + normalizedEmail);
          System.out.println("OTP Validation - Input OTP: '" + normalizedOtp + "' (length: " + normalizedOtp.length() + ")");
          System.out.println("OTP Validation - Stored OTP: '" + storedOtp + "' (length: " + storedOtp.length() + ")");
          System.out.println("OTP Validation - Match: " + matches);
          return matches;
      }).orElse(false);
  }

  // Password reset OTP methods
  public String generatePasswordResetOtp(String email) {
      if (email == null) {
          return null;
      }
      
      // Normalize email to lowercase
      String normalizedEmail = email.trim().toLowerCase();
      
      Optional<Person> personOpt = repo.findByEmailIgnoreCase(normalizedEmail);
      
      return personOpt.map(person -> {
          // Generate 6-digit OTP (ensures leading zeros are preserved)
          String otp = String.format("%06d", new java.util.Random().nextInt(999999));
          // Store in mfaSecret temporarily (or we could add a separate field)
          person.setMfaSecret(otp);
          repo.save(person);
          System.out.println("Generated Password Reset OTP for " + normalizedEmail + ": " + otp);
          return otp;
      }).orElse(null);
  }

  public boolean validatePasswordResetOtp(String email, String otp) {
      if (email == null || otp == null) {
          return false;
      }
      
      // Normalize email to lowercase and trim
      String normalizedEmail = email.trim().toLowerCase();
      // Trim OTP and ensure it's a string
      String normalizedOtp = otp.trim();
      
      Optional<Person> personOpt = repo.findByEmailIgnoreCase(normalizedEmail);
      
      return personOpt.map(person -> {
          String storedOtp = person.getMfaSecret();
          if (storedOtp == null) {
              System.out.println("Password Reset OTP Validation - No OTP stored for: " + normalizedEmail);
              return false;
          }
          // Compare trimmed OTPs
          boolean matches = normalizedOtp.equals(storedOtp.trim());
          System.out.println("Password Reset OTP Validation - Email: " + normalizedEmail);
          System.out.println("Password Reset OTP Validation - Input OTP: '" + normalizedOtp + "'");
          System.out.println("Password Reset OTP Validation - Stored OTP: '" + storedOtp + "'");
          System.out.println("Password Reset OTP Validation - Match: " + matches);
          return matches;
      }).orElse(false);
  }

  public void clearOtp(String email) {
      repo.findByEmail(email).ifPresent(person -> {
          person.setMfaSecret(null);
          repo.save(person);
      });
  }
}
