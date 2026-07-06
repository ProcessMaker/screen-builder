<template>
  <ol class="vibe-timeline">
    <li
      v-for="(item, index) in itemList"
      :key="index"
      class="vibe-timeline__item"
      :class="{ 'vibe-timeline__item--active': index === 0 }"
    >
      <div class="vibe-timeline__marker" />
      <div class="vibe-timeline__content">
        <span class="vibe-timeline__time">{{ item.time }}</span>
        <strong class="vibe-timeline__title">{{ item.title }}</strong>
        <p v-if="item.detail" class="vibe-timeline__detail">{{ item.detail }}</p>
      </div>
    </li>
  </ol>
</template>

<script>
export default {
  name: "VibeTimeline",
  props: {
    items: {
      type: String,
      default: "10:00|Request submitted|Form sent for review,11:30|Under review|Team is validating data,14:00|Approved|Ready for next step",
    },
  },
  computed: {
    itemList() {
      return this.items
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [time, title, detail = ""] = entry.split("|").map((p) => p.trim());
          return { time, title, detail };
        });
    },
  },
};
</script>

<style scoped>
.vibe-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}

.vibe-timeline__item {
  display: flex;
  gap: 14px;
  position: relative;
  padding-bottom: 20px;
}

.vibe-timeline__item:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 7px;
  top: 18px;
  bottom: 0;
  width: 2px;
  background: rgba(15, 38, 74, 0.1);
}

.vibe-timeline__marker {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
  border-radius: 50%;
  background: rgba(15, 38, 74, 0.15);
  border: 3px solid #fff;
  box-shadow: 0 0 0 2px rgba(15, 38, 74, 0.1);
}

.vibe-timeline__item--active .vibe-timeline__marker {
  background: #b7f06b;
  box-shadow: 0 0 0 2px #0f264a;
}

.vibe-timeline__time {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #7a8fa8;
  margin-bottom: 2px;
}

.vibe-timeline__title {
  display: block;
  font-size: 14px;
  color: #0f264a;
  margin-bottom: 4px;
}

.vibe-timeline__detail {
  margin: 0;
  font-size: 12px;
  color: #4a5f78;
  line-height: 1.5;
}
</style>
