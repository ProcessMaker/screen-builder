<template>
    <div class="mb-2">
        <label class="typo__label">{{label}}</label>
        <multiselect
                @input="updateValue"
                :options="multiOptions"
                selectedLabel="Primary"
                placeholder="Select one"
                label="content"
                track-by="value"
                :value="getValue"
                v-model="multiSelected"
        ></multiselect>
        <small v-if="helper" class="form-text text-muted">{{helper}}</small>
    </div>
</template>

<style lang="scss" scoped>
    @import "~vue-multiselect/dist/vue-multiselect.min.css";
</style>

<script>
    import Multiselect from "vue-multiselect";

    export default {
        components: {
            Multiselect
        },
        props: [
            "label",
            "error",
            "selected",
            "value",
            "options",
            "helper",
            "disabled",
            "required",
            "size",
            "name",
            "controlClass",
            "multiple"
        ],
        data() {
            return {
                multiOptions: this.$props.options,
                content: "",
                multiSelected: {}
            };
        },
        computed: {
            getValue() {
                let that = this;
                let index = 0;
                that.options.forEach((item, key) => {
                    if (item.value === that.value) {
                        index = key;
                    }
                });
                that.multiSelected = that.options[index];
                return that.options[index]
            }
        },
        methods: {
            updateValue(value) {
                this.content = value.value;
                this.$emit("input", this.content);
            }
        }
    };
</script>
