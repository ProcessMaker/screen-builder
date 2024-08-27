<template>
    <div class="container mt-4">
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h4>{{ title }}</h4>
        </div>
        <!-- <div class="card-body">
          <div class="text-center">
            <i class="far fa-list-alt fa-5x" />
          </div>
        </div> -->
        <div class="card-body list-table">
        <!-- <template v-if="listOption === 'My Tasks'"> -->
            <!-- <p>esto es lo que está nested</p> -->
        <template>
            <!-- <FormTasks @tasksCount="getData"></FormTasks> -->
            <div>
                <vue-form-renderer
                class="form-collection-record-control"
                v-model="formData" 
                :config="screen" 
                :computed="computed" 
                :custom-css="customCss" 
                :watchers="watchers"/>
            </div>
            <!-- <vue-form-renderer
                ref="nestedScreen"
                class="form-nested-screen"
                :placeholder="'placeholder'"
                v-model="data"
                :config="validatedConfig"
                :ancestor-screens="[...ancestorScreens, screenTitle]"
                mode="preview"
                :computed="computed"
                :custom-css="customCSS"
                :watchers="watchers"
                debug-context="Nested Screen"
                @css-errors="cssErrors = $event"
                :_parent="_parent"
            /> -->
        </template>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import VueFormRenderer from '../vue-form-renderer.vue';
  export default {
    components:{
        VueFormRenderer
    },
    // data() {
    //   return {
    //     title: this.$t("Collection Record Control") // Default Control Title
    //   };
    // },
    data() {
      return {
        formData: {form_input_1: "A", form_input_2: "B"},
        validatedConfig: [{items: [], name: "empty"}],
        ancestorScreens: [],
        computed: [],
        customCSS: null,
        watchers: [],
        cssErrors: "",
        _parent:  undefined,
        screen: [],
      };
    },
    created() {
      window.ProcessMaker.EventBus.$on("option-selected", (option) => {
        // Title is updated when event is received
        this.title = option;
      });
    }
  };
  </script>
  
  <style lang="scss">
  .prevent-interaction.form-collection-record-control::after {
    content: attr(placeholder);
  }
  .prevent-interaction.form-nested-screen::after {
    content: attr(placeholder);
  }

  .list-table {
    height: 300px;
    overflow: hidden;
    background-color: #f9f9f9;
    padding: 0 13.5px 0 0;
}
  </style>
