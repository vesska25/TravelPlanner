package de.sergio.TravelPlanner.service;

import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }


    // READ
    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip with id " + id + " not found"));
    }

    // CREATE
    public Trip createTrip(Trip trip) {
        validateDates(trip);
        return tripRepository.save(trip);
    }

    private void validateDates(Trip trip) {
        if (trip.getStartDate().isAfter(trip.getEndDate())) {
            throw new RuntimeException("startDate must be before or equal to endDate");
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
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip with id " + id + " not found");
        }
        tripRepository.deleteById(id);
    }
}
