<template>
  <article class="vibe-stat-card">
    <div class="vibe-stat-card__top">
      <span class="vibe-stat-card__label">{{ label }}</span>
      <vibe-badge v-if="trend" :label="trend" :variant="trendVariant" />
    </div>
    <div class="vibe-stat-card__value">{{ value }}</div>
    <p v-if="description" class="vibe-stat-card__description">{{ description }}</p>
    <div v-if="showBar" class="vibe-stat-card__bar">
      <div class="vibe-stat-card__bar-fill" :style="{ width: `${progress}%` }" />
    </div>
  </article>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";

export default {
  name: "VibeStatCard",
  components: { VibeBadge },
  props: {
    label: { type: String, default: "Metric" },
    value: { type: String, default: "0" },
    description: { type: String, default: "" },
    trend: { type: String, default: "" },
    trendVariant: { type: String, default: "success" },
    progress: { type: Number, default: 65 },
    showBar: { type: Boolean, default: true },
  },
};
</script>

<style scoped>
.vibe-stat-card {
  background: linear-gradient(145deg, #0f264a 0%, #1a3a6b 100%);
  color: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 14px 40px rgba(15, 38, 74, 0.25);
}

.vibe-stat-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.vibe-stat-card__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.75;
}

.vibe-stat-card__value {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.vibe-stat-card__description {
  margin: 8px 0 0;
  font-size: 13px;
  opacity: 0.8;
}

.vibe-stat-card__bar {
  margin-top: 16px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.vibe-stat-card__bar-fill {
  height: 100%;
  border-radius: inherit;
  background: #b7f06b;
  transition: width 0.3s ease;
}
</style>
