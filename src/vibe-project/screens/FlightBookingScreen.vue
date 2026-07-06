<template>
  <div class="flight-booking" data-cy="flight-booking-screen">
    <example-header
      title="Book a flight"
      subtitle="Search routes, compare options, and confirm your trip"
    />

    <vibe-alert
      v-if="errorMessage"
      variant="error"
      title="Search error"
      :message="errorMessage"
      dismissible
      @dismiss="errorMessage = ''"
    />

    <vibe-alert
      v-if="bookingConfirmed"
      variant="success"
      title="Booking confirmed"
      :message="confirmationMessage"
      data-cy="booking-success"
    />

    <div class="flight-booking__layout">
      <div class="flight-booking__main">
        <vibe-card
          title="Find your flight"
          subtitle="Enter your route and travel dates"
          badge="Search"
          badge-variant="accent"
        >
          <vibe-flight-search-form
            :origin="searchCriteria.origin"
            :destination="searchCriteria.destination"
            :departure-date="searchCriteria.departureDate"
            :return-date="searchCriteria.returnDate"
            :passengers="searchCriteria.passengers"
            :cabin-class="searchCriteria.cabinClass"
            :initial-trip-type="searchCriteria.tripType"
            @search="handleSearch"
          />
        </vibe-card>

        <section v-if="hasSearched" class="flight-booking__results">
          <div class="flight-booking__results-header">
            <h2 class="flight-booking__results-title">
              {{ filteredFlights.length }} flight{{ filteredFlights.length === 1 ? "" : "s" }} found
            </h2>
            <p class="flight-booking__results-subtitle">
              {{ routeLabel }} · {{ cabinLabel }}
            </p>
          </div>

          <div v-if="filteredFlights.length" class="flight-booking__list">
            <vibe-flight-card
              v-for="flight in filteredFlights"
              :key="flight.id"
              :airline="flight.airline"
              :airline-emoji="flight.airlineEmoji"
              :flight-number="flight.flightNumber"
              :origin="flight.origin"
              :destination="flight.destination"
              :departure-time="flight.departureTime"
              :arrival-time="flight.arrivalTime"
              :duration="flight.duration"
              :stops="flight.stops"
              :price="flight.price"
              :selected="selectedFlight && selectedFlight.id === flight.id"
              @select="selectFlight(flight)"
            />
          </div>

          <p v-else class="flight-booking__no-results">
            No flights match your search. Try different cities or dates.
          </p>
        </section>
      </div>

      <vibe-flight-summary
        :origin="searchCriteria.origin"
        :destination="searchCriteria.destination"
        :departure-date="searchCriteria.departureDate"
        :return-date="searchCriteria.returnDate"
        :trip-type="searchCriteria.tripType"
        :passengers="searchCriteria.passengers"
        :cabin-class="searchCriteria.cabinClass"
        :flight="selectedFlight"
        @confirm="confirmBooking"
        @clear="clearSelection"
      />
    </div>
  </div>
</template>

<script>
import ExampleHeader from "../components/ExampleHeader.vue";
import VibeAlert from "../components/VibeAlert.vue";
import VibeCard from "../components/VibeCard.vue";
import VibeFlightCard from "../components/VibeFlightCard.vue";
import VibeFlightSearchForm from "../components/VibeFlightSearchForm.vue";
import VibeFlightSummary from "../components/VibeFlightSummary.vue";

const FLIGHTS = [
  {
    id: 1,
    airline: "SkyRoute Air",
    airlineEmoji: "🛫",
    flightNumber: "SR 204",
    origin: "JFK",
    destination: "LAX",
    departureTime: "08:15",
    arrivalTime: "11:40",
    duration: "5h 25m",
    stops: 0,
    price: 289,
    cabinClass: "economy",
  },
  {
    id: 2,
    airline: "Pacific Wings",
    airlineEmoji: "🌊",
    flightNumber: "PW 118",
    origin: "JFK",
    destination: "LAX",
    departureTime: "10:30",
    arrivalTime: "14:20",
    duration: "5h 50m",
    stops: 1,
    price: 219,
    cabinClass: "economy",
  },
  {
    id: 3,
    airline: "Summit Airlines",
    airlineEmoji: "⛰",
    flightNumber: "SA 882",
    origin: "JFK",
    destination: "LAX",
    departureTime: "14:05",
    arrivalTime: "17:10",
    duration: "5h 05m",
    stops: 0,
    price: 349,
    cabinClass: "business",
  },
  {
    id: 4,
    airline: "Coastal Jet",
    airlineEmoji: "🌅",
    flightNumber: "CJ 501",
    origin: "SFO",
    destination: "SEA",
    departureTime: "07:50",
    arrivalTime: "10:05",
    duration: "2h 15m",
    stops: 0,
    price: 159,
    cabinClass: "economy",
  },
  {
    id: 5,
    airline: "Northern Express",
    airlineEmoji: "❄",
    flightNumber: "NE 330",
    origin: "ORD",
    destination: "MIA",
    departureTime: "09:20",
    arrivalTime: "13:45",
    duration: "3h 25m",
    stops: 0,
    price: 199,
    cabinClass: "premium",
  },
  {
    id: 6,
    airline: "Atlas Airways",
    airlineEmoji: "🌍",
    flightNumber: "AA 760",
    origin: "ORD",
    destination: "MIA",
    departureTime: "16:10",
    arrivalTime: "22:30",
    duration: "5h 20m",
    stops: 1,
    price: 175,
    cabinClass: "economy",
  },
];

const CABIN_LABELS = {
  economy: "Economy",
  premium: "Premium Economy",
  business: "Business",
  first: "First Class",
};

const DEFAULT_SEARCH = () => ({
  origin: "New York (JFK)",
  destination: "Los Angeles (LAX)",
  departureDate: "",
  returnDate: "",
  passengers: 1,
  cabinClass: "economy",
  tripType: "round-trip",
});

export default {
  name: "FlightBookingScreen",
  components: {
    ExampleHeader,
    VibeAlert,
    VibeCard,
    VibeFlightCard,
    VibeFlightSearchForm,
    VibeFlightSummary,
  },
  data() {
    return {
      flights: FLIGHTS,
      searchCriteria: DEFAULT_SEARCH(),
      hasSearched: false,
      selectedFlight: null,
      bookingConfirmed: false,
      confirmationMessage: "",
      errorMessage: "",
    };
  },
  computed: {
    filteredFlights() {
      const originCode = this.extractAirportCode(this.searchCriteria.origin);
      const destinationCode = this.extractAirportCode(this.searchCriteria.destination);

      return this.flights.filter((flight) => {
        const matchesRoute =
          this.matchesAirport(flight.origin, originCode) &&
          this.matchesAirport(flight.destination, destinationCode);
        const matchesCabin = flight.cabinClass === this.searchCriteria.cabinClass;
        return matchesRoute && matchesCabin;
      });
    },
    routeLabel() {
      return `${this.searchCriteria.origin} to ${this.searchCriteria.destination}`;
    },
    cabinLabel() {
      return CABIN_LABELS[this.searchCriteria.cabinClass] || this.searchCriteria.cabinClass;
    },
  },
  methods: {
    handleSearch(criteria) {
      this.errorMessage = this.validateSearch(criteria);
      if (this.errorMessage) return;

      this.searchCriteria = { ...criteria };
      this.hasSearched = true;
      this.selectedFlight = null;
      this.bookingConfirmed = false;
      this.confirmationMessage = "";
    },
    validateSearch(criteria) {
      if (!criteria.origin.trim() || !criteria.destination.trim()) {
        return "Enter both origin and destination.";
      }
      if (criteria.origin.trim().toLowerCase() === criteria.destination.trim().toLowerCase()) {
        return "Origin and destination must be different.";
      }
      if (!criteria.departureDate) {
        return "Select a departure date.";
      }
      if (criteria.tripType === "round-trip" && !criteria.returnDate) {
        return "Select a return date for round-trip flights.";
      }
      if (
        criteria.tripType === "round-trip" &&
        criteria.returnDate &&
        criteria.returnDate < criteria.departureDate
      ) {
        return "Return date must be on or after the departure date.";
      }
      return "";
    },
    selectFlight(flight) {
      this.selectedFlight = flight;
      this.bookingConfirmed = false;
      this.confirmationMessage = "";
    },
    clearSelection() {
      this.selectedFlight = null;
      this.bookingConfirmed = false;
      this.confirmationMessage = "";
    },
    confirmBooking() {
      if (!this.selectedFlight) return;

      const multiplier = this.searchCriteria.tripType === "round-trip" ? 2 : 1;
      const total =
        this.selectedFlight.price * this.searchCriteria.passengers * multiplier;

      this.bookingConfirmed = true;
      this.confirmationMessage = `Your ${this.searchCriteria.tripType === "one-way" ? "one-way" : "round-trip"} flight on ${this.selectedFlight.airline} (${this.selectedFlight.flightNumber}) is confirmed for ${this.searchCriteria.passengers} passenger(s). Total: ${this.formatCurrency(total)}.`;
    },
    extractAirportCode(value) {
      const match = value.match(/\(([A-Z]{3})\)/);
      if (match) return match[1];
      return value.trim().slice(0, 3).toUpperCase();
    },
    matchesAirport(flightCode, searchCode) {
      if (!searchCode) return true;
      return flightCode.toUpperCase().includes(searchCode.toUpperCase());
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>

<style scoped>
.flight-booking {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}

.flight-booking__layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}

.flight-booking__main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.flight-booking__results-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.flight-booking__results-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f264a;
}

.flight-booking__results-subtitle {
  margin: 0;
  font-size: 13px;
  color: #7a8fa8;
}

.flight-booking__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.flight-booking__no-results {
  margin: 0;
  padding: 40px 20px;
  text-align: center;
  font-size: 14px;
  color: #7a8fa8;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
}

@media (max-width: 900px) {
  .flight-booking__layout {
    grid-template-columns: 1fr;
  }
}
</style>
