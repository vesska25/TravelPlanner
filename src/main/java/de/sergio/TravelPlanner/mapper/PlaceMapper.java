package de.sergio.TravelPlanner.mapper;

import de.sergio.TravelPlanner.dto.PlaceRequest;
import de.sergio.TravelPlanner.dto.PlaceResponse;
import de.sergio.TravelPlanner.entity.Place;
import org.springframework.stereotype.Component;

@Component
public class PlaceMapper {

    public PlaceResponse toResponse(Place place) {
        Long tripId = (place.getTrip() != null) ? place.getTrip().getId() : null;

        return new PlaceResponse(
                place.getId(),
                place.getName(),
                place.getCategory(),
                place.isVisited(),
                place.getLatitude(),
                place.getLongitude(),
                tripId
        );
    }

    public Place toEntity(PlaceRequest request) {

        Place place = new Place();

        place.setName(request.name());
        place.setCategory(request.category());
        place.setVisited(request.visited() != null ? request.visited() : false);
        place.setLatitude(request.latitude());
        place.setLongitude(request.longitude());

        return place;
    }
}
