<template>
  <article
    class="vibe-flight-card"
    :class="{ 'vibe-flight-card--selected': selected }"
    :data-cy="`flight-${flightNumber}`"
  >
    <div class="vibe-flight-card__header">
      <div class="vibe-flight-card__airline">
        <span class="vibe-flight-card__logo" aria-hidden="true">{{ airlineEmoji }}</span>
        <div>
          <h3 class="vibe-flight-card__airline-name">{{ airline }}</h3>
          <p class="vibe-flight-card__flight-number">{{ flightNumber }}</p>
        </div>
      </div>
      <vibe-badge :label="stopsLabel" :variant="stops === 0 ? 'accent' : 'neutral'" />
    </div>

    <div class="vibe-flight-card__route">
      <div class="vibe-flight-card__endpoint">
        <span class="vibe-flight-card__time">{{ departureTime }}</span>
        <span class="vibe-flight-card__code">{{ origin }}</span>
      </div>

      <div class="vibe-flight-card__timeline" aria-hidden="true">
        <span class="vibe-flight-card__duration">{{ duration }}</span>
        <div class="vibe-flight-card__line">
          <span class="vibe-flight-card__dot" />
          <span class="vibe-flight-card__track" />
          <span class="vibe-flight-card__plane">✈</span>
          <span class="vibe-flight-card__track" />
          <span class="vibe-flight-card__dot" />
        </div>
      </div>

      <div class="vibe-flight-card__endpoint vibe-flight-card__endpoint--right">
        <span class="vibe-flight-card__time">{{ arrivalTime }}</span>
        <span class="vibe-flight-card__code">{{ destination }}</span>
      </div>
    </div>

    <div class="vibe-flight-card__footer">
      <div class="vibe-flight-card__price-block">
        <span class="vibe-flight-card__price">{{ formattedPrice }}</span>
        <span class="vibe-flight-card__price-note">per passenger</span>
      </div>
      <vibe-button
        :label="selected ? 'Selected' : 'Select flight'"
        :variant="selected ? 'secondary' : 'primary'"
        size="sm"
        :disabled="selected"
        data-cy="select-flight"
        @click="$emit('select')"
      />
    </div>
  </article>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";
import VibeButton from "./VibeButton.vue";

export default {
  name: "VibeFlightCard",
  components: { VibeBadge, VibeButton },
  props: {
    airline: { type: String, required: true },
    airlineEmoji: { type: String, default: "✈" },
    flightNumber: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    stops: { type: Number, default: 0 },
    price: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    selected: { type: Boolean, default: false },
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.currency,
      }).format(this.price);
    },
    stopsLabel() {
      if (this.stops === 0) return "Nonstop";
      if (this.stops === 1) return "1 stop";
      return `${this.stops} stops`;
    },
  },
};
</script>

<style scoped>
.vibe-flight-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  border: 2px solid transparent;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.vibe-flight-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(15, 38, 74, 0.12);
}

.vibe-flight-card--selected {
  border-color: #b7f06b;
  box-shadow: 0 16px 48px rgba(183, 240, 107, 0.25);
}

.vibe-flight-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.vibe-flight-card__airline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vibe-flight-card__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(15, 38, 74, 0.06);
  font-size: 22px;
}

.vibe-flight-card__airline-name {
  margin: 0 0 2px;
  font-size: 15px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-flight-card__flight-number {
  margin: 0;
  font-size: 12px;
  color: #7a8fa8;
}

.vibe-flight-card__route {
  display: grid;
  grid-template-columns: 1fr 1.4fr 1fr;
  gap: 12px;
  align-items: center;
}

.vibe-flight-card__endpoint {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vibe-flight-card__endpoint--right {
  text-align: right;
}

.vibe-flight-card__time {
  font-size: 20px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.02em;
}

.vibe-flight-card__code {
  font-size: 13px;
  font-weight: 600;
  color: #7a8fa8;
}

.vibe-flight-card__timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.vibe-flight-card__duration {
  font-size: 12px;
  color: #7a8fa8;
}

.vibe-flight-card__line {
  display: flex;
  align-items: center;
  width: 100%;
}

.vibe-flight-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #0f264a;
  flex-shrink: 0;
}

.vibe-flight-card__track {
  flex: 1;
  height: 2px;
  background: rgba(15, 38, 74, 0.12);
}

.vibe-flight-card__plane {
  font-size: 14px;
  color: #0f264a;
  margin: 0 4px;
}

.vibe-flight-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(15, 38, 74, 0.08);
}

.vibe-flight-card__price-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vibe-flight-card__price {
  font-size: 18px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-flight-card__price-note {
  font-size: 11px;
  color: #7a8fa8;
}

@media (max-width: 560px) {
  .vibe-flight-card__route {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .vibe-flight-card__endpoint--right {
    text-align: left;
  }

  .vibe-flight-card__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
