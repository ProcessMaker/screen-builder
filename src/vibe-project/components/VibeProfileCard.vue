<template>
  <article class="vibe-profile-card">
    <div class="vibe-profile-card__avatar" :style="{ background: avatarColor }">
      {{ initials }}
    </div>
    <div class="vibe-profile-card__info">
      <h3 class="vibe-profile-card__name">{{ name }}</h3>
      <p class="vibe-profile-card__role">{{ role }}</p>
      <p v-if="bio" class="vibe-profile-card__bio">{{ bio }}</p>
    </div>
    <div class="vibe-profile-card__actions">
      <vibe-button
        :label="primaryAction"
        variant="primary"
        size="sm"
        @click="$emit('primary-action')"
      />
      <vibe-button
        v-if="secondaryAction"
        :label="secondaryAction"
        variant="ghost"
        size="sm"
        @click="$emit('secondary-action')"
      />
    </div>
    <ul v-if="tags" class="vibe-profile-card__tags">
      <li v-for="tag in tagList" :key="tag">{{ tag }}</li>
    </ul>
  </article>
</template>

<script>
import VibeButton from "./VibeButton.vue";

export default {
  name: "VibeProfileCard",
  components: { VibeButton },
  props: {
    name: { type: String, default: "Jane Doe" },
    role: { type: String, default: "Product Designer" },
    bio: { type: String, default: "Building delightful experiences for enterprise workflows." },
    tags: { type: String, default: "Design,UX,Process" },
    primaryAction: { type: String, default: "Follow" },
    secondaryAction: { type: String, default: "Message" },
    avatarColor: { type: String, default: "#b7f06b" },
  },
  computed: {
    initials() {
      return this.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },
    tagList() {
      return this.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    },
  },
};
</script>

<style scoped>
.vibe-profile-card {
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  text-align: center;
}

.vibe-profile-card__avatar {
  width: 72px;
  height: 72px;
  margin: 0 auto 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-profile-card__name {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-profile-card__role {
  margin: 0 0 10px;
  font-size: 13px;
  color: #7a8fa8;
}

.vibe-profile-card__bio {
  margin: 0 0 18px;
  font-size: 13px;
  color: #4a5f78;
  line-height: 1.55;
}

.vibe-profile-card__actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vibe-profile-card__tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.vibe-profile-card__tags li {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 38, 74, 0.06);
  font-size: 11px;
  font-weight: 600;
  color: #4a5f78;
}
</style>
