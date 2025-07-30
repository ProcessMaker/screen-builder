<template>
  <div>
    {{ itemData }}
    <slot v-if="itemData"></slot>
    <div v-else>
      <p>No data</p>
    </div>
  </div>
</template>

<script>

export default {
  name: "FormDynamicPanel",
  props: {
    itemData: {
      type: null,
      required: false
    }
  }
};
</script>
