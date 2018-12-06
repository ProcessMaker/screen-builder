<template>
    <div class="form-group">
        <button @click="click" :class="classList" :name="name" :value="value">{{label}}</button>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: ["variant", "label", "event", "eventData", "name", "value"],
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
            click() {
                Vue.set(this.$parent.data, this.name, this.$attrs.value);
                this.$emit(this.event, this.eventData);
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
