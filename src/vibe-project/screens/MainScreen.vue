<template>
    <div class="main-screen" data-cy="main-screen">
      <example-header title="Contact Form" subtitle="Fill in your details to get started">
        <vibe-profile-card />
      </example-header>
      <example-header />
      <form class="main-screen__form" prevent="handleSubmit"></form>
      <div v-if="submitted" class="success-message" data-cy="successMessage"></div>
      <section class="screen-section"></section>
      <form class="screen-form"></form>
      <div class="screen-block"></div>
      <example-header />
      <example-header />
      <vibe-profile-card />
      <vibe-profile-card name="Jane Doe" role="Product Designer" bio="Building delightful experiences for enterprise workflows." tags="Design,UX,Process" primaryAction="Follow" secondaryAction="Message" avatarColor="#b7f06b" />
    </div>
</template>

<script>
import ExampleHeader from "../components/ExampleHeader.vue";
import VibeProfileCard from "../components/VibeProfileCard.vue";

export default {
  name: "MainScreen",
  components: { ExampleHeader, VibeProfileCard },
  data() {
    return {};
  },
};
</script>

<style scoped>
.main-screen {
  max-width: 480px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}
</style>
