<template>
    <div id="renderer-container">
        <div v-for="(element,index) in config[currentPage]['items']" :key="index">

            <div v-if="element.container"
                 v-show="showElement[element.config.name] !== undefined ? showElement[element.config.name] : true">

                <component :class="elementCssClass(element)" ref="container" selected="selected"
                           :transientData="transientData" v-model="element.items"
                           @submit="submit" :config="element.config"
                           :name="element.config.name !== undefined ? element.config.name : null"
                           @pageNavigate="pageNavigate" v-bind="element.config" :is="element['component']">
                </component>
            </div>

            <div v-else>
                <component :class="elementCssClass(element)" ref="elements" :validationData="transientData"
                           v-model="model[element.config.name]" @submit="submit"
                           v-show="showElement[element.config.name] !== undefined ? showElement[element.config.name] : true"
                           @pageNavigate="pageNavigate"
                           :name="element.config.name !== undefined ? element.config.name : null"
                           v-bind="element.config" :is="element['component']">
                </component>
            </div>

        </div>
        <custom-css>{{ customCssWrapped }}</custom-css>
    </div>
</template>

<script>
    import Vue from 'vue';
    import * as VueDeepSet from 'vue-deepset';
    import _ from 'lodash';
    import HasColorProperty from "../mixins/HasColorProperty"

    var Parser = require('expr-eval').Parser;
    var csstree = require('css-tree');

    Vue.component('custom-css', {
        render: function (createElement) {
            return createElement('style', this.$slots.default);
        }
    });

    Vue.use(VueDeepSet);

    export default {
        name: 'VueFormRenderer',
        props: ["config", "data", "page", "computed", "customCss"],
        model: {
            prop: 'data',
            event: 'update'
        },
        mixins: [HasColorProperty],
        computed: {
            model() {
                return this.$deepModel(this.transientData)
            },
            showElement() {
                let display = {};
                let that = this;
                that.config.forEach(page => {
                    page.items.forEach(item => {
                        Object.assign(display, this.exploreItems(item, that, {}))
                    });
                });
                return that.$deepModel(display);
            },
        },
        data() {
            return {
                valid: true,
                errors: [],
                currentPage: this.page ? this.page : 0,
                transientData: JSON.parse(JSON.stringify(this.data)),
                defaultValues: {
                    'FormInput': '',
                    'FormSelect': null,
                    'FormCheckbox': false,
                    'FormRadioButtonGroup': null,
                    'FormTextArea': '',
                    'FormText': '',
                    'FormDatePicker': null,
                    'FormRecordList': [],
                },
                customCssWrapped: '',
            };
        },
        watch: {
            data() {
                this.transientData = JSON.parse(JSON.stringify(this.data))
            },
            transientData: {
                handler: function () {
                    let that = this;
                    if (that.computed) {
                        that.computed.forEach((prop) => {
                            let value;
                            try {
                                value = Parser.evaluate(prop.formula, that.transientData);
                            } catch (e) {
                                value = String(e);
                            }
                            this.$set(that.transientData, prop.property, value);
                            this.$set(that.data, prop.property, value);
                        });
                    }
                    // Only emit the update message if transientData does NOT equal this.data
                    // Instead of deep object property comparison, we'll just compare the JSON representations of both
                    if (JSON.stringify(that.transientData) != JSON.stringify(that.data)) {
                        that.$emit("update", that.transientData);
                        return;
                    }
                },
                deep: true
            },
            customCss() {
                this.parseCssDebounce();
            }
        },
        mounted() {
            this.parseCss();
        },
        methods: {
            submit() {
                if (this.isValid()) {
                    this.setDefaultValues();
                    this.$emit("submit", this.transientData);
                }
            },
            exploreItems(element, context, fields) {
                let name;
                if (element && element.component && element.component === "FormMultiColumn") {
                    element.items.forEach(container => {
                        container.forEach(itemsContainer => {
                            Object.assign(fields, this.exploreItems(itemsContainer, context, fields))
                        });
                    });
                }
                name = element.config.name;
                //Element always visible when not have field conditional hide.
                fields[name] = true;
                if (element.config.conditionalHide) {
                    try {
                        //when conditional is evaluated
                        //evaluation is true field is displayed
                        //evaluation is false field is hidden.
                        fields[name] = (Boolean(Parser.evaluate(element.config.conditionalHide, context.transientData)) === true);
                    } catch (e) {
                        //conditional can't be evaluated, element hidden.
                        fields[name] = false
                    }
                }
                return fields;
            },
            validateElements(elements) {
                elements.forEach(element => {
                    if (element.validator && element.validator.errorCount !== 0) {
                        this.valid = false;
                        this.errors.push(element.validator.errors.errors);
                    }
                });
            },
            validateContainer(container) {
                if (container.$refs && container.$refs.container) {
                    this.validateContainer(container.$refs.container);
                }
                container.forEach(element => {
                    if (element.$refs && element.$refs.elements) {
                        this.validateElements(element.$refs.elements);
                    }
                });
            },
            isValid() {
                this.errors = [];
                this.valid = true;

                if (this.$refs && this.$refs.elements) {
                    this.validateElements(this.$refs.elements);
                }

                if (this.$refs && this.$refs.container) {
                    this.validateContainer(this.$refs.container);
                }
                return this.valid;
            },
            pageNavigate(page) {
                this.currentPage = page;
            },
            setDefaultValues() {
                // Iterate through config, if item has a name property,
                // then we set the default value
                this.config.forEach(page => {
                    page.items.forEach(item => {
                        this.setDefaultValueItem(item);
                    });
                });
            },
            setDefaultValueItem(item) {
                if (item.component === 'FormMultiColumn') {
                    item.items.forEach((column) => {
                        column.forEach((innerItem) => {
                            this.setDefaultValueItem(innerItem);
                        });
                    });
                }
                if (item.config.name && this.defaultValues[item.component] !== undefined) {
                    this.data[item.config.name] === undefined ? this.$set(this.data, item.config.name, this.defaultValues[item.component]) : null;
                    this.transientData[item.config.name] === undefined ? this.$set(this.transientData, item.config.name, this.defaultValues[item.component]) : null;
                }
            },
            parseCssDebounce: _.debounce(function () {
                this.parseCss();
            }, 500),
            parseCss() {
                let containerSelector = 'div#renderer-container';
                try {
                    var ast = csstree.parse(this.customCss, {
                        onParseError: function (error) {
                            // throw "CSS has the following errors:\n\n" + error.formattedMessage
                            throw error.formattedMessage;
                        }
                    });
                    var i = 0;
                    csstree.walk(ast, function (node, item, list) {
                        if (node.type === 'Atrule' && list) {
                            throw "CSS 'At-Rules' (starting with @) are not allowed."
                        }
                        if (node.type.match(/^.+Selector$/) && node.name !== containerSelector && list) {
                            // Wait until we get to the first item before prepending our container selector
                            if (!item.prev) {
                                list.prependData({type: "WhiteSpace", loc: null, value: " "});
                                list.prependData({type: "TypeSelector", loc: null, name: containerSelector});
                            }
                        }
                        if (i > 5000) {
                            throw "CSS is too big"
                        }
                        i = i + 1;
                    });

                    this.customCssWrapped = csstree.generate(ast);

                    // clear errors
                    this.$emit('css-errors', '');

                } catch (error) {
                    this.$emit('css-errors', error);
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
