package com.flight.booking.specification;

import com.flight.booking.dto.search.FlightSearchCriteria;
import com.flight.booking.entity.Flight;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class FlightSpecification {

    public static Specification<Flight> searchFlights(
            FlightSearchCriteria criteria
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (criteria.getFromAirport() != null &&
                    !criteria.getFromAirport().isBlank()) {

                predicates.add(

                        cb.equal(

                                root.get("fromAirport")
                                        .get("airportCode"),

                                criteria.getFromAirport()

                        )

                );
            }

            if (criteria.getToAirport() != null &&
                    !criteria.getToAirport().isBlank()) {

                predicates.add(

                        cb.equal(

                                root.get("toAirport")
                                        .get("airportCode"),

                                criteria.getToAirport()

                        )

                );
            }

            if (criteria.getDepartureDate() != null) {

                LocalDateTime start =
                        criteria.getDepartureDate().atStartOfDay();

                LocalDateTime end =
                        criteria.getDepartureDate().atTime(LocalTime.MAX);

                predicates.add(

                        cb.between(

                                root.get("departureTime"),

                                start,

                                end

                        )

                );
            }

            if (criteria.getMaxPrice() != null) {

                predicates.add(

                        cb.lessThanOrEqualTo(

                                root.get("basePrice"),

                                criteria.getMaxPrice()

                        )

                );

            }

            if (criteria.getStops() != null) {

                predicates.add(

                        cb.equal(

                                root.get("stops"),

                                criteria.getStops()

                        )

                );

            }

            if (criteria.getAirlineCode() != null &&
                    !criteria.getAirlineCode().isBlank()) {

                predicates.add(

                        cb.equal(

                                root.get("airline")
                                        .get("airlineCode"),

                                criteria.getAirlineCode()

                        )

                );

            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );

        };

    }

}