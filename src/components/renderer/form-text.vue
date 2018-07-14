<template>
<div class="form-group">
<div :style="styles">{{value}}</div>
</div>
</template>

<script>
export default {
    props: [
        'value',
        'fontSize',
        'fontWeight'
    ],
    computed: {
        styles() {
            return {
                fontSize: this.fontSize,
                fontWeight: this.fontWeight
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


