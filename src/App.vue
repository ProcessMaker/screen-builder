<template>
    <div id="app" class="h-100 mb-3">
        <div class="d-flex m-3">
            <div class="btn-group btn-group-toggle">
              <button type="button" class="btn btn-light" :class="isBuilderActive" @click="mode = 'editor'">
                <i class="fas fa-drafting-compass pr-1"></i>
                Design
              </button>
              <button type="button" class="btn btn-light"  :class="isPreviewActive" @click="mode = 'preview'">
                <i class="fas fa-cog pr-1"></i>
                Preview
              </button>
            </div>
            <div class="ml-auto">
              <button type="button" class="btn btn-light" @click="openComputedProperties">
                <i class="fas fa-flask pr-1"></i>
                Calcs
              </button>
              <button type="button" class="btn btn-light" @click="openCustomCSS">
                <i class="fab fa-css3 pr-1"></i>
                CSS
              </button>
              <button type="button" class="btn btn-light">
                <i class="far fa-save"></i>
              </button>
            </div>
        </div>


        <computed-properties v-model="computed" ref="computedProperties"></computed-properties>
        <custom-CSS v-model="customCSS" ref="customCSS" :cssErrors="cssErrors"/>
        <vue-form-builder ref="builder" @change="updateConfig" v-show="displayBuilder"/>

        <div id="preview" v-show="displayPreview" class="h-100">
          <div class="row">
            <div id="renderer-container" class="col-6 p-4 pt-5 overflow-auto mb-5">
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

            <div class="data-container col-6 shadow-sm pl-0">
              <div id="data-input" class="h-25rem border overflow-auto">
                  <div class="card-header d-flex align-items-center sticky-top header-bg">
                      Data Input
                      <div class="ml-auto">
                          <span v-if="previewInputValid">
                            Valid JSON Data Object
                            <i class="fas fa-check-circle text-success"></i>
                          </span>
                          <span v-else>
                            Invalid JSON Data Object
                            <i class="fas fa-times-circle text-danger"></i>
                          </span>
                      </div>
                  </div>
                  <div class="card-body mb-5">
                      <form-text-area rows="8" v-model="previewInput"></form-text-area>
                  </div>
              </div>

              <div id="data-preview" class="h-25rem border overflow-auto">
                  <div class="card-header sticky-top header-bg">
                      Data Preview
                  </div>
                  <vue-json-pretty :data="previewData" class="card-body"></vue-json-pretty>
              </div>
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
      isBuilderActive() {
        return this.displayBuilder ? 'bg-secondary text-white' : null
      },
      isPreviewActive() {
        return this.displayPreview ? 'bg-secondary text-white' : null
      },
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

    .h-25rem {
      height: 25rem;
    }

    .header-bg {
      background: #f7f7f7;
    }
</style>
