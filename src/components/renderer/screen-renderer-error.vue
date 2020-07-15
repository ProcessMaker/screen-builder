<template>
  <b-alert show variant="danger" dismissible>
    <b>
      {{ error }}
    </b>
    <ul><li  v-for="(error,index) in errors" :key="`error-${index}`">{{ error }}</li></ul>
  </b-alert>
</template>

<script>
export default {
  props: {
    component: null,
    error: null,
    errors: null,
  },
  data() {
    return {
      show: false,
    };
  },
};
</script>
