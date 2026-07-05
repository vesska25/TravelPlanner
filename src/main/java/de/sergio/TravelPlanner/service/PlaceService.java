package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.entity.Place;
import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.exception.ResourceNotFoundException;
import de.sergio.TravelPlanner.repository.PlaceRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlaceService {

    private final PlaceRepository placeRepository;
    private final TripService tripService;   // delegate ownership checks here

    public PlaceService(PlaceRepository placeRepository, TripService tripService) {
        this.placeRepository = placeRepository;
        this.tripService = tripService;
    }

    // Reading places goes through the trip: if the trip is yours, its places are yours.
    public List<Place> getPlacesByTripId(Long tripId) {
        tripService.getOwnedTripOrThrow(tripId);   // throws 404 if the trip isn't yours
        return placeRepository.findByTripId(tripId);
    }

    public Place createPlace(Long tripId, Place place) {
        Trip trip = tripService.getOwnedTripOrThrow(tripId);   // fetches AND checks ownership
        place.setTrip(trip);
        return placeRepository.save(place);
    }

    // Fetch a place and verify its parent trip belongs to the current user.
    private Place getOwnedPlaceOrThrow(Long placeId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new ResourceNotFoundException("Place not found"));
        // Ownership lives on the trip — delegate the check to TripService.
        tripService.getOwnedTripOrThrow(place.getTrip().getId());   // throws 404 if not yours
        return place;
    }

    public Place getPlaceById(Long id) {
        return getOwnedPlaceOrThrow(id);
    }

    public Place updatePlace(Long id, Place place) {
        Place existing = getOwnedPlaceOrThrow(id);

        existing.setName(place.getName());
        existing.setCategory(place.getCategory());
        existing.setVisited(place.isVisited());
        existing.setLatitude(place.getLatitude());
        existing.setLongitude(place.getLongitude());

        return placeRepository.save(existing);
    }

    public void deletePlace(Long id) {
        Place place = getOwnedPlaceOrThrow(id);
        placeRepository.delete(place);
    }

    // Returns every place that belongs to the current user, across all their trips.
    public List<Place> getCurrentUserPlaces() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return placeRepository.findByTripUserEmail(email);
    }
}