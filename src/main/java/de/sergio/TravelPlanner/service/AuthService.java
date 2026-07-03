package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.dto.*;
import de.sergio.TravelPlanner.entity.User;
import de.sergio.TravelPlanner.entity.enums.Role;
import de.sergio.TravelPlanner.exception.EmailAlreadyExistsException;
import de.sergio.TravelPlanner.exception.InvalidCredentialsException;
import de.sergio.TravelPlanner.exception.ValidationException;
import de.sergio.TravelPlanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public RegisterResponse register(RegisterRequest request) {

        if (!Objects.equals(request.password(), request.confirmPassword())) {
            throw new ValidationException("Passwords don't match");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("User with this email already exists");
        }

        User user = User.builder()
                .email(request.email())
                .name(request.name())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);

        return new RegisterResponse(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Incorrect email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Incorrect email or password");
        }

        return new LoginResponse(jwtService.generateToken(user));
    }


    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole())).toList();
    }
}
