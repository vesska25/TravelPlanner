package de.sergio.TravelPlanner.dto;

import de.sergio.TravelPlanner.entity.enums.PlaceCategory;
import jakarta.validation.constraints.*;

public record PlaceRequest(

        @NotBlank
        String name,

        @NotNull
        PlaceCategory category,

        Boolean visited,

        @DecimalMin("-90")
        @DecimalMax("90")
        Double latitude,

        @DecimalMin("-180")
        @DecimalMax("180")
        Double longitude
) {

}
