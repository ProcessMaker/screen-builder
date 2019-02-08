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
        <li class="nav-item">
          <a class="nav-link" @click="openComputedProperties" href="#">Computed Properties</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="openCustomCSS" href="#">Custom CSS</a>
        </li>
      </ul>
    </nav>
    <computed-properties v-model="computed" ref="computedProperties"></computed-properties>
    <custom-CSS v-model="customCSS" ref="customCSS" :cssErrors="cssErrors" />
    <vue-form-builder ref="builder" @change="updateConfig" :class="{invisible: mode != 'editor'}" />
    <div id="preview" :class="{invisible: mode != 'preview'}">
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
              <vue-form-renderer ref="renderer" v-model="previewData" @submit="previewSubmit" :config="config" :computed="computed" :custom-css="customCSS" v-on:css-errors="cssErrors = $event" />
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
import ComputedProperties from "./components/computed-properties.vue";
import CustomCSS from "./components/custom-css.vue";
import VueFormBuilder from "./components/vue-form-builder.vue";
import VueFormRenderer from "./components/vue-form-renderer.vue";
import VueJsonPretty from 'vue-json-pretty';
// Bring in our initial set of controls

import controlConfig from "./form-builder-controls";
import globalProperties from "./global-properties";


import {
  FormTextArea,
} from "@processmaker/vue-form-elements/src/components";


export default {
  name: "app",
  data() {
    return {
      mode: "editor",
      // Computed properties
      computed: [],
      config: [
        {
          name: "Default",
          computed: [],
          items: []
        }
      ],
      previewData: {},
      previewInput: '{}',
      customCSS: "",
      cssErrors: '',
    };
  },
  components: {
    ComputedProperties,
    CustomCSS,
    VueFormBuilder,
    VueFormRenderer,
    VueJsonPretty,
    FormTextArea
  },
  watch: {
    mode(mode) {
      if (mode === 'preview') {
        this.previewData = this.previewInput ? JSON.parse(this.previewInput) : null;
      }
    },
    config() {
      // Reset the preview data with clean object to start
      this.previewData = {}

    },
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
  mounted() {
    // Iterate through our initial config set, calling this.addControl
    for(var i = 0; i < controlConfig.length; i++) {
      //Add new properties global to inspector
      Array.prototype.push.apply(controlConfig[i].control.inspector, globalProperties[0].inspector);
      this.addControl(
        controlConfig[i].control,
        controlConfig[i].rendererComponent,
        controlConfig[i].rendererBinding,
        controlConfig[i].builderComponent,
        controlConfig[i].builderBinding
        )
    }
  },
  methods: {
    openComputedProperties() {
      this.$refs.computedProperties.show();
    },
    openCustomCSS() {
      this.$refs.customCSS.show();
    },
    updateConfig(newConfig) {
      this.config = newConfig
    },
    updatePreview(data) {
      this.previewData = data
    },
    previewSubmit() {
      alert("Preview Form was Submitted")
    },
    addControl(control, rendererComponent, rendererBinding, builderComponent, builderBinding)
    {
      // Add it to the renderer
      this.$refs.renderer.$options.components[rendererBinding] = rendererComponent;
      // Add it to the form builder
      this.$refs.builder.addControl(control, builderComponent, builderBinding)
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
