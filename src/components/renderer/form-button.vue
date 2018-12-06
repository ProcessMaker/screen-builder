<template>
    <div class="form-group">
        <button @click="click" :class="classList" :name="name" :value="reject">{{label}}</button>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: ["variant", "label", "event", "eventData", "name", "value"],
        /*data() {
            return {
                reject: 0,
                approve: 1
            }
        },*/
        /*watch: {
            value(data) {
                console.log('Define values');
                console.log(data);
                let options = data.split(';');
                this.reject = options[0];
                this.approve = options[1];
            },
        },*/
        computed: {
            classList() {
                let variant = this.variant || "primary";
                return {
                    btn: true,
                    ["btn-" + variant]: true
                };
            },
            reject() {
                if (!this.$attrs.value) {
                    return 0;
                }
                let variable = this.$attrs.value.split(':');
                return variable.pop();
            },
            approve() {
                if (!this.$attrs.value) {
                    return 1;
                }
                let variable = this.$attrs.value.split(':');
                return variable.shift();
            }
        },
        methods: {
            click() {
                Vue.set(this.$parent.data, this.name, this.approve);
                this.$emit(this.event, this.eventData);
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
