package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.entity.Place;
import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.exception.ResourceNotFoundException;
import de.sergio.TravelPlanner.repository.PlaceRepository;
import de.sergio.TravelPlanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final TripRepository tripRepository;

    public PlaceService(PlaceRepository placeRepository, TripRepository tripRepository) {
        this.placeRepository = placeRepository;
        this.tripRepository = tripRepository;
    }

    public List<Place> getPlacesByTripId(Long tripId) {
        return placeRepository.findByTripId(tripId);
    }


    public Place getPlaceById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Place with id " + id + " not found"));
    }

    public Place createPlace(Long tripId, Place place) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip with id " + tripId + " not found"));
        place.setTrip(trip);
        return placeRepository.save(place);
    }

    public Place updatePlace(Long id, Place place) {
        Place existing = getPlaceById(id);

        existing.setName(place.getName());
        existing.setCity(place.getCity());
        existing.setCategory(place.getCategory());
        existing.setNotes(place.getNotes());
        existing.setVisited(place.isVisited());
        existing.setLatitude(place.getLatitude());
        existing.setLongitude(place.getLongitude());

        return placeRepository.save(existing);
    }

    public void deletePlace(Long id) {

        if(!placeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Place with id " + id + " not found");
        }

        placeRepository.deleteById(id);
    }
}
