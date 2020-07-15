<template>
  <div class="form-group">
    <form-checkbox :label="$t('Render image from a variable name')" v-model="renderImage" data-cy="inspector-renderImage" />
    <form-input v-if="renderImage" :label="$t('Variable Name')" v-model="imageName" data-cy="inspector-variableName" />
  </div>
</template>

<script>
import { FormInput, FormCheckbox } from '@processmaker/vue-form-elements';

export default {
  props: ['value', 'selectedControl'],
  components: {
    FormInput,
    FormCheckbox,
  },
  data() {
    return {
      imageName: null,
    };
  },
  computed: {
    renderImage: {
      get() {
        return this.selectedControl.config.renderImage;
      },
      set(value) {
        this.selectedControl.config.renderImage = value;
      },
    },
    mode() {
      return this.$root.$children[0].mode;
    },
  },
  watch: {
    value() {
      if (this.value == undefined) {
        this.renderImage = false;
      } else  {
        this.renderImage = true;
        this.imageName = this.value;
      }
    },
    imageName() {
      this.$emit('input', this.imageName);
    },
    renderImage() {
      if (!this.renderImage) {
        this.renderImage = false;
        this.imageName = null;
        this.$emit('input', this.imageName);
      }
    },
  },
  mounted() {
    if (this.value) {
      this.renderImage = true;
      this.imageName = this.value;
    }
  },
};
</script>
