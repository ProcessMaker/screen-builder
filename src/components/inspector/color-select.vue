<template>
  <div class="form-group">
    <div>
      <label>{{ label }}</label>
      <b-button-toolbar>
        <b-button-group size="sm">
          <b-button
            v-for="option in options"
            :key="option.value"
            size="sm"
            variant="outline-light"
            class="btn btn-sm mr-1 pr-1 pl-1 pt-0 pb-0 btn-outline-none"
            :class="['bg-' + parsedColor(option.value)]"
            :title="option.content"
          >
            <i
              class="fas fa-check"
              :class="[
                option.value === value
                  ? 'text-light'
                  : 'text-' + parsedColor(option.value)
              ]"
              @click="selectColor(option.value)"
            />
          </b-button>
        </b-button-group>
      </b-button-toolbar>
      <small @click="checkColor()">
        <i class="fas fa-ban" />
        {{ $t("Clear Color Selection") }}
      </small>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    /**
     * The label for the color select
     */
    label: {},
    /**
     * The value of the color select. eg. `alert alert-success`
     */
    value: {},
    /**
     * The helper text for the color select (not visible yet)
     */
     helper: {},
    /**
     * The options for the color select
     */
    options: {},
  },
  data() {
    return {
      newColor: ""
    };
  },
  computed: {
    hasColor() {
      return Boolean(this.value);
    }
  },
  methods: {
    emitChanges(value) {
      this.$emit("input", value);
      this.$emit("update-state");
    },
    checkColor() {
      if (this.hasColor) {
        this.emitChanges("");
      }
    },
    selectColor(color) {
      this.emitChanges(color);
    },
    parsedColor(color) {
      return color.split("-")[1];
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
