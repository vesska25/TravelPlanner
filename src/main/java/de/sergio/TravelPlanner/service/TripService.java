package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.entity.User;
import de.sergio.TravelPlanner.exception.ResourceNotFoundException;
import de.sergio.TravelPlanner.exception.ValidationException;
import de.sergio.TravelPlanner.repository.TripRepository;
import de.sergio.TravelPlanner.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }


    public Trip getOwnedTripOrThrow(Long tripId) {
        User currentUser = getCurrentUser();
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));

        if (!trip.getUser().getId().equals(currentUser.getId())) {
            throw new ResourceNotFoundException("Trip not found");
        }
        return trip;
    }


    // READ
    public List<Trip> getAllTrips() {
        return tripRepository.findByUserOrderByStartDateAsc(getCurrentUser());
    }

    public Trip getTripById(Long id) {
        return getOwnedTripOrThrow(id);
    }

    // CREATE
    public Trip createTrip(Trip trip) {
        validateDates(trip);
        trip.setUser(getCurrentUser());
        return tripRepository.save(trip);
    }

    private void validateDates(Trip trip) {
        if (trip.getStartDate().isAfter(trip.getEndDate())) {
            throw new ValidationException("startDate must be before or equal to endDate");
        }
    }

    // UPDATE
    public Trip updateTrip(Long id, Trip updatedData) {
        Trip existing = getTripById(id);

        existing.setName(updatedData.getName());
        existing.setCountry(updatedData.getCountry());
        existing.setStartDate(updatedData.getStartDate());
        existing.setEndDate(updatedData.getEndDate());
        existing.setBudget(updatedData.getBudget());
        existing.setCurrency(updatedData.getCurrency());
        existing.setStatus(updatedData.getStatus());
        existing.setDescription(updatedData.getDescription());

        validateDates(existing);

        return tripRepository.save(existing);
    }

    // DELETE
    public void deleteTrip(Long id) {
        Trip trip = getOwnedTripOrThrow(id);
        tripRepository.delete(trip);
    }
}
