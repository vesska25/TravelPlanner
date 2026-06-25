package de.sergio.TravelPlanner.dto;

import de.sergio.TravelPlanner.entity.enums.Role;


public record UserResponse(Long id, String email, Role role) {}
