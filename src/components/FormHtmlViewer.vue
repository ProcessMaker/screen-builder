<template>
  <div class='form-group'>
    <div :class="classList">
      <div v-html="rendered"></div>
    </div>
    <div v-if="(validator && validator.errorCount) || error" class="invalid-feedback">
      <div v-for="(error, index) in validator.errors.get(this.name)" :key="index">{{error}}</div>
      <div v-if="error">{{error}}</div>
    </div>
    <small v-if='helper' class='form-text text-muted'>{{helper}}</small>
  </div>
</template>

<script>
import FormHtmlEditor from './FormHtmlEditor'

export default {
  name: 'FormHtmlViewer',
  extends: FormHtmlEditor,
}
</script>

<style scoped>
.invalid-feedback {
  display: block;
}

.is-invalid {
  border: 1px solid #dc3545;
  border-radius: 0.25rem;
}
</style>
