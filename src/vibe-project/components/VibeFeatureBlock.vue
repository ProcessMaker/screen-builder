<template>
  <section class="vibe-feature-block">
    <div class="vibe-feature-block__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3 4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="vibe-feature-block__content">
      <h3 class="vibe-feature-block__title">{{ title }}</h3>
      <p class="vibe-feature-block__description">{{ description }}</p>
      <ul class="vibe-feature-block__list">
        <li v-for="item in featureList" :key="item">{{ item }}</li>
      </ul>
      <vibe-button
        v-if="ctaLabel"
        :label="ctaLabel"
        variant="secondary"
        size="sm"
        @click="$emit('cta')"
      />
    </div>
  </section>
</template>

<script>
import VibeButton from "./VibeButton.vue";

export default {
  name: "VibeFeatureBlock",
  components: { VibeButton },
  props: {
    title: { type: String, default: "Enterprise ready" },
    description: {
      type: String,
      default: "Ship screens faster with reusable components and visual composition.",
    },
    features: {
      type: String,
      default: "Visual editor,Live preview,Nested components",
    },
    ctaLabel: { type: String, default: "Learn more" },
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
.vibe-feature-block {
  display: flex;
  gap: 18px;
  padding: 22px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(183, 240, 107, 0.18) 0%, rgba(15, 38, 74, 0.04) 100%);
  border: 1px solid rgba(15, 38, 74, 0.06);
}

.vibe-feature-block__icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #0f264a;
  color: #b7f06b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vibe-feature-block__icon svg {
  width: 24px;
  height: 24px;
}

.vibe-feature-block__title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-feature-block__description {
  margin: 0 0 12px;
  font-size: 13px;
  color: #4a5f78;
  line-height: 1.55;
}

.vibe-feature-block__list {
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}

.vibe-feature-block__list li {
  position: relative;
  padding-left: 18px;
  margin-bottom: 6px;
  font-size: 13px;
  color: #0f264a;
}

.vibe-feature-block__list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #b7f06b;
}
</style>
