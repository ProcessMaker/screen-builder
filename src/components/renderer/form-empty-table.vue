<template>
  <div class="container content">
    <img src="../../assets/table_empty.svg" alt="empty table" />
    <span class="title">
      {{ $t(title) }}
    </span>
    <b-link v-if="url !== ''" @click="openLink()">
      {{ $t(linkText) }}
    </b-link>
  </div>
</template>

<script>
export default {
  props:["title", "link", "url"],
  data() {
    const linkText = `View All ${this.link}`;
    return {
      linkText
    };
  },
  methods: {
    openLink() {
      window.open(this.url, "_blank");
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.title {
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: -1.28px;
}
</style>
