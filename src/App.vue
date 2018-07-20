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
      <div id="renderer-container">
        <div class="container">
          <div class="row">
            <div class="col-sm">
              <vue-form-renderer @submit="previewSubmit" @update="updatePreview" v-if="mode == 'preview'" :config="config" />
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
      previewData: null
    };
  },
  components: {
    VueFormBuilder,
    VueFormRenderer,
    VueJsonPretty
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

  #data-preview {
    min-width: 340px;
    width: 340px;
    max-width: 340px;
    border-left: 1px solid #e9edf1;
    overflow: auto;
  }
}
</style>
