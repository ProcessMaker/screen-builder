<template>
  <div>
    <label v-if="label && label !== ''">{{ label }}</label>
    <b-card v-if="inPreviewMode" class="mb-2">
      {{ messageForPreview }}
    </b-card>
    <b-card v-else-if="donwloadingNotAvailable" class="mb-2">
      {{ messageForNotAvailable }}
    </b-card>
    <div v-else>
      <template v-if="filesInfo.length > 0">
        <div v-for="(file, idx) in filesInfo" :key="idx"
          :data-cy="file.id + '-' + file.name.replace(/[^0-9a-zA-Z\-]/g, '-')">
          <b-btn v-show="!isReadOnly" class="mb-2 d-print-none" variant="primary" :aria-label="$attrs['aria-label']"
            @click="downloadFile(file)">
            <i class="fas fa-file-download" /> {{ $t("Download") }}
          </b-btn>
          {{ file.file_name }}
        </div>
      </template>
      <div v-else>
        {{ $t("No files available for download") }}
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: ""
    },
    value: {
      type: Number,
      default: null
    },
    endpoint: {
      type: String,
      default: null
    },
    requestFiles: {
      type: Array,
      default: null
    },
    label: {
      type: String,
      default: ""
    },
    transientData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      filesInfo: [],
      prefix: "",
      rowId: null,
      messageForNotAvailable: this.$t("Downloading files is not available."),
      messageForPreview: this.$t(
        "Download button for {{fileName}} will appear here.",
        {
          fileName: this.name
        }
      ),
      inPreviewMode:
        this.$root.$children[0].mode === "preview" && !window.exampleScreens,
      isReadOnly: this.$attrs.readonly ? this.$attrs.readonly : false,
      fileDataName:
        this.prefix + this.name + (this.rowId ? `.${this.rowId}` : "")
    };
  },
  computed: {
    donwloadingNotAvailable() {
      return !this.collection && !this.requestId;
    },
    // inPreviewMode() {
    //   return true;
    // debugger;
    // return (
    //   this.$root.$children[0].mode === "preview" && !window.exampleScreens
    // );
    // },
    // messageForPreview() {

    //   return this.$t("Download button for {{fileName}} will appear here. asdfasdf", {
    //     fileName: this.name
    //   });
    // },
    // messageForNotAvailable() {
    //   return this.$t("Downloading files is not available.");
    // },
    // mode() {
    //   return this.$root.$children[0].mode;
    // },
    // isReadOnly() {
    //   return this.$attrs.readonly ? this.$attrs.readonly : false;
    // },
    // fileDataName() {
    //   return this.prefix + this.name + (this.rowId ? `.${this.rowId}` : "");
    // },
    requestId() {
      const requestIdNode = document.head.querySelector(
        'meta[name="request-id"]'
      );
      return requestIdNode ? requestIdNode.content : null;
    },
    collection() {
      const collectionIdNode = document.head.querySelector(
        'meta[name="collection-id"]'
      );
      return collectionIdNode ? collectionIdNode.content : false;
    },
    requestData() {
      return { _parent: { ...this.$parent._parent }, ...this.transientData };
    }
  },
  watch: {
    value: {
      handler() {
        this.setFilesInfo();
      },
      deep: true
    },
    fileDataName() {
      this.setFilesInfo();
    }
  },
  mounted() {
    if (this.donwloadingNotAvailable) {
      // Not somewhere we can download anything (like web entry start event)
      return;
    }
    this.setFilesInfo();
  },
  methods: {
    downloadFile(file) {
      if (this.collection) {
        this.downloadCollectionFile(file);
      } else {
        this.downloadRequestFile(file);
      }
    },
    requestEndpoint(file) {
      let { endpoint } = this;

      // if (
      //   _.has(window, "PM4ConfigOverrides.useDefaultUrlDownload") &&
      //   window.PM4ConfigOverrides.useDefaultUrlDownload
      // ) {
      //   // Use default endpoint when coming from a package.
      //   return `../files/${file.id}/contents`;
      // }

      // if (_.has(window, "PM4ConfigOverrides.getFileEndpoint")) {
      //   endpoint = window.PM4ConfigOverrides.getFileEndpoint;
      //   return `${endpoint}/${file.id}`;
      // }
      if (
        window.PM4ConfigOverrides &&
        window.PM4ConfigOverrides.useDefaultUrlDownload
      ) {
        return `../files/${file.id}/contents`;
      }

      if (
        window.PM4ConfigOverrides &&
        window.PM4ConfigOverrides.getFileEndpoint
      ) {
        endpoint = window.PM4ConfigOverrides.getFileEndpoint;
        return `${endpoint}/${file.id}`;
      }

      return `/files/${file.id}/contents`;
    },
    setPrefix() {
      if (this.name.startsWith("_parent.")) {
        // do not set the loop prefix
        return;
      }
      let parent = this.$parent;
      let i = 0;
      while (parent && !parent.loopContext) {
        parent = parent.$parent;

        if (parent === this.$root) {
          parent = null;
          break;
        }

        if (++i > 100) {
          throw console.error("Loop Error");
        }
      }

      if (parent && parent.loopContext) {
        this.prefix = `${parent.loopContext}.`;
      }
    },
    downloadRequestFile(file) {
      this.$dataProvider
        .download(this.requestEndpoint(file))
        .then((response) => {
          this.sendToBrowser(response, file);
        });
    },
    downloadCollectionFile(file) {
      this.$dataProvider
        .download(`/files/${file.id}/contents`)
        .then((response) => {
          this.sendToBrowser(response, file);
        });
    },
    sendToBrowser(response, file) {
      // axios needs to be told to open the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.file_name);
      document.body.appendChild(link);
      link.click();
    },
    setFilesInfo() {
      if (this.collection) {
        this.setPrefix();
        this.setFilesInfoFromCollectionValue();
      } else {
        this.setFilesInfoFromRequest();
      }
    },
    setFilesInfoFromRequest() {
      debugger;
      const fileId = this.value
        ? this.value
        : _.get(this.requestData, this.fileDataName, null);
      let { endpoint } = this;

      if (this.requestFiles) {
        this.filesInfo.push(_.get(this.requestFiles, this.fileDataName, null));
        return;
      }

      if (!this.requestId || !fileId) {
        return;
      }

      if (!endpoint) {
        endpoint = `requests/${this.requestId}/files?id=${fileId}`;
        if (_.has(window, "PM4ConfigOverrides.getFileEndpoint")) {
          endpoint = window.PM4ConfigOverrides.getFileEndpoint;
          endpoint += `/${fileId}`;
        }
      }

      this.$dataProvider.get(endpoint).then((response) => {
        const fileInfo = response.data.data
          ? _.get(response, "data.data.0", null)
          : _.get(response, "data", null);
        if (fileInfo) {
          this.filesInfo.push(fileInfo);
        } else {
          window.ProcessMaker.alert(
            this.$t("File ID does not exist"),
            "danger"
          );
        }
      });
    },
    setFilesInfoFromCollectionValue() {
      const files = this.value
        ? this.value
        : _.get(this.requestData, this.fileDataName);
      if (!this.value && !files) {
        this.filesInfo = [];
        return;
      }
      this.filesInfo = [this.value ? this.value : files];
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
