<template>
  <div class="container">
    <h3>Conversational Form</h3>
    <div id="cf-context" />
    <task
      ref="task"
      v-model="formData"
      :initial-screen-id="screenId"
      @submit="submit"
    />
  </div>
</template>

<script>

import Vue from 'vue';
// import ConversationalForm from 'package-conversational-forms/resources/js/components/ConversationalForm';
// Vue.component('ConversationalForm', ConversationalForm);

export default {
  data() {
    return {
      screenId: 1,
      formData: {},
    };
  },
  methods: {
    submit() {
      alert('SUBMIT ' + JSON.stringify(this.formData));

      setTimeout(() => {
        this.screenId = 2;
      }, 2000);

    },
  },
};
</script>

<style scoped>
#cf-context {
  border: 1px solid;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  height: 600px;
}
</style>