package de.sergio.TravelPlanner.mapper;

import de.sergio.TravelPlanner.dto.TripRequest;
import de.sergio.TravelPlanner.dto.TripResponse;
import de.sergio.TravelPlanner.entity.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {

    public TripResponse toResponse(Trip trip) {
        return new TripResponse(
                trip.getId(),
                trip.getName(),
                trip.getCountry(),
                trip.getStartDate(),
                trip.getEndDate(),
                trip.getBudget(),
                trip.getCurrency(),
                trip.getStatus(),
                trip.getDescription()
        );
    }

    public Trip toEntity(TripRequest request) {
        Trip trip = new Trip();
        trip.setName(request.name());
        trip.setCountry(request.country());
        trip.setStartDate(request.startDate());
        trip.setEndDate(request.endDate());
        trip.setBudget(request.budget());
        trip.setCurrency(request.currency());
        trip.setStatus(request.status());
        trip.setDescription(request.description());

        return trip;
    }
}
