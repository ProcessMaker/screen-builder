<template>
  <article class="vibe-card" :class="{ 'vibe-card--hoverable': hoverable }">
    <header v-if="title || subtitle" class="vibe-card__header">
      <div class="vibe-card__heading">
        <h3 v-if="title" class="vibe-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="vibe-card__subtitle">{{ subtitle }}</p>
      </div>
      <vibe-badge v-if="badge" :label="badge" :variant="badgeVariant" />
    </header>
    <div v-if="$slots.default" class="vibe-card__body">
      <slot />
    </div>
    <footer v-if="actionLabel" class="vibe-card__footer">
      <button type="button" class="vibe-card__action" @click="$emit('action')">
        {{ actionLabel }}
      </button>
    </footer>
  </article>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";

export default {
  name: "VibeCard",
  components: { VibeBadge },
  props: {
    title: { type: String, default: "Card title" },
    subtitle: { type: String, default: "" },
    badge: { type: String, default: "" },
    badgeVariant: { type: String, default: "neutral" },
    actionLabel: { type: String, default: "" },
    hoverable: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.vibe-card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
}

.vibe-card--hoverable {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.vibe-card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(15, 38, 74, 0.12);
}

.vibe-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.vibe-card__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.02em;
}

.vibe-card__subtitle {
  margin: 0;
  font-size: 13px;
  color: #7a8fa8;
  line-height: 1.5;
}

.vibe-card__body {
  font-size: 14px;
  color: #4a5f78;
  line-height: 1.6;
}

.vibe-card__footer {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(15, 38, 74, 0.08);
}

.vibe-card__action {
  border: none;
  background: none;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: #0f264a;
  cursor: pointer;
}

.vibe-card__action:hover {
  color: #1a3a6b;
}
</style>
