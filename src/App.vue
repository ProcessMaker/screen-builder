<template>
  <div id="app">
    <nav class="navbar  navbar-expand-lg  navbar navbar-dark bg-dark">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" @click="mode = 'editor'" href="#">Editor</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="mode = 'preview'" href="#">Preview</a>
        </li>
      </ul>
    </nav>
    <vue-form-builder @change="updateConfig" :class="{invisible: mode != 'editor'}" />
    <div id="preview" v-if="mode == 'preview'">
      <div id="data-input">
        <div class="card-header">
          Data Input
        </div>
        <div class="alert" :class="{'alert-success': previewInputValid, 'alert-danger': !previewInputValid}">
          <span v-if="previewInputValid">Valid JSON Data Object</span>
          <span v-else>Invalid JSON Data Object</span>
        </div>
        <form-text-area rows="20" v-model="previewInput"></form-text-area>

      </div>
      <div id="renderer-container">
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <vue-form-renderer v-model="previewData" @submit="previewSubmit" v-if="mode == 'preview'" :config="config" />
            </div>
          </div>
        </div>
      </div>
      <div id="data-preview">
        <div class="card-header">
          Data Preview
        </div>
        <vue-json-pretty :data="previewData"></vue-json-pretty> 
      </div>
    </div>
  </div>
</template>

<script>
import VueFormBuilder from "./components/vue-form-builder.vue";
import VueFormRenderer from "./components/vue-form-renderer.vue";
import VueJsonPretty from 'vue-json-pretty'

import {
  FormTextArea,
} from "@processmaker/vue-form-elements/src/components";


export default {
  name: "app",
  data() {
    return {
      mode: "editor",
      config: [
        {
          name: "Default",
          items: []
        }
      ],
      previewData: null,
      previewInput: null
    };
  },
  components: {
    VueFormBuilder,
    VueFormRenderer,
    VueJsonPretty,
    FormTextArea
  },
  watch: {
    previewInput() {
      if(this.previewInputValid) {
        // Copy data over
        this.previewData = JSON.parse(this.previewInput)
      } else {
        this.previewData = null
      }
    }
  },
  computed: {
    previewInputValid() {
      try {
        JSON.parse(this.previewInput)
        return true
      } catch(err) {
        return false
      }
    }
  },
  methods: {
    updateConfig(newConfig) {
      this.config = newConfig
    },
    updatePreview(data) {
      this.previewData = data
    },
    previewSubmit() {
      alert("Preview Form was Submitted")
    }
  }
};
</script>

<style lang="scss">
@import "~bootstrap/dist/css/bootstrap";

html,
body {
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dynaform-builder.invisible {
  display: none;
}

nav {
  min-height: 56px;
}

#preview {
  display: flex;
  flex-grow: 1;

  #renderer-container {
    flex-grow: 1;
    padding-top: 32px;
  }

  #data-input {
    min-width: 340px;
    width: 340px;
    max-width: 340px;
    border-right: 1px solid #e9edf1;
    overflow: auto;
  }


  #data-preview {
    min-width: 340px;
    width: 340px;
    max-width: 340px;
    border-left: 1px solid #e9edf1;
    overflow: auto;
  }
}
</style>
