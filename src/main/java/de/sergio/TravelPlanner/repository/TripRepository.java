package de.sergio.TravelPlanner.repository;

import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findAllByOrderByStartDateAsc();

    List<Trip> findByUserOrderByStartDateAsc(User user);
}
