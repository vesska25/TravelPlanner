package de.sergio.TravelPlanner.config;

import de.sergio.TravelPlanner.entity.Place;
import de.sergio.TravelPlanner.entity.Trip;
import de.sergio.TravelPlanner.entity.enums.Currency;
import de.sergio.TravelPlanner.entity.enums.PlaceCategory;
import de.sergio.TravelPlanner.entity.enums.TripStatus;
import de.sergio.TravelPlanner.repository.TripRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final TripRepository tripRepository;

    public DataSeeder(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    @Override
    public void run(String... args) {
        if (tripRepository.count() > 0) {
            return;
        }

        Trip italy = new Trip();
        italy.setName("Italienreise");
        italy.setCountry("Italien");
        italy.setStartDate(LocalDate.of(2026, 9, 1));
        italy.setEndDate(LocalDate.of(2026, 9, 10));
        italy.setBudget(new BigDecimal("1200.00"));
        italy.setCurrency(Currency.EUR);
        italy.setStatus(TripStatus.PLANNED);
        italy.setDescription("Rundreise durch Italien");

        Place colosseum = new Place();
        colosseum.setName("Colosseum");
        colosseum.setCity("Rom");
        colosseum.setCategory(PlaceCategory.ATTRACTION);
        colosseum.setLatitude(41.8902);
        colosseum.setLongitude(12.4922);
        colosseum.setTrip(italy);

        italy.getPlaces().add(colosseum);
        tripRepository.save(italy);

        //--------------------------------------------------------

        Trip brazil = new Trip();
        brazil.setName("Brasilien-Abenteuer");
        brazil.setCountry("Brasilien");
        brazil.setStartDate(LocalDate.of(2025, 2, 10));
        brazil.setEndDate(LocalDate.of(2025, 2, 24));
        brazil.setBudget(new BigDecimal("3500.00"));
        brazil.setCurrency(Currency.EUR);
        brazil.setStatus(TripStatus.COMPLETED);
        brazil.setDescription("Karneval und Strände");

        Place sugarloaf = new Place();
        sugarloaf.setName("Zuckerhut");
        sugarloaf.setCity("Rio de Janeiro");
        sugarloaf.setCategory(PlaceCategory.NATURE);
        sugarloaf.setVisited(true);
        sugarloaf.setLatitude(-22.9492);
        sugarloaf.setLongitude(-43.1545);
        sugarloaf.setTrip(brazil);

        Place copacabana = new Place();
        copacabana.setName("Copacabana");
        copacabana.setCity("Rio de Janeiro");
        copacabana.setCategory(PlaceCategory.NATURE);
        copacabana.setVisited(true);
        copacabana.setLatitude(-22.9711);
        copacabana.setLongitude(-43.1822);
        copacabana.setTrip(brazil);

        brazil.getPlaces().add(sugarloaf);
        brazil.getPlaces().add(copacabana);
        tripRepository.save(brazil);

        //---------------------------------------------------------------

        Trip japan = new Trip();
        japan.setName("Japan im Frühling");
        japan.setCountry("Japan");
        japan.setStartDate(LocalDate.of(2027, 3, 25));
        japan.setEndDate(LocalDate.of(2027, 4, 8));
        japan.setBudget(new BigDecimal("4200.00"));
        japan.setCurrency(Currency.EUR);
        japan.setStatus(TripStatus.PLANNED);
        japan.setDescription("Kirschblüte in Tokio und Kyoto");

        Place sensoji = new Place();
        sensoji.setName("Sensō-ji");
        sensoji.setCity("Tokio");
        sensoji.setCategory(PlaceCategory.ATTRACTION);
        sensoji.setLatitude(35.7148);
        sensoji.setLongitude(139.7967);
        sensoji.setTrip(japan);

        Place fushimi = new Place();
        fushimi.setName("Fushimi Inari-Taisha");
        fushimi.setCity("Kyoto");
        fushimi.setCategory(PlaceCategory.ATTRACTION);
        fushimi.setLatitude(34.9671);
        fushimi.setLongitude(135.7727);
        fushimi.setTrip(japan);

        Place ichiran = new Place();
        ichiran.setName("Ichiran Ramen");
        ichiran.setCity("Tokio");
        ichiran.setCategory(PlaceCategory.RESTAURANT);
        ichiran.setTrip(japan);

        japan.getPlaces().add(sensoji);
        japan.getPlaces().add(fushimi);
        japan.getPlaces().add(ichiran);
        tripRepository.save(japan);
    }
}