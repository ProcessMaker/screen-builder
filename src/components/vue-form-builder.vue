<template>
    <div class="dynaform-builder">

        <div class="palette-container">
            <div class="card-header">
                Controls
            </div>
            <draggable v-model="controls" :options="{sort: false, group: {name: 'controls', pull: 'clone', put: false}}" :clone="cloneControl">
                <div v-for="(element, index) in controls" :key="index">{{element.label}}</div>
            </draggable>
        </div>

        <div class="form-canvas-container">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link" href="#" @click="display = 'editor'" :class="{active: display == 'editor'}">Editor</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" @click="display = 'preview'" :class="{active: display == 'preview'}">Preview</a>
                </li>
            </ul>
            <div class="editor-canvas" v-if="display == 'editor'">
                <div class="container">
                    <div class="row">
                        <div class="col-sm">
                            <draggable class="editor-draggable" v-model="config" :options="{group: {name: 'controls'}}">
                                <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in config" :key="index">
                                    <component v-bind="element.config" :is="element['editor-component']"></component>
                                    <div @click="inspect(index)" class="mask"></div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                </div>
            </div>
            <div class="preview-canvas" v-if="display == 'preview'">
                Preview
            </div>
        </div>

        <div class="inspector-container">
            <div class="card-header">
                Inspector
            </div>
            <div class="container-fluid">
                <component v-for="(item, index) in inspection.inspector" :key="index" :is="item.type" v-bind="item.config" v-model="inspection.config[item.field]" />
            </div>
        </div>

    </div>
</template>

<script>
import draggable from "vuedraggable";

import Text from "./builder/mock/text";
import SubmitButton from "./builder/mock/submit-button";

import {
  FormInput,
  FormSelect
} from "@processmaker/vue-form-elements/src/components";

export default {
  components: {
    draggable,
    FormInput,
    FormSelect
  },
  data() {
    return {
      selected: null,
      display: "editor",
      inspection: {},
      controls: [
        {
          label: "Text",
          "editor-component": Text,
          config: {
            text: "Hello World"
          },
          inspector: [
            {
              type: FormInput,
              field: "text",
              config: {
                label: "Display Text",
                placeholder: "Enter your text here",
                helper: "Your customized text will be displayed"
              }
            }
          ]
        },
        {
          label: "Line Input",
          "editor-component": FormInput,
          config: {
            label: "New Input",
            placeholder: "",
            helper: null
          },
          inspector: [
            {
              type: FormInput,
              field: "label",
              config: {
                label: "Field Label",
                helper: "The label describes the fields name"
              }
            },
            {
              type: FormInput,
              field: "placeholder",
              config: {
                label: "Placeholder",
                helper:
                  "The placeholder is what is shown in the field when no value is provided yet"
              }
            },
            {
              type: FormInput,
              field: "helper",
              config: {
                label: "Help Text",
                helper:
                  "Help text is meant to provide additional guidance on the field's value"
              }
            }
          ]
        },
        {
          label: "Submit Button",
          "editor-component": SubmitButton,
          config: {
            label: "Submit"
          },
          inspector: [
            {
              type: FormInput,
              field: "label",
              config: {
                label: "Button Label",
                helper: "The label to be displayed on the button"
              }
            }
          ]
        }
      ],
      config: []
    };
  },
  methods: {
    inspect(index) {
      this.inspection = this.config[index];
      this.selected = this.config[index];
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    cloneControl(control) {
      let copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: control.inspector,
        "editor-component": control["editor-component"],
        label: control.label
      };
      return copy;
    }
  }
};
</script>

<style lang="scss" scoped>
.dynaform-builder {
  display: flex;
  align-content: stretch;
  height: 100%;
  min-height: 100%;
  max-height: 100%;

  .palette-container {
    min-width: 240px;
    width: 240px;
    max-width: 240px;
    border-right: 1px solid #e9edf1;
  }

  .inspector-container {
    min-width: 240px;
    width: 240px;
    max-width: 240px;
    border-left: 1px solid #e9edf1;
  }

  .form-canvas-container {
    flex-grow: 1;
    display: flex;
    align-content: stretch;
    flex-direction: column;
  }

  .preview-canvas,
  .editor-canvas {
    background-color: #f7f9fa;
    flex-grow: 1;
    padding: 48px;
  }
}

.editor-draggable {
  border: 1px dashed #000;
  min-height: 48px;
  content: "Drag Controls";
}

.control-item {
  position: relative;

  &.selected {

    .mask {
        border: 1px solid red;
    }
  }

  .mask {
    position: absolute;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0);
    width: 100%;
    height: 100%;

    &:hover {
      border: 1px solid red;
    }

  }
}
</style>


