<template>
  <div class="form-group form-image" style="overflow-x: hidden" >
    avatar
  </div>
</template>

<script>
export default {
  props: ['id', 'image', 'width', 'height', 'name', 'renderImage', 'variableName', 'validationData', 'imageName'],
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
  .form-image {
    overflow-x: hidden;
  }
</style>
