<template>
    <div>
        <form-select v-model="target" :label="label" :options="options" :helper="helper"></form-select>
    </div>
</template>


<script>
import {
    FormSelect
} from '@processmaker/vue-form-elements/src/components'
export default {
    props: [
        'label',
        'helper',
        'formConfig',
        'value'
    ],
    data() {
        return {
            target: 0
        }
    },
    watch: {
        value: {
            handler: function() {
                if(this.target != this.value) {
                    this.target = this.value
                }
            },
            immediate: true
        },
        target: function() {
            if(this.value != this.target) {
                this.$emit('input', this.target)
            }
        }
    },
    components: {
        FormSelect
    },
    computed:  {
        options() {
            let options = [];
            // Get the page values (array index), and the content (page title)
            for(var index in this.formConfig) {
                options.push({
                    value: index,
                    content: this.formConfig[index].name
                })
            }
            return options;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


