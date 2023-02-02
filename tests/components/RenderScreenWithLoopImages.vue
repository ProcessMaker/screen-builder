<template>
  <vue-form-renderer
    v-model="data"
    :config="screen.config"
    :computed="screen.computed"
    :custom-css="screen.custom_css"
    :watchers="screen.watchers"
  />
</template>

<script>
import Screens from "../e2e/fixtures/loopImages.json";

export default {
  data() {
    return {
      data: {},
      screen: Screens.screens[0]
    };
  }
};
</script>
