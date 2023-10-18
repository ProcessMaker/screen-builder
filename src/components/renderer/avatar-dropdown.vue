<template>
  <b-dropdown-item>
    <b-avatar
      :variant="variant"
      size="1.5rem"
      :text="text"
      class="text-white"
    ></b-avatar>
    {{ label }}
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

