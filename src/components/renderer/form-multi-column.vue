<template>
  <div class="form-group">
    <div class="row">
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="classColumn(index)"
        class="column-draggable"
      >
        <template
          v-for="(element, index) in item.filter(shouldElementBeVisible)"
        >
          <component
            :is="element.component"
            v-if="element.container"
            :key="index"
            ref="container"
            v-model="element.items"
            :class="elementCssClass(element)"
            :transient-data="transientData"
            :config="element.config"
            :name="
              element.config.name !== undefined ? element.config.name : null
            "
            :form-config="formConfig"
            @submit="submit"
            @pageNavigate="pageNavigate"
          />

          <div
            v-else
            :id="element.config.name ? element.config.name : undefined"
            :key="index"
            class="w-100"
            :selector="element.config.customCssSelector"
          >
            <component
              v-bind="element.config"
              :is="element.component"
              ref="elements"
              v-model="model[getValidPath(element.config.name)]"
              :class="elementCssClass(element)"
              :validation-data="transientData"
              :disabled="element.config.interactive || element.config.disabled"
              :form-config="formConfig"
              @submit="submit"
              @pageNavigate="pageNavigate"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import {
  // eslint-disable-next-line no-unused-vars
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer
} from "@processmaker/vue-form-elements";
import * as renderer from "@/components/renderer";
import {
  HasColorProperty,
  shouldElementBeVisible,
  getValidPath
} from "@/mixins";
import FormMaskedInput from "@/components/renderer/form-masked-input.vue";

const defaultColumnWidth = 1;

export default {
  name: "FormMultiColumn",
  components: {
    draggable,
    FormInput: FormMaskedInput,
    FormSelectList,
    FormTextArea,
    FormCheckbox,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    ...renderer
  },
  mixins: [HasColorProperty, shouldElementBeVisible, getValidPath],
  props: ["value", "selected", "name", "config", "transientData", "formConfig"],
  data() {
    return {
      items: []
    };
  },
  computed: {
    model() {
      return this.$parent.model;
    }
  },
  watch: {
    value: {
      handler() {
        this.items = this.value;
      },
      immediate: true
    },
    items() {
      this.$emit("input", this.items);
    }
  },
  methods: {
    classColumn(index) {
      let column = defaultColumnWidth;

      if (this.config.options[index] && this.config.options[index].content) {
        column = this.config.options[index].content;
      }

      return `col-sm-${column} ${this.columnVerticalAlign(index)}`;
    },
    columnVerticalAlign(index) {
      let verticalAlignClass = "";

      // Only apply vertical align to text when it's the only element in the column
      if (this.items.length > 0 && this.items[index].length === 1) {
        const formTexts = this.items[0].filter(
          (item) => item.component === "FormText"
        );
        if (formTexts.length === 0) {
          return "";
        }

        const formText = formTexts[0];
        const justify = ` justify-content-${
          formText.config.textAlign === "right"
            ? "end"
            : formText.config.textAlign
        }`;
        switch (formText.config.verticalAlign) {
          case "top":
            verticalAlignClass = `d-flex align-items-start${justify}`;
            break;
          case "middle":
            verticalAlignClass = `d-flex align-items-center${justify}`;
            break;
          case "bottom":
            verticalAlignClass = `d-flex align-items-end${justify}`;
            break;
        }
      }
      return verticalAlignClass;
    },
    inspect(element) {
      this.$emit("inspect", element);
    },
    submit() {
      // Just bubble up
      this.$emit("submit");
    },
    pageNavigate(page) {
      // Just bubble up
      this.$emit("pageNavigate", page);
    }
  }
};
</script>
