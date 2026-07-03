package de.sergio.TravelPlanner.controller;

import de.sergio.TravelPlanner.dto.ChangePasswordRequest;
import de.sergio.TravelPlanner.dto.UpdateNameRequest;
import de.sergio.TravelPlanner.dto.UserResponse;
import de.sergio.TravelPlanner.service.AuthService;
import de.sergio.TravelPlanner.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;
    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers() {
        return authService.getAllUsers();
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser() {
        return userService.getCurrentUser();
    }

    @PutMapping("/me")
    public UserResponse updateName(@Valid @RequestBody UpdateNameRequest request) {
        return userService.updateName(request);
    }

    @PutMapping("/me/password")
    public void changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(request);
    }
}