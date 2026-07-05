package de.sergio.TravelPlanner.dto;

import de.sergio.TravelPlanner.entity.enums.PlaceCategory;

public record PlaceResponse(
        Long id,
        String name,
        PlaceCategory category,
        boolean visited,
        Double latitude,
        Double longitude,
        Long tripId

) {
}
