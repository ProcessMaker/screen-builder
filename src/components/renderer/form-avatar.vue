<template>
  <span>
    <b-button
      :variant="variant()"
      class="avatar-button rounded-circle overflow-hidden p-0 m-0 d-inline-flex border-0"
      :style="styleAvatar()"
      disabled
    >
      <img
        v-if="user.avatar"
        :src="user.avatar"
        :width="width"
        :height="height"
        :class="image"
        :alt="user.fullname"
      />
      <span
        v-else
        class="border-0 d-inline-flex align-items-center justify-content-center text-white text-uppercase text-nowrap font-weight-normal"
        :style="styleAvatar()"
      >
        <span v-if="getInitials()">{{ getInitials() }}</span>
        <span v-else>PM</span>
      </span>
    </b-button>
  </span>
</template>

<script>
export default {
  props: {
    width: {
      default: 64,
    },
    height: {
      default: 64,
    },
  },

  data() {
    return {
      user: window.Processmaker.user,
    };
  },
  mounted() {
    this.getInitials();
  },
  methods: {
    getInitials() {
      return this.user.firstname && this.user.lastname
        ? this.user.firstname.match(/./u)[0] + this.user.lastname.match(/./u)[0]
        : "";
    },
    variant() {
        return this.user.avatar ? 'secondary' : 'info';
    },
    styleAvatar() {
      return "width: " +
        this.width +
        "px; height: " +
        this.height +
        "px; font-size:" +
        this.height / 2.5 +
        "px; padding:0;";
    }
  }
};
</script>

<style lang="scss" scoped>
  .avatar-button:disabled {
    opacity: 1;
    pointer-events: none;
  }
  .empty-image {
    font-size: 2em;
  }
</style>

