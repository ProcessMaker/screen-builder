<template>
  <div class="form-group form-image" style="overflow-x: hidden" >
    <img v-if="renderImage" :src="imageUrl" :width="width" :height="height" :name="variableName">
    <img v-else-if="!renderImage && image" :src="image" :width="width" :height="height" :id="id">
    <i v-else-if="mode == 'editor'" class="empty-image far fa-image" />
  </div>
</template>

<script>
import { get } from 'lodash';

export default {
  props: ['id', 'image', 'width', 'height', 'name', 'renderImage', 'variableName', 'validationData', 'imageName'],
  data() {
    return {
      mode: this.$root.$children[0].mode,
    };
  },
  computed: {
    imageUrl() {
      return get(this.validationData, this.variableName || this.imageName);
    },
  },
};
</script>

<style lang="scss" scoped>
  .empty-image {
    font-size: 2em;
  }
  .form-image {
    overflow-x: hidden;
  }
</style>
