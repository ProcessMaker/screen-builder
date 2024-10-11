<template>
  <div class="form-group">
    <div>
      <b-button-toolbar>
        <b-button-group size="lg">
          <b-button
            v-for="option in options"
            :key="option.value"
            size="sm"
            variant="outline-light"
            class="color-option"
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
.color-option {
  left: -8px;
  border-radius: 4px;
  width: 48px; /* Ajusta el ancho del botón */
  height: 48px; /* Ajusta la altura del botón */
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  }
</style>

<!-- <template>
  <div class="form-group">
    <div>
      <b-button-toolbar>
        <b-button-group size="sm">
          <b-button
            v-for="option in options"
            :key="option.value"
            size="sm"
            variant="outline-light"
            class="color-option"
            :class="['bg-' + parsedColor(option.value)]"
            :title="option.content"
            @click="selectColor(option.value)"
          >
            <div class="color-check">
              <i
                class="fas fa-check"
                :class="[
                  option.value === value
                    ? 'text-light'
                    : 'text-' + parsedColor(option.value)
                ]"
              />
            </div>
          </b-button>
        </b-button-group>
      </b-button-toolbar>
    </div>
    <p class="helper-text" v-if="helper">{{ helper }}</p>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    label: {},
    value: {},
    helper: {},
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
.color-option {
  left: -8px;
  border-radius: 4px;
  width: 48px; /* Ajusta el ancho del botón */
  height: 48px; /* Ajusta la altura del botón */
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* Para el icono de verificación */

  &.bg-blue { background-color: #5297FE; }
  &.bg-green { background-color: #6BD17C; }
  &.bg-orange { background-color: #FFAB00; }
  &.bg-gray { background-color: #9FA8B5; }

  .color-check {
    position: absolute;
    visibility: hidden; /* Ocultar por defecto */
  }

  &:hover .color-check {
    visibility: visible; /* Mostrar al pasar el mouse */
  }
}

.helper-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6c757d;
}
</style> -->
