package de.sergio.TravelPlanner.controller;

import de.sergio.TravelPlanner.dto.PlaceRequest;
import de.sergio.TravelPlanner.dto.PlaceResponse;
import de.sergio.TravelPlanner.entity.Place;
import de.sergio.TravelPlanner.mapper.PlaceMapper;
import de.sergio.TravelPlanner.service.PlaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PlaceController {

    private final PlaceService placeService;
    private final PlaceMapper placeMapper;

    public PlaceController(PlaceService placeService, PlaceMapper placeMapper) {
        this.placeService = placeService;
        this.placeMapper = placeMapper;
    }

    @GetMapping("/api/trips/{tripId}/places")
    public List<PlaceResponse> getPlacesByTrip(@PathVariable Long tripId) {
        return placeService.getPlacesByTripId(tripId)
                .stream()
                .map(placeMapper::toResponse)
                .toList();
    }

    @PostMapping("/api/trips/{tripId}/places")
    public PlaceResponse createPlace(@PathVariable Long tripId,
                                     @Valid @RequestBody PlaceRequest request) {
        Place place = placeMapper.toEntity(request);
        Place saved = placeService.createPlace(tripId, place);
        return placeMapper.toResponse(saved);
    }

    @GetMapping("/api/places/{id}")
    public PlaceResponse getPlaceById(@PathVariable Long id) {

        Place place = placeService.getPlaceById(id);
        return placeMapper.toResponse(place);
    }

    @PutMapping("/api/places/{id}")
    public PlaceResponse updatePlace(@PathVariable Long id, @Valid @RequestBody PlaceRequest request) {

        Place place = placeMapper.toEntity(request);
        Place updatedPlace = placeService.updatePlace(id, place);
        return placeMapper.toResponse(updatedPlace);
    }

    @DeleteMapping("/api/places/{id}")
    public void deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
    }

    @GetMapping("/api/places")
    public List<PlaceResponse> getCurrentUserPlaces() {
        return placeService.getCurrentUserPlaces()
                .stream()
                .map(placeMapper::toResponse)
                .toList();
    }
}