<template>
  <div class="form-group form-image">
    <img v-if="renderImage" :src="imageUrl" :name="variableName">
    <img v-if="!renderImage && image" :src="image" :width="width" :height="height" :id="id">
    <i v-else-if="mode == 'editor'" class="empty-image far fa-image" />
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  props: ['id', 'image', 'width', 'height', 'name', 'renderImage', 'variableName'],
  data() {
    return {
      imageUrl: null,
    }
  },
  computed: {
    classList() {
      let variant = this.variant || 'primary';
      return {
        btn: true,
        ['btn-' + variant]: true,
      };
    },
    mode() {
      return this.$root.$children[0].mode;
    },
  },
  watch: {
    mode() {
      if (this.mode == 'editor') {
        return;
      }
      this.displayRenderedImage();
    },
  },
  methods: {
    setValue(parent, name, value) {
      if (parent.items) {
        this.setValue(parent.$parent, name, value);
      } else {
        Vue.set(parent.data, name, value);
      }
    },
    click() {
      if (this.name) {
        this.setValue(this.$parent, this.name, this.$attrs.value);
      }
      this.$emit(this.event, this.eventData);
    },
    displayRenderedImage() {      
      if (!this.renderImage) {
        return;
      }
      if (this.$parent.data) {
        this.imageUrl = this.$parent.data[this.variableName];
      }
    }
  },
  mounted() {
    this.displayRenderedImage();
  }
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
