<template>
    <div class="form-group">
        <div class="container-fluid">
            <div class="row">
                <draggable class="col-sm column-draggable" v-model="items[0]" :options="{group: {name: 'controls'}}">
                    <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in items[0]" :key="index">
                         <div v-if="element.container">
                            <component @inspect="inspect" v-model="element.items" v-bind="element.config" :is="element['editor-component']"></component>
                            <button class="delete btn btn-danger" @click="deleteItem(0, index)">x</button>
                        </div>

                        <div v-else>
                            <component v-bind="element.config" :is="element['editor-component']"></component>
                            <div @click="inspect(element)" class="mask"></div>
                            <button class="delete btn btn-danger" @click="deleteItem(0, index)">x</button>
                        </div>
                    </div>

                </draggable>

                <draggable class="col-sm column-draggable" v-model="items[1]" :options="{group: {name: 'controls'}}">
                    <div class="control-item" :class="{selected: selected === element}" v-for="(element,index) in items[1]" :key="index">
                         <div v-if="element.container">
                            <component @inspect="inspect" v-model="element.items" v-bind="element.config" :is="element['editor-component']"></component>
                            <button class="delete btn btn-danger" @click="deleteItem(1, index)">x</button>
                        </div>

                        <div v-else>
                            <component v-bind="element.config" :is="element['editor-component']"></component>
                            <div @click="inspect(element)" class="mask"></div>
                            <button class="delete btn btn-danger" @click="deleteItem(1, index)">x</button>
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

import {
FormInput,
  FormSelect,
  FormTextArea,
  FormCheckbox,
  FormRadioButtonGroup
  } from "@processmaker/vue-form-elements/src/components";

export default {
  name: 'MultiColumn',
  props: ["value", "selected"],
  components: {
    draggable,
    FormInput,
    FormSelect,
    FormTextArea,
    FormCheckbox,
    FormRadioButtonGroup,
    FormText,
    FormButton,
    MultiColumn
  },
  data() {
    return {
      items: []
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
