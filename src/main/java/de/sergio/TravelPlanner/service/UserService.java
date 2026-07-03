package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.dto.ChangePasswordRequest;
import de.sergio.TravelPlanner.dto.UpdateNameRequest;
import de.sergio.TravelPlanner.dto.UserResponse;
import de.sergio.TravelPlanner.entity.User;
import de.sergio.TravelPlanner.exception.InvalidCredentialsException;
import de.sergio.TravelPlanner.exception.ValidationException;
import de.sergio.TravelPlanner.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        User user = getCurrentUserEntity();
        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }

    @Transactional
    public UserResponse updateName(UpdateNameRequest request) {
        User user = getCurrentUserEntity();
        user.setName(request.name());
        userRepository.save(user);

        return new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole());
    }


    private User getCurrentUserEntity() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated user not found in database: " + email));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUserEntity();

        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Current password is incorrect");
        }

        if (!Objects.equals(request.newPassword(), request.confirmPassword())) {
            throw new ValidationException("Passwords don't match");
        }

        if (passwordEncoder.matches(request.newPassword(),user.getPassword())) {
            throw new ValidationException("The new password must be different from your current password");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
    }
}