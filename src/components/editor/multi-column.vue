<template>
    <div :class="classContainer">
        <div class="container-fluid">
            <div class="row">
                <template v-for="(item, index) in items">

                    <draggable :class="classColumn(index)" v-model="items[index]"
                               :options="{group: {name: 'controls'}}" :key="index"
                               @start="onStartDrag" @end="onEndDrag">

                        <div class="control-item" :class="{selectedElement: selected === element}"
                             v-for="(element,row) in item" :key="row">

                            <div v-if="element.container">
                                <component :class="elementCssClass(element)"
                                           :selected="selectedElement"
                                           @inspect="inspect"
                                           v-model="element.items"
                                           v-bind="element.config"
                                           :is="element['editor-component']"
                                           :name="element.config.name"
                                           :id="element.config.name">
                                           </component>
                                <button class="delete btn btn-sm btn-danger" @click="deleteItem(index, row)">x</button>
                            </div>

                            <div v-else>
                                <div v-if="element.component == 'FormText'" @click.stop="inspect(element)" class="text-wrapper">
                                    <div class="handle">
                                        <i class="fas fa-arrows-alt"></i>
                                    </div>
                                    <component :editable="textEditable"
                                               :name="element.config.name"
                                               :id="element.config.name"
                                               :class="elementCssClass(element)"
                                               @onUpdate="gotUpdate($event, element)"
                                               @focused="inspect(element)"
                                               v-bind="element.config"
                                               :is="element['editor-component']"
                                               mode="editor">
                                               </component>
                                    <button class="delete btn btn-danger" @click="deleteItem(index, row)">x</button>
                                </div>
                                <div v-else class="mask-wrapper">
                                    <component :class="elementCssClass(element)"
                                               v-bind="element.config"
                                               :is="element['editor-component']"
                                               :name="element.config.name"
                                               :id="element.config.name">
                                               </component>
                                    <div @click.stop="inspect(element)" class="mask"></div>
                                    <button class="delete btn btn-danger" @click="deleteItem(index, row)">x</button>
                                </div>
                            </div>

                        </div>

                    </draggable>

                </template>
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
        props: ["value", "name", "config", "selected"],
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
        computed : {
            classContainer() {
                return this.items.length > 0 ? 'form-group': 'column-draggable';
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
            classColumn(index) {
                let column = 1;
                if (this.items.length < this.config.options.length) {
                    this.items.push([]);
                }
                if (this.config.options[index] && this.config.options[index].content) {
                    column = this.config.options[index].content;
                }
                return 'col-sm-' + column + ' column-draggable';
            },
            inspect(element) {
                this.$emit('inspect', element)
            },
            deleteItem(col, index) {
                // Remove the item from the array in currentPage
                this.items[col].splice(index, 1);
            }
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
        .mask-wrapper, .text-wrapper {
          position: relative;
        }

        .delete {
            position: absolute;
            top: 0px;
            right: 0px;
            display: none;
        }

        &.selected,
        &:hover {
            .mask, .text-wrapper {
                border: 1px solid red;
            }
            .text-wrapper {
              margin: -1px;
            }

            .delete {
                display: inline-block;
            }
        }

        .text-wrapper .handle { 
            cursor: grab;
            text-align: center;
            &:hover {
                background-color: rgba(0, 0, 0, .1);
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
