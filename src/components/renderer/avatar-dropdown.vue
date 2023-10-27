<template>
  <b-dropdown-item :variant="variant">
    <i class="fas fa-circle mr-2" />{{ label }}
  </b-dropdown-item>
</template>

<script>
export default {
  props: {
    variant: String,
    text: String,
    label: String
  }
};
</script>
