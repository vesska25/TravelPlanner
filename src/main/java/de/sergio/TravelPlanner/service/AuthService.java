package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.dto.RegisterRequest;
import de.sergio.TravelPlanner.dto.RegisterResponse;
import de.sergio.TravelPlanner.entity.User;
import de.sergio.TravelPlanner.entity.enums.Role;
import de.sergio.TravelPlanner.exception.EmailAlreadyExistsException;
import de.sergio.TravelPlanner.exception.ValidationException;
import de.sergio.TravelPlanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // бин с Этапа B

    public RegisterResponse register(RegisterRequest request) {

        if (!Objects.equals(request.password(), request.confirmPassword())) {
            throw new ValidationException("Passwords don't match");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException("User with this email already exists");
        }

        User user = User.builder()
                .email(request.email())
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
}
