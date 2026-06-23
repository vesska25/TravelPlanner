package de.sergio.TravelPlanner.dto;


import de.sergio.TravelPlanner.entity.enums.Role;

public record RegisterResponse(
        Long id,
        String email,
        Role role
) {}
