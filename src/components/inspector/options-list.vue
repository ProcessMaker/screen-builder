<template>
<div>
<h3>{{label}}</h3>
<table class="table table-sm">
    <thead class="thead-dark">
        <tr>
            <th>Value</th>
            <th>Content</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="(option, index) in options" :key="index">
            <td>{{option.value}}</td>
            <td>{{option.content}}</td>
            <td><button @click="removeOption(index)" class="btn btn-danger btn-sm">x</button></td>
        </tr>
    </tbody>

</table>
<small v-if="helper" class="form-text text-muted">{{helper}}</small>
</div>
</template>

<script>
export default {
    props: [
        'label',
        'options',
        'helper'
    ],
    model: {
      prop: 'options',
      event: 'change'
    },
    methods: {
        removeOption(index) {
            // Convert to plain array
            let newOptions = JSON.parse( JSON.stringify(this.options))
            // Remove index from array
            newOptions.splice(index, 1)
            this.$emit('change', newOptions)
        }

    }
}
</script>

<style lang="scss" scoped>

</style>


