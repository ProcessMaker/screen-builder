<template>
  <form class="vibe-flight-search-form" @submit.prevent="handleSubmit">
    <div class="vibe-flight-search-form__trip-type" role="group" aria-label="Trip type">
      <button
        v-for="option in tripTypeOptions"
        :key="option.value"
        type="button"
        class="vibe-flight-search-form__trip-option"
        :class="{ 'vibe-flight-search-form__trip-option--active': tripType === option.value }"
        :data-cy="`trip-type-${option.value}`"
        @click="setTripType(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="vibe-flight-search-form__row">
      <vibe-input
        v-model="localForm.origin"
        label="From"
        placeholder="City or airport"
        data-cy="flight-origin"
      />
      <button
        type="button"
        class="vibe-flight-search-form__swap"
        aria-label="Swap origin and destination"
        data-cy="swap-airports"
        @click="swapAirports"
      >
        ⇄
      </button>
      <vibe-input
        v-model="localForm.destination"
        label="To"
        placeholder="City or airport"
        data-cy="flight-destination"
      />
    </div>

    <div class="vibe-flight-search-form__row">
      <vibe-input
        v-model="localForm.departureDate"
        label="Departure"
        type="date"
        data-cy="departure-date"
      />
      <vibe-input
        v-if="tripType === 'round-trip'"
        v-model="localForm.returnDate"
        label="Return"
        type="date"
        data-cy="return-date"
      />
    </div>

    <div class="vibe-flight-search-form__row">
      <div class="vibe-flight-search-form__field">
        <label for="passengers" class="vibe-flight-search-form__label">Passengers</label>
        <select
          id="passengers"
          v-model.number="localForm.passengers"
          class="vibe-flight-search-form__select"
          data-cy="passengers"
        >
          <option v-for="count in 6" :key="count" :value="count">
            {{ count }} {{ count === 1 ? "passenger" : "passengers" }}
          </option>
        </select>
      </div>

      <div class="vibe-flight-search-form__field">
        <label for="cabin" class="vibe-flight-search-form__label">Cabin class</label>
        <select
          id="cabin"
          v-model="localForm.cabinClass"
          class="vibe-flight-search-form__select"
          data-cy="cabin-class"
        >
          <option value="economy">Economy</option>
          <option value="premium">Premium Economy</option>
          <option value="business">Business</option>
          <option value="first">First Class</option>
        </select>
      </div>
    </div>

    <vibe-button
      label="Search flights"
      variant="primary"
      native-type="submit"
      icon="✈"
      block
      data-cy="search-flights"
    />
  </form>
</template>

<script>
import VibeButton from "./VibeButton.vue";
import VibeInput from "./VibeInput.vue";

export default {
  name: "VibeFlightSearchForm",
  components: { VibeButton, VibeInput },
  props: {
    origin: { type: String, default: "" },
    destination: { type: String, default: "" },
    departureDate: { type: String, default: "" },
    returnDate: { type: String, default: "" },
    passengers: { type: Number, default: 1 },
    cabinClass: { type: String, default: "economy" },
    initialTripType: {
      type: String,
      default: "round-trip",
      validator: (v) => ["round-trip", "one-way"].includes(v),
    },
  },
  data() {
    return {
      tripType: this.initialTripType,
      localForm: {
        origin: this.origin,
        destination: this.destination,
        departureDate: this.departureDate,
        returnDate: this.returnDate,
        passengers: this.passengers,
        cabinClass: this.cabinClass,
      },
      tripTypeOptions: [
        { value: "round-trip", label: "Round trip" },
        { value: "one-way", label: "One way" },
      ],
    };
  },
  methods: {
    setTripType(value) {
      this.tripType = value;
      if (value === "one-way") {
        this.localForm.returnDate = "";
      }
    },
    swapAirports() {
      const temp = this.localForm.origin;
      this.localForm.origin = this.localForm.destination;
      this.localForm.destination = temp;
    },
    handleSubmit() {
      this.$emit("search", {
        ...this.localForm,
        tripType: this.tripType,
      });
    },
  },
};
</script>

<style scoped>
.vibe-flight-search-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.vibe-flight-search-form__trip-type {
  display: flex;
  gap: 8px;
}

.vibe-flight-search-form__trip-option {
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  background: rgba(15, 38, 74, 0.06);
  color: #4a5f78;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.vibe-flight-search-form__trip-option:hover {
  background: rgba(15, 38, 74, 0.1);
  color: #0f264a;
}

.vibe-flight-search-form__trip-option--active {
  background: #0f264a;
  color: #fff;
}

.vibe-flight-search-form__row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: end;
}

.vibe-flight-search-form__row:last-of-type {
  grid-template-columns: 1fr 1fr;
}

.vibe-flight-search-form__swap {
  width: 40px;
  height: 40px;
  margin-bottom: 2px;
  border: none;
  border-radius: 999px;
  background: rgba(183, 240, 107, 0.35);
  color: #0f264a;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}

.vibe-flight-search-form__swap:hover {
  transform: rotate(180deg);
  background: #b7f06b;
}

.vibe-flight-search-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vibe-flight-search-form__label {
  font-size: 13px;
  font-weight: 600;
  color: #0f264a;
}

.vibe-flight-search-form__select {
  padding: 12px 16px;
  border: none;
  border-radius: 16px;
  font-size: 14px;
  color: #0f264a;
  background: #f4f7fa;
  outline: none;
  transition: box-shadow 0.15s ease, background 0.15s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a5f78' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.vibe-flight-search-form__select:focus {
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(15, 38, 74, 0.12);
}

@media (max-width: 640px) {
  .vibe-flight-search-form__row {
    grid-template-columns: 1fr;
  }

  .vibe-flight-search-form__swap {
    justify-self: center;
    margin-bottom: 0;
  }
}
</style>
