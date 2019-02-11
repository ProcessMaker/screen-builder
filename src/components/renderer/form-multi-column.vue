<template>
    <div class="form-group">
        <div class="container-fluid">
            <div class="row">
                <div class="col">
                    <div v-for="(element,index) in items[0]" :key="index">
                        <div v-if="element.container" class="container">
                            <component :class="elementCssClass(element)" ref="container" v-model="element.items" :transientData="transientData" @submit="submit"
                                       @pageNavigate="pageNavigate" v-bind="element.config"
                                       :is="element['component']">
                            </component>
                        </div>

                        <div v-else>
                            <component :class="elementCssClass(element)" ref="elements" v-model="model[element.config.name]" :validationData="transientData"
                                       @submit="submit" @pageNavigate="pageNavigate" v-bind="element.config"
                                       :is="element['component']" v-show="showElement[element.config.name]">
                            </component>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div v-for="(element,index) in items[1]" :key="index">
                        <div v-if="element.container" class="container">
                            <component :class="elementCssClass(element)" ref="container" v-model="element.items" :transientData="transientData" v-bind="element.config"
                                       @submit="submit" @pageNavigate="pageNavigate"
                                       :is="element['component']">
                            </component>
                        </div>

                        <div v-else>
                            <component :class="elementCssClass(element)" ref="elements" v-model="model[element.config.name]" :validationData="transientData"
                                       v-bind="element.config" @submit="submit" @pageNavigate="pageNavigate"
                                       :is="element['component']" v-show="showElement[element.config.name]">
                            </component>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import draggable from "vuedraggable";

    import FormMultiColumn from "./form-multi-column"
    import HasColorProperty from "../../mixins/HasColorProperty"

    import FormText from "../renderer/form-text";
    import FormButton from "../renderer/form-button";
    import FormImage from "../renderer/form-image";

    import {
        FormInput,
        FormSelect,
        FormTextArea,
        FormCheckbox,
        FormRadioButtonGroup,
        FormDatePicker
    } from "@processmaker/vue-form-elements/src/components";

    export default {
        name: 'FormMultiColumn',
        mixins: [HasColorProperty],
        props: ["value", "selected", "transientData"],
        components: {
            draggable,
            FormInput,
            FormSelect,
            FormTextArea,
            FormCheckbox,
            FormRadioButtonGroup,
            FormText,
            FormButton,
            FormMultiColumn,
            FormDatePicker,
            FormImage,
        },
        data() {
            return {
                items: []
            };
        },
        computed: {
            model() {
                return this.$parent.model;
            },
            showElement() {
                return this.$parent.showElement;
            }
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
            submit() {
                // Just bubble up
                this.$emit('submit')
            },
            pageNavigate(page) {
                // Just bubble up
                this.$emit('pageNavigate', page)

            }
        }
    };
</script>

<style lang="scss" scoped>


</style>


