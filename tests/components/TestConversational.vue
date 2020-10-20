<template>
  <div class="container">
    <h3>Conversational Form</h3>
    <div id="cf-context"></div>
    
    <h3>Screen</h3>
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
import ConversationalForm from 'package-conversational-forms/resources/js/components/ConversationalForm';
Vue.component('ConversationalForm', ConversationalForm);

export default {
  data() {
    return {
      screenId: 1,
      formData: { name: null },
    };
  },
  methods: {
    submit() {

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