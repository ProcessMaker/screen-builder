<template>
    <div class="form-group form-image">
      <img v-if="image" :src="image" :width="width" :height="height" :id="id">
      <i v-else class="empty-image far fa-image"></i>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default {
        props: ["id", "image", "width", "height"],
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
                    this.setValue(this.$parent, this.name, this.$attrs.value);
                }
                this.$emit(this.event, this.eventData);
            }
        }
    };
</script>

<style lang="scss" scoped>
  .empty-image {
    font-size: 2em;
  }
  .form-image {
    overflow-x: hidden;
  }
</style>
