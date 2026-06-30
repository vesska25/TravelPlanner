package de.sergio.TravelPlanner.mapper;

import de.sergio.TravelPlanner.dto.TripRequest;
import de.sergio.TravelPlanner.dto.TripResponse;
import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.entity.enums.TripStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

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
                computeStatus(trip.getStartDate(), trip.getEndDate()),
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
        trip.setStatus(computeStatus(request.startDate(), request.endDate()));
        trip.setDescription(request.description());

        return trip;
    }


    public TripStatus computeStatus(LocalDate startDate, LocalDate endDate) {
        LocalDate today = LocalDate.now();

        if (startDate == null || endDate == null) return TripStatus.PLANNED;
        if (today.isBefore(startDate)) return  TripStatus.PLANNED;
        if (today.isAfter(endDate)) return  TripStatus.COMPLETED;
        return TripStatus.ONGOING;

    }
}
