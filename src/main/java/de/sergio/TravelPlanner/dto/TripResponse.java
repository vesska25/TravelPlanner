package de.sergio.TravelPlanner.dto;

import de.sergio.TravelPlanner.entity.enums.Currency;
import de.sergio.TravelPlanner.entity.enums.TripStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TripResponse(
        Long id,
        String name,
        String country,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal budget,
        Currency currency,
        TripStatus status,
        String description
) {
}
