package de.sergio.TravelPlanner.repository;

import de.sergio.TravelPlanner.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {

}
