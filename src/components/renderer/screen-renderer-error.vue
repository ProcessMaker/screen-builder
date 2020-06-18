<template>
  <div class="text-danger">
    <h4>{{ error }}</h4>
    <ul v-for="(error,index) in errors" :key="`error-${index}`"><li>{{ error }}</li></ul>
    {{ component && component.template }}
  </div>
</template>

<script>
export default {
  props: {
    component: null,
    error: null,
    errors: null,
  },
};
</script>
