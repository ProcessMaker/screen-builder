<template>
    <div v-if="displayErrors" class="invalid-feedback">
      <div v-for="(error, index) in displayErrors" :key="index">{{error}}</div>
    </div>
</template>

<script>
  export default {
    props: [
      'name',
      'error',
      'validator',
    ],
    computed: {
      displayErrors() {
        let errors = [];
        if (this.error) {
          errors.push(this.error);
        }
        if (this.name && this.validator &&  this.validator.errors.errors[this.name]) {
          this.validator.errors.errors[this.name].forEach(error => {
            errors.push(error);
          });
        }
        return errors;
      }
    }
  }
</script>

