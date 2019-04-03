<template>
    <div class="form-group">
        <button @click="click" :class="classList" :name="name" v-model="fieldValue">{{ $t(label) }}</button>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: ["variant", "label", "event", "eventData", "name", "fieldValue"],
        computed: {
            classList() {
                let variant = this.variant || "primary";
                return {
                    btn: true,
                    ["btn-" + variant]: true
                };
            },
        },
        methods: {
            setValue(parent, name, value) {
                if (parent.items) {
                    this.setValue(parent.$parent, name, value);
                } else {
                    Vue.set(parent.data, name, value);
                }
            },
            click() {
                if (this.name) {
                    this.setValue(this.$parent, this.name, this.fieldValue);
                }
                this.$emit(this.event, this.eventData);
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
