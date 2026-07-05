package de.sergio.TravelPlanner.repository;

import de.sergio.TravelPlanner.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByTripId(Long tripId);

    List<Place> findByTripUserEmail(String email);

}
