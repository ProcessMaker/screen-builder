<template>
  <div id="app">
    <vue-form-builder/>
  </div>
</template>

<script>
import VueFormBuilder from './components/vue-form-builder.vue'

export default {
  name: 'app',
  components: {
    VueFormBuilder
  }
}
</script>

<style lang="scss">
@import '~bootstrap/dist/css/bootstrap';

html, body {
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
}
</style>
