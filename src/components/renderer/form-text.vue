<template>
  <div class="form-group">
    <div :style="styles" v-html="rendered"/>
  </div>
</template>

<script>
import Mustache from 'mustache';

export default {
  props: [
    'label',
    'fontSize',
    'fontWeight',
    'textAlign',
    'verticalAlign',
    'validationData',
    'color',
    'name',
  ],
  computed: {
    styles() {
      return {
        fontSize: this.fontSize,
        fontWeight: this.fontWeight,
        textAlign: this.textAlign,
        verticalAlign: this.verticalAlign,
        color: this.color,
      };
    },
    rendered() {
      if (!this.validationData) {
        return this.label;
      }

      try {
        return Mustache.render(this.label, this.validationData);
      } catch (error) {
        return this.label;
      }
    },
  },
};
</script>
