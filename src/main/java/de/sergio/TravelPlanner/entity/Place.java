package de.sergio.TravelPlanner.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import de.sergio.TravelPlanner.entity.enums.PlaceCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "place")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonIgnore
    private Trip trip;

    private String name;

    @Enumerated(EnumType.STRING)
    private PlaceCategory category;

    private boolean visited = false;

    private Double latitude;

    private Double longitude;

}
