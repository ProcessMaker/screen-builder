<template>
<div class="form-group">
    <button @click="click" :class="classList">{{label}}</button>
</div>
</template>

<script>
export default {
    props: [
        'variant',
        'label',
        'event',
        'eventData'
    ],
    computed: {
        classList() {
            let variant = this.variant || 'primary';
            return {
                btn: true,
                ['btn-' + variant]: true
            }
        }
    },
    methods: {
        click() {
            this.$emit(this.event, this.eventData)
        }
    }

    
}
</script>

<style lang="scss" scoped>

</style>


