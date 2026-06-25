package de.sergio.TravelPlanner.controller;

import de.sergio.TravelPlanner.dto.LoginRequest;
import de.sergio.TravelPlanner.dto.LoginResponse;
import de.sergio.TravelPlanner.dto.RegisterRequest;
import de.sergio.TravelPlanner.dto.RegisterResponse;
import de.sergio.TravelPlanner.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
