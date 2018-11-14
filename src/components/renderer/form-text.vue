<template>
<div class="form-group">
<div :style="styles">{{label}}</div>
</div>
</template>

<script>
export default {
  props: ["label", "fontSize", "fontWeight", "color"],
  computed: {
    styles() {
      return {
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        color: this.color
      };
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


