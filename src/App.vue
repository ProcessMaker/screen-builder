<template>
    <div id="app" class="container">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col">
              <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-outline-secondary" @click="mode = 'editor'" ><i class="fas fa-drafting-compass"></i> Design</button>
                <button type="button" class="btn btn-secondary" @click="mode = 'preview'"><i class="fas fa-cogs"></i> Preview</button>
              </div>
            </div>
            <div class="col">

            </div>
            <div class="col text-right">
              <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary" title="Calculated Properties" @click="openComputedProperties"><i class="fas fa-flask"></i> Calcs</button>
                <button type="button" class="btn btn-secondary mr-2" title="Custom CSS" @click="openCustomCSS"><i class="fab fa-css3"></i> CSS</button>
              </div>
              <button type="button" class="btn btn-secondary btn-sm"><i class="fas fa-save"></i></button>
            </div>
          </div>
        </div>
        <computed-properties v-model="computed" ref="computedProperties"></computed-properties>
        <custom-CSS v-model="customCSS" ref="customCSS" :cssErrors="cssErrors"/>
        <vue-form-builder ref="builder" @change="updateConfig" v-show="displayBuilder"/>

        <div id="preview" v-show="displayPreview" class="d-flex h-100">
          <div id="data-input" class="w-25 border">
              <div class="card-header">
                  {{$t('Data Input')}}
              </div>
              <div class="card-body mb-5">
                  <div class="alert"
                      :class="{'alert-success': previewInputValid, 'alert-danger': !previewInputValid}">
                      <span v-if="previewInputValid">{{$t('Valid JSON Data Object')}}</span>
                      <span v-else>{{$t('Invalid JSON Data Object')}}</span>
                  </div>
                  <form-text-area rows="18" v-model="previewInput"></form-text-area>
              </div>
          </div>

          <div id="renderer-container" class="w-50 p-4 pt-5 overflow-auto mb-5">
              <div class="container">
                  <div class="row">
                      <div class="col-sm">
                          <vue-form-renderer ref="renderer"
                                            v-model="previewData"
                                            @submit="previewSubmit"
                                            :config="config"
                                            :computed="computed"
                                            :custom-css="customCSS"
                                            v-on:css-errors="cssErrors = $event"/>
                      </div>
                  </div>
              </div>
          </div>

          <div id="data-preview" class="w-25 border mb-5">
              <div class="card-header">
                  {{$t('Data Preview')}}
              </div>
              <vue-json-pretty :data="previewData" class="card-body"></vue-json-pretty>
          </div>
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
  } from "@processmaker/vue-form-elements";


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
        if (this.previewInputValid) {
          // Copy data over
          this.previewData = JSON.parse(this.previewInput)
        } else {
          this.previewData = {}
        }
      }
    },
    computed: {
      previewInputValid() {
        try {
          JSON.parse(this.previewInput)
          return true
        } catch (err) {
          return false
        }
      },
      displayBuilder() {
        return this.mode === 'editor';
      },
      displayPreview() {
        return this.mode === 'preview';
      }
    },
    mounted() {
      // Iterate through our initial config set, calling this.addControl
      controlConfig.forEach(config => {
        config.control.inspector.push(...globalProperties[0].inspector);

        this.addControl(
          config.control,
          config.rendererComponent,
          config.rendererBinding,
          config.builderComponent,
          config.builderBinding
        );
      });
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
      addControl(control, rendererComponent, rendererBinding, builderComponent, builderBinding) {
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
</style>
