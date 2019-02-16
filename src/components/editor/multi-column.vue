<template>
    <div class="form-group">
        <div class="container-fluid">
            <div class="row">
                <draggable @start="onStartDrag" @end="onEndDrag"  class="col-sm column-draggable" v-model="items[0]" :options="{group: {name: 'controls'}}">
                    <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in items[0]" :key="index">
                         <div v-if="element.container">
                            <component :class="elementCssClass(element)" :mode="mode" @inspect="inspect" v-model="element.items" v-bind="element.config" :is="element['editor-component']"></component>
                            <button class="delete btn btn-danger" @click="deleteItem(0, index)">x</button>
                        </div>

                        <div v-else>
                          <div v-if="element.component == 'FormText'" @click="inspect(element)" class="text-wrapper">
                              <div class="handle">
                                  <i class="fas fa-arrows-alt"></i>
                              </div>
                              <component :editable="textEditable" :class="elementCssClass(element)" @onUpdate="gotUpdate($event, element)" @focused="inspect(element)" v-bind="element.config" :is="element['editor-component']" mode="editor"></component>
                              <button class="delete btn btn-danger" @click="deleteItem(0, index)">x</button>
                          </div>
                          <div v-else>
                              <component :class="elementCssClass(element)" v-bind="element.config" :is="element['editor-component']"></component>
                              <div @click="inspect(element)" class="mask"></div>
                              <button class="delete btn btn-danger" @click="deleteItem(0, index)">x</button>
                          </div>
                        </div>
                    </div>

                </draggable>

                <draggable @start="onStartDrag" @end="onEndDrag" class="col-sm column-draggable" v-model="items[1]" :options="{group: {name: 'controls'}}">
                    <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in items[1]" :key="index">
                         <div v-if="element.container">
                            <component :class="elementCssClass(element)" :mode="mode" @inspect="inspect" v-model="element.items" v-bind="element.config" :is="element['editor-component']"></component>
                            <button class="delete btn btn-danger" @click="deleteItem(1, index)">x</button>
                        </div>

                        <div v-else>
                          <div v-if="element.component == 'FormText'" @click="inspect(element)" class="text-wrapper">
                              <div class="handle">
                                  <i class="fas fa-arrows-alt"></i>
                              </div>
                              <component :editable="textEditable" :class="elementCssClass(element)" @onUpdate="gotUpdate($event, element)" @focused="inspect(element)" v-bind="element.config" :is="element['editor-component']" mode="editor"></component>
                              <button class="delete btn btn-danger" @click="deleteItem(1, index)">x</button>
                          </div>
                          <div v-else>
                              <component :class="elementCssClass(element)" v-bind="element.config" :is="element['editor-component']"></component>
                              <div @click="inspect(element)" class="mask"></div>
                              <button class="delete btn btn-danger" @click="deleteItem(1, index)">x</button>
                          </div>
                        </div>
                    </div>

                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";

import MultiColumn from "../editor/multi-column";

import FormText from "../renderer/form-text";
import FormButton from "../renderer/form-button";
import FormImage from "../renderer/form-image";
import HasColorProperty from "../../mixins/HasColorProperty"

import {
FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup,
  FormDatePicker
  } from "@processmaker/vue-form-elements/src/components";

export default {
  name: 'MultiColumn',
  mixins: [HasColorProperty],
  props: ["value", "selected", "mode"],
  components: {
    draggable,
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormText,
    FormButton,
    MultiColumn,
    FormDatePicker,
    FormImage,
  },
  data() {
    return {
      items: [],
      textEditable: true,
    };
  },
  watch: {
    value: {
      handler: function () {
        this.items = this.value;
      },
      immediate: true
    },
    items() {
      this.$emit("input", this.items);
    }
  },
  methods: {
    onStartDrag() {
      this.textEditable = false;
    },
    onEndDrag() {
      this.textEditable = true;
    },
    gotUpdate(html, element) {
      element.config.label = html;
      element.config.value = html;
    },
    inspect(element) {
      this.$emit('inspect', element)
    },
    deleteItem(col, index) {
      // Remove the item from the array in currentPage
      this.items[col].splice(index, 1);
    },
  }
};
</script>

<style lang="scss" scoped>
.column-draggable {
  border: 1px dashed #000;
  min-height: 48px;
  content: "Drag Controls";
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

</style>
