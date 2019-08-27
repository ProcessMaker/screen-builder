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
      this.$refs.builder.config.splice(0, Infinity, ...json.screens.config);
      this.$refs.builder.migrateConfig();
      this.computed.splice(0, Infinity, ...json.screens.computed);
      this.customCSS = json.screens.customCSS;
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
