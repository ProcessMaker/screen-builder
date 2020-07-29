<template>
  <b-alert ref="alert" v-model="value.show" variant="danger" dismissible>
    <b>
      {{ value.error }}
    </b>
    <ul><li  v-for="(error,index) in value.errors" :key="`error-${index}`">{{ error }}</li></ul>
  </b-alert>
</template>

<script>
export default {
  props: {
    value: Object,
  },
};
</script>
