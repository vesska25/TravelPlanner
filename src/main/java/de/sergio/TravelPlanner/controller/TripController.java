package de.sergio.TravelPlanner.controller;

import de.sergio.TravelPlanner.dto.TripRequest;
import de.sergio.TravelPlanner.dto.TripResponse;
import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.mapper.TripMapper;
import de.sergio.TravelPlanner.service.TripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final TripMapper tripMapper;

    public TripController(TripService tripService, TripMapper tripMapper) {
        this.tripService = tripService;
        this.tripMapper = tripMapper;
    }

    // GET /api/trips
    @GetMapping
    public List<TripResponse> getAllTrips() {
        return tripService.getAllTrips()
                .stream()
                .map(tripMapper::toResponse)
                .toList();
    }

    // GET /api/trips/{id}
    @GetMapping("/{id}")
    public TripResponse getTripById(@PathVariable Long id) {
        Trip trip = tripService.getTripById(id);
        return tripMapper.toResponse(trip);
    }

    // POST /api/trips/
    @PostMapping
    public TripResponse createTrip(@RequestBody TripRequest request) {
        Trip trip = tripMapper.toEntity(request);
        return tripMapper.toResponse(tripService.createTrip(trip));
    }

    // PUT /api/trip/{id}
    @PutMapping("/{id}")
    public TripResponse updateTrip(@PathVariable Long id, @RequestBody TripRequest request) {
        Trip trip = tripMapper.toEntity(request);
        Trip updated = tripService.updateTrip(id, trip);
        return tripMapper.toResponse(updated);
    }

    // DELETE /api/trip/{ip}
    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }
}