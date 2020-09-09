import FileUpload from 'vue-upload-component';

const reader = new FileReader();

export default {
  components: { FileUpload },
  data() {
    return {
      uploadedJson: null,
      jsonFiles: [],
    };
  },
  watch: {
    jsonFiles([fileObject]) {
      if (fileObject) {
        reader.readAsText(fileObject.file);
      }
    },
  },
  methods: {
    loadScreenPackage() {
      const json = JSON.parse(this.uploadedJson);
      let screen;
      if (json instanceof Array) {
        screen = { config:json, computed: [], customCSS: null };
      } else if (json && json.screens instanceof Array) {
        screen = json.screens[1];
        if (window.exampleScreens instanceof Array) {
          window.exampleScreens = json.screens;
        }
      } else if (json && json.screens && json.screens.config) {
        screen = json.screens;
      }
      this.$refs.builder.config.splice(0, Infinity, ...screen.config);
      this.$refs.builder.migrateConfig();
      this.computed.splice(0, Infinity, ...screen.computed);
      this.customCSS = screen.customCSS;
    },
    clearUpload() {
      this.uploadedJson = null;
      this.jsonFiles = [];
    },
    setUploadedJson(event) {
      this.uploadedJson = event.target.result;
    },
  },
  created() {
    reader.onload = this.setUploadedJson;
  },
};
