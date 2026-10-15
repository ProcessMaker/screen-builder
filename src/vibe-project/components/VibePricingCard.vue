<template>
  <article class="vibe-pricing-card" :class="{ 'vibe-pricing-card--featured': featured }">
    <vibe-badge
      v-if="featured"
      label="Popular"
      variant="accent"
      class="vibe-pricing-card__badge"
    />
    <h3 class="vibe-pricing-card__plan">{{ plan }}</h3>
    <div class="vibe-pricing-card__price">
      <span class="vibe-pricing-card__amount">{{ price }}</span>
      <span class="vibe-pricing-card__period">/{{ period }}</span>
    </div>
    <p class="vibe-pricing-card__description">{{ description }}</p>
    <ul class="vibe-pricing-card__features">
      <li v-for="item in featureList" :key="item">{{ item }}</li>
    </ul>
    <vibe-button
      :label="ctaLabel"
      :variant="featured ? 'primary' : 'ghost'"
      block
      @click="$emit('select')"
    />
  </article>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";
import VibeButton from "./VibeButton.vue";

export default {
  name: "VibePricingCard",
  components: { VibeBadge, VibeButton },
  props: {
    plan: { type: String, default: "Pro" },
    price: { type: String, default: "$29" },
    period: { type: String, default: "mo" },
    description: { type: String, default: "For teams building production screens." },
    features: {
      type: String,
      default: "Unlimited screens,Visual composer,Priority support",
    },
    ctaLabel: { type: String, default: "Get started" },
    featured: { type: Boolean, default: false },
  },
  computed: {
    featureList() {
      return this.features
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
    },
  },
};
</script>

<style scoped>
.vibe-pricing-card {
  position: relative;
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  border: 1px solid rgba(15, 38, 74, 0.06);
}

.vibe-pricing-card--featured {
  border-color: #0f264a;
  box-shadow: 0 16px 48px rgba(15, 38, 74, 0.16);
  transform: scale(1.02);
}

.vibe-pricing-card__badge {
  position: absolute;
  top: 16px;
  right: 16px;
}

.vibe-pricing-card__plan {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #7a8fa8;
}

.vibe-pricing-card__price {
  margin-bottom: 10px;
}

.vibe-pricing-card__amount {
  font-size: 36px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.03em;
}

.vibe-pricing-card__period {
  font-size: 14px;
  color: #7a8fa8;
}

.vibe-pricing-card__description {
  margin: 0 0 18px;
  font-size: 13px;
  color: #4a5f78;
  line-height: 1.5;
}

.vibe-pricing-card__features {
  margin: 0 0 20px;
  padding: 0;
  list-style: none;
}

.vibe-pricing-card__features li {
  position: relative;
  padding: 8px 0 8px 22px;
  font-size: 13px;
  color: #0f264a;
  border-bottom: 1px solid rgba(15, 38, 74, 0.06);
}

.vibe-pricing-card__features li:last-child {
  border-bottom: none;
}

.vibe-pricing-card__features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #059669;
  font-weight: 700;
}
</style>
