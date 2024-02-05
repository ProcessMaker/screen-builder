<template>
  <div class="column-draggable" :selector="config.customCssSelector">
    <draggable style="min-height: 80px" :list="items" group="controls">
      <div
        v-for="(element, index) in items"
        :key="index"
        class="control-item"
        :class="{ selected: selected === element, hasError: hasError(element) }"
        @click.stop="inspect(element)"
      >
        <div v-if="element.container" @click.stop="inspect(element)">
          <div
            class="m-2 card border-0"
            :class="{
              'ai-section-card': isAiSection(element) && selected === element
            }"
          >
            <div
              v-if="selected === element"
              class="card-header form-element-header d-flex align-items-center border rounded"
              :class="{ pulse: isAiSection(element) }"
            >
              <i class="fas fa-arrows-alt-v mr-1 text-muted" />
              <i
                v-if="element.config.icon"
                :class="element.config.icon"
                class="mr-2 ml-1"
              />
              {{ element.config.name || $t("Variable Name") }}
              <div class="ml-auto">
                <button
                  v-if="isAiSection(element) && aiPreview(element)"
                  class="btn btn-sm btn-primary mr-2"
                  :title="$t('Apply Changes')"
                  @click="applyAiChanges(element)"
                >
                  {{ $t("Apply Changes") }}
                </button>
                <button
                  v-if="!(isAiSection(element) && aiPreview(element))"
                  class="btn btn-sm btn-secondary mr-2"
                  :title="$t('Copy Control')"
                  @click="duplicateItem(index)"
                >
                  <i class="fas fa-copy text-light" />
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  :aria-label="$t('Delete')"
                  @click="deleteItem(index)"
                >
                  <i class="far fa-trash-alt text-light" />
                </button>
              </div>
            </div>

            <component
              v-model="element.items"
              :is="element['editor-component']"
              :class="elementCssClass(element)"
              :validation-errors="validationErrors"
              class="mb-3 mr-3 ml-3"
              :selected="selected"
              :ai-element="element"
              :config="element.config"
              @inspect="inspect"
              @update-state="$emit('update-state')"
            />
          </div>
        </div>

        <div v-else :id="element.config.name ? element.config.name : undefined">
          <div class="m-2" :class="{ card: selected === element }">
            <div
              v-if="selected === element"
              class="card-header form-element-header d-flex align-items-center"
            >
              <i class="fas fa-arrows-alt-v mr-1 text-muted" />
              <i
                v-if="element.config.icon"
                :class="element.config.icon"
                class="mr-2 ml-1"
              />
              {{ element.config.name || $t("Variable Name") }}
              <div class="ml-auto">
                <button
                  class="btn btn-sm btn-secondary mr-2"
                  :title="$t('Copy Control')"
                  @click="duplicateItem(index)"
                >
                  <i class="fas fa-copy text-light" />
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  :aria-label="$t('Delete')"
                  @click="deleteItem(index)"
                >
                  <i class="far fa-trash-alt text-light" />
                </button>
              </div>
            </div>

            <component
              v-bind="element.config"
              :is="element['editor-component']"
              class="p-3"
              :class="[
                elementCssClass(element),
                { 'prevent-interaction': !element.config.interactive }
              ]"
              :tabindex="element.config.interactive ? 0 : -1"
              :config="element.config"
              @input="
                element.config.interactive
                  ? (element.config.content = $event)
                  : null
              "
            />
          </div>
        </div>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import _ from "lodash";
import {
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer,
  FormInput,
  FormSelectList,
  FormTextArea
} from "@processmaker/vue-form-elements";
import { HasColorProperty } from "@/mixins";
import * as renderer from "@/components/renderer";

export default {
  name: "Loop",
  components: {
    draggable,
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    ...renderer
  },
  mixins: [HasColorProperty],
  props: ["value", "name", "config", "selected", "validationErrors"],
  data() {
    return {
      items: [],
      cancelledJobs: []
    };
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
  mounted() {
    if (
      !localStorage.getItem("cancelledJobs") ||
      localStorage.getItem("cancelledJobs") === "null"
    ) {
      this.cancelledJobs = [];
    } else {
      this.cancelledJobs = JSON.parse(localStorage.getItem("cancelledJobs"));
    }
    this.$root.$on("ai-form-generated", (formItems, nonce) => {
      this.previewAiChanges(formItems, nonce);
    });
    this.$root.$on("ai-form-progress-updated", (progress, nonce) => {
      this.updateProgress(progress, nonce);
    });
  },
  methods: {
    hasError(element) {
      if (!this.validationErrors) {
        return false;
      }
      return this.validationErrors.some(({ item }) => item === element);
    },
    inspect(element) {
      this.$emit("inspect", element);
    },
    deleteItem(index) {
      // Remove the item from the array in currentPage
      this.items.splice(index, 1);
      this.$emit("update-state");
    },
    duplicateItem(index) {
      const duplicate = _.cloneDeep(this.items[index]);
      this.items.push(duplicate);
      this.$emit("update-state");
    },
    isAiSection(element) {
      return element.component === "AiSection";
    },
    aiPreview(element) {
      return element.items && element.items[0] && element.items[0].length;
    },
    applyAiChanges(element) {
      this.$root.$emit("apply-ai-changes", element);
    },
    previewAiChanges(formItems, nonce) {
      this.value.forEach((item) => {
        if (
          item.component === "AiSection" &&
          nonce === item.config.aiConfig.nonce
        ) {
          this.$set(item, "items", JSON.parse(JSON.stringify(formItems)));
        }
      });
    },
    updateProgress(progress, nonce) {
      this.value.forEach((item) => {
        if (
          item.component === "AiSection" &&
          nonce === item.config.aiConfig.nonce
        ) {
          if (this.cancelledJobs.some((element) => element === nonce)) {
            return;
          }
          this.$set(item.config.aiConfig, "progress", progress);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.hasError {
  border: 1px solid red;
  border-radius: 0.25rem;

  .form-element-header {
    border-bottom: 1px solid red;
    color: red;
  }
}

.column-draggable {
  border: 1px dashed #000;
  min-height: 80px;
  content: "Drag Controls";
}

.selected .column-draggable {
  border: none;
}

.control-item {
  position: relative;

  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    display: none;
  }

  &.selected,
  &:hover {
    .mask {
      border: 1px solid red;
    }

    .delete {
      display: inline-block;
    }
  }

  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;
  }
}

.ai-section-card {
  border: 1px solid #8ab8ff !important;
}

.ai-section-card .card-header {
  background: #cbdfff;
}
.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgb(28 114 194 / 50%);
  }
  100% {
    box-shadow: 0 0 0 13px rgba(0, 0, 0, 0);
  }
}
</style>
