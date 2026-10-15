<template>
  <aside class="vibe-flight-summary" data-cy="flight-summary">
    <header class="vibe-flight-summary__header">
      <h2 class="vibe-flight-summary__title">Booking summary</h2>
      <vibe-badge :label="tripTypeLabel" variant="neutral" />
    </header>

    <div class="vibe-flight-summary__route">
      <div class="vibe-flight-summary__cities">
        <span class="vibe-flight-summary__city">{{ origin }}</span>
        <span class="vibe-flight-summary__arrow" aria-hidden="true">→</span>
        <span class="vibe-flight-summary__city">{{ destination }}</span>
      </div>
      <p class="vibe-flight-summary__dates">{{ dateSummary }}</p>
    </div>

    <div v-if="flight" class="vibe-flight-summary__flight">
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Airline</span>
        <span class="vibe-flight-summary__value">{{ flight.airline }}</span>
      </div>
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Flight</span>
        <span class="vibe-flight-summary__value">{{ flight.flightNumber }}</span>
      </div>
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Schedule</span>
        <span class="vibe-flight-summary__value">
          {{ flight.departureTime }} – {{ flight.arrivalTime }}
        </span>
      </div>
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Duration</span>
        <span class="vibe-flight-summary__value">{{ flight.duration }}</span>
      </div>
    </div>

    <p v-else class="vibe-flight-summary__empty">
      Select a flight to see your booking details here.
    </p>

    <div class="vibe-flight-summary__meta">
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Passengers</span>
        <span class="vibe-flight-summary__value">{{ passengersLabel }}</span>
      </div>
      <div class="vibe-flight-summary__flight-row">
        <span class="vibe-flight-summary__label">Cabin</span>
        <span class="vibe-flight-summary__value">{{ cabinLabel }}</span>
      </div>
    </div>

    <div class="vibe-flight-summary__total">
      <span class="vibe-flight-summary__total-label">Total</span>
      <span class="vibe-flight-summary__total-value">{{ formattedTotal }}</span>
    </div>

    <div class="vibe-flight-summary__actions">
      <vibe-button
        label="Confirm booking"
        variant="primary"
        block
        :disabled="!flight"
        data-cy="confirm-booking"
        @click="$emit('confirm')"
      />
      <vibe-button
        label="Clear selection"
        variant="ghost"
        block
        :disabled="!flight"
        data-cy="clear-selection"
        @click="$emit('clear')"
      />
    </div>
  </aside>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";
import VibeButton from "./VibeButton.vue";

const CABIN_LABELS = {
  economy: "Economy",
  premium: "Premium Economy",
  business: "Business",
  first: "First Class",
};

export default {
  name: "VibeFlightSummary",
  components: { VibeBadge, VibeButton },
  props: {
    origin: { type: String, default: "" },
    destination: { type: String, default: "" },
    departureDate: { type: String, default: "" },
    returnDate: { type: String, default: "" },
    tripType: { type: String, default: "round-trip" },
    passengers: { type: Number, default: 1 },
    cabinClass: { type: String, default: "economy" },
    flight: { type: Object, default: null },
    currency: { type: String, default: "USD" },
  },
  computed: {
    tripTypeLabel() {
      return this.tripType === "one-way" ? "One way" : "Round trip";
    },
    dateSummary() {
      if (!this.departureDate) return "Dates not selected";
      if (this.tripType === "one-way" || !this.returnDate) {
        return this.formatDate(this.departureDate);
      }
      return `${this.formatDate(this.departureDate)} – ${this.formatDate(this.returnDate)}`;
    },
    passengersLabel() {
      return `${this.passengers} ${this.passengers === 1 ? "passenger" : "passengers"}`;
    },
    cabinLabel() {
      return CABIN_LABELS[this.cabinClass] || this.cabinClass;
    },
    totalPrice() {
      if (!this.flight) return 0;
      const multiplier = this.tripType === "round-trip" ? 2 : 1;
      return this.flight.price * this.passengers * multiplier;
    },
    formattedTotal() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.currency,
      }).format(this.totalPrice);
    },
  },
  methods: {
    formatDate(value) {
      if (!value) return "";
      return new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.vibe-flight-summary {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  position: sticky;
  top: 24px;
}

.vibe-flight-summary__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.vibe-flight-summary__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-flight-summary__route {
  padding: 14px;
  border-radius: 16px;
  background: rgba(15, 38, 74, 0.04);
}

.vibe-flight-summary__cities {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.vibe-flight-summary__city {
  font-size: 16px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-flight-summary__arrow {
  color: #7a8fa8;
}

.vibe-flight-summary__dates {
  margin: 8px 0 0;
  font-size: 13px;
  color: #7a8fa8;
}

.vibe-flight-summary__flight,
.vibe-flight-summary__meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vibe-flight-summary__flight-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}

.vibe-flight-summary__label {
  color: #7a8fa8;
}

.vibe-flight-summary__value {
  font-weight: 600;
  color: #0f264a;
  text-align: right;
}

.vibe-flight-summary__empty {
  margin: 0;
  padding: 16px;
  text-align: center;
  font-size: 13px;
  color: #7a8fa8;
  background: rgba(15, 38, 74, 0.04);
  border-radius: 16px;
}

.vibe-flight-summary__total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(15, 38, 74, 0.08);
}

.vibe-flight-summary__total-label {
  font-size: 14px;
  font-weight: 600;
  color: #4a5f78;
}

.vibe-flight-summary__total-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.02em;
}

.vibe-flight-summary__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
