<template>
    <div>
        <h3>{{label}}</h3>
        <table class="table table-sm">
            <thead class="thead-dark">
            <tr>
                <th>Column</th>
                <th>Colspan</th>
                <th>Actions</th>
            </tr>
            </thead>
            <draggable @update="updateSort" :element="'tbody'" v-model="existingOptions" :options="{group:'options'}"
                       @start="drag=true" @end="drag=false">
                <tr v-for="(option, index) in existingOptions" :key="index">
                    <td>{{option.value}}</td>
                    <td>{{option.content}}</td>
                    <td>
                        <button @click="removeOption(index)" class="btn btn-danger btn-sm">x</button>
                    </td>
                </tr>
            </draggable>

        </table>
        <b-btn v-b-modal.addOptionModal>Add Column</b-btn>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>

        <b-modal @cancel="resetAdd" @ok="addNewOption" id="addOptionModal" title="Add New Option">
            <!--<form-input label="Option Value" v-model="addValue" :error="this.addError"></form-input>-->
            <form-input label="Option Label" v-model="addContent" validate="required|numeric|between:1,12" :error="this.addError"></form-input>
        </b-modal>
    </div>
</template>

<script>
    import draggable from "vuedraggable";

    import {FormInput} from "@processmaker/vue-form-elements/src/components";

    export default {
        components: {
            FormInput,
            draggable
        },
        data() {
            return {
                addValue: "",
                addContent: "",
                addError: "",
                existingOptions: []
            };
        },
        mounted() {
            this.existingOptions = JSON.parse(JSON.stringify(this.options));
        },
        watch: {
            options() {
                this.existingOptions = JSON.parse(JSON.stringify(this.options));
            }
        },
        props: ["label", "options", "helper"],
        model: {
            prop: "options",
            event: "change",
        },
        methods: {
            updateSort() {
                this.existingOptions.forEach((item, index) => {
                    item.value = index + 1;
                });
                let newOptions = JSON.parse(JSON.stringify(this.existingOptions));
                this.$emit('change', newOptions)
            },
            resetAdd() {
                this.addValue = "";
                this.addContent = "";
                this.addError = "";
            },
            addNewOption(event) {
                let newOptions = JSON.parse(JSON.stringify(this.options));

                if(isNaN(this.addContent)) {
                    this.addError = "This value must be numeric";
                    event.preventDefault();
                    return;
                }

                if (!(0 < this.addContent && this.addContent < 13)) {
                    this.addError = "This value must be between 1-12";
                    event.preventDefault();
                    return;
                }
                let newIndex=0,
                    sum = 0;
                this.existingOptions.forEach((item, index) => {
                    newIndex++;
                    sum += Number(item.content);
                    item.value = newIndex;
                });

                if ((sum + Number(this.addContent)) > 12) {
                    this.addError = "The total size of the columns exceeds 12.";
                    event.preventDefault();
                    return;
                }

                newOptions.push({
                    value: newIndex+1,
                    content: this.addContent
                });
                this.$emit("change", newOptions);
                // Reset values
                this.resetAdd();
            },
            removeOption(index) {
                // Convert to plain array
                let newOptions = JSON.parse(JSON.stringify(this.options));
                // Remove index from array
                newOptions.splice(index, 1);
                newOptions.forEach((item, index) => {
                    item.value = index + 1;
                });
                this.$emit("change", newOptions);
                this.$emit("delete", index);
            },
            showAddOptionModal() {
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>


