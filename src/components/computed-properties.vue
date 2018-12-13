<template>
    <b-modal ref="modal" size="lg" id="computed-properties" centered hide-footer title="Computed Properties" @hidden="displayTableList">

        <template v-if="displayList">
            <b-row class="float-right">
                <b-col md="6" class="m-2">
                    <b-btn size="sm" variant="primary" @click.stop="displayFormProperty">
                        Add Property
                    </b-btn>
                </b-col>

            </b-row>

            <b-table :items="current" :fields="fields" responsive striped bordered small hover fixed>
                <template slot="actions" slot-scope="row">
                    <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
                    <b-btn size="sm" variant="action" @click.stop="row.toggleDetails" class="mr-2">
                        {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
                    </b-btn>
                    <b-btn size="sm" variant="action" class="mr-2" @click.stop="editProperty(row.item)">
                        Edit
                    </b-btn>
                    <b-btn size="sm" variant="action" class="mr-2"
                           @click.stop="deleteProperty(row.item)">
                        Delete
                    </b-btn>
                </template>
                <template slot="row-details" slot-scope="row">
                    <b-card>
                        <b-row class="mb-1">
                            <b-col sm="3" class="text-sm-right"><b>Field:</b></b-col>
                            <b-col>{{ row.item.property }}</b-col>
                        </b-row>
                        <b-row class="mb-1">
                            <b-col sm="3" class="text-sm-right"><b>Formula (javascript):</b></b-col>
                            <b-col>{{ row.item.formula }}</b-col>
                        </b-row>
                        <b-button class="float-right" size="sm" @click="row.toggleDetails">Hide Details</b-button>
                    </b-card>
                </template>
            </b-table>
        </template>

        <template v-else>
            <form-input v-model="add.name" label="Property Label" name="label property"
                        validation="required"></form-input>
            <form-input v-model="add.property" label="Property Name" name="property name"
                        validation="required"></form-input>
            <form-text-area v-model="add.formula" label="Formula (javascript)" name="formula"
                            validation="required"></form-text-area>
            <button class="btn btn-success float-right m-1" @click="saveProperty" :disabled="disabled">Add Property
            </button>
            <button class="btn btn-secondary float-right m-1" @click="displayTableList">Cancel</button>
        </template>
    </b-modal>
</template>

<script>
    import {
        FormInput,
        FormTextArea,
    } from "@processmaker/vue-form-elements/src/components";

    export default {
        components: {
            FormInput,
            FormTextArea
        },
        props: [
            'value'
        ],
        data() {
            return {
                required: true,
                numberItem: 0,
                displayList: true,
                current: this.value,
                add: {
                    id:0,
                    name: '',
                    property: '',
                    type: 'expression',
                    formula: ''
                },
                fields: [
                    {
                        key: 'property',
                        label: 'Property Name',
                        class: 'text-center',
                        sortable: true,
                    }, {
                        key: 'actions',
                        label: '',
                        class: 'text-center',
                        sortable: false,
                    }
                ],
                items: [
                    {isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald'},
                    {isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw'},
                    {isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson', _showDetails: true},
                    {isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney'}
                ]
            }
        },
        computed: {
            disabled() {
                if (this.add.name.trim() === '' || this.add.property.trim() === '' || this.add.formula.trim() === '') {
                    return true;
                }
                return false;
            }
        },
        methods: {
            show() {
                this.$refs.modal.show()
            },
            emptyForm() {
                this.add.name = 0;
                this.add.name = '';
                this.add.property = '';
                this.add.type= 'expression';
                this.add.formula = '';
            },
            displayTableList() {
                this.emptyForm();
                this.displayList = true;
            },
            displayFormProperty() {
                this.emptyForm();
                this.displayList = false;
            },
            saveProperty() {
                if (this.add.id === 0) {
                    this.numberItem++;
                    this.current.push({
                        id: this.numberItem,
                        property: this.add.property,
                        name: this.add.name,
                        formula: this.add.formula
                    });
                } else {
                    let that = this;
                    this.current.forEach(item => {
                        if (item.id === that.add.id) {
                            item.name = that.add.name;
                            item.property = that.add.property;
                            item.formula = that.add.formula;
                        }
                    });
                }

                this.$emit('input', this.current);
                this.displayTableList();
            },
            editProperty(item) {
                console.log(item);
                this.add.id = item.id;
                this.add.name = item.name;
                this.add.property = item.property;
                this.add.type= 'expression';
                this.add.formula = item.formula;
                this.displayList = false;
            }
        }

    }

</script>

<style lang="scss" scoped>
</style>