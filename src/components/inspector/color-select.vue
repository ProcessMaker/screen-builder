<template>
  <div class="form-group">
    <label>
      {{label}} <input type="checkbox" @click="checkColor" :checked="hasColor">
    </label>
    <div>
      <a v-for="option in options"
         :key="option.value"
         class="btn btn-sm"
         :class="{'btn-outline-light': option.value!==value  , 'btn-outline-secondary': option.value===value}"
         @click="selectColor(option.value)">
         <i class="fas fa-square" :class="'text-' + parsedColor(option.value)"></i>
      </a>
    </div>
    <small class="form-text text-muted">{{$t(helper)}}</small>
  </div>
</template>

<script>

  export default {
    props: ["label", "value", "helper", "options"],
    components: {
    },
    data() {
      return {
        newColor: ''
      };
    },
    computed: {
      hasColor() {
        return !!this.value;
      }
    },
    methods: {
      checkColor() {
        this.hasColor ? this.$emit('input', '') : null;
      },
      selectColor(color) {
        this.$emit('input', color);
      },
      parsedColor(color) {
        return color.split('-')[1]
      }
    }
  };
</script>

<style lang="scss" scoped>
  .image-preview {
    border: 1px solid #ced4da;
    border-radius: 4px;
    height: 4em;
    text-align: center;
    overflow: hidden;
  }
</style>
