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
        <div
          v-for="(file, idx) in filesInfo"
          :key="idx"
          :data-cy="file.id + '-' + file.name.replace(/[^0-9a-zA-Z\-]/g, '-')"
        >
          <b-btn
            v-show="!isReadOnly"
            class="mb-2 d-print-none"
            variant="primary"
            :aria-label="$attrs['aria-label']"
            @click="downloadFile(file)"
          >
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
  props: [
    "name",
    "value",
    "endpoint",
    "requestFiles",
    "label",
    "transient-data"
  ],
  data() {
    return {
      filesInfo: [],
      prefix: "",
      rowId: null
    };
  },
  computed: {
    donwloadingNotAvailable() {
      return !this.collection && !this.requestId;
    },
    inPreviewMode() {
      return this.mode === "preview" && !window.exampleScreens;
    },
    messageForPreview() {
      return this.$t("Download button for {{fileName}} will appear here.", {
        fileName: this.name
      });
    },
    messageForNotAvailable() {
      return this.$t("Downloading files is not available.");
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    isReadOnly() {
      return this.$attrs.readonly ? this.$attrs.readonly : false;
    },
    fileDataName() {
      return this.prefix + this.name + (this.rowId ? `.${this.rowId}` : "");
    },
    requestId() {
      const node = document.head.querySelector(`meta[name="request-id"]`);
      if (node === null) {
        return null;
      }
      return node.content;
    },
    collection() {
      const collectionIdNode = document.head.querySelector(
        `meta[name="collection-id"]`
      );
      if (collectionIdNode) {
        return collectionIdNode.content;
      }
      return false;
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

    if (this.collection && this.value) {
      // eslint-disable-next-line vue/no-mutating-props
      this.value.file_name = this.value.name;
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

      if (
        _.has(window, "PM4ConfigOverrides.useDefaultUrlDownload") &&
        window.PM4ConfigOverrides.useDefaultUrlDownload
      ) {
        // Use default endpoint when coming from a package.
        if (this.requestId) {
          return `requests/${this.requestId}/files/${file.id}/contents`;
        }
        return `../files/${file.id}/contents`;
      }

      if (_.has(window, "PM4ConfigOverrides.getFileEndpoint")) {
        endpoint = window.PM4ConfigOverrides.getFileEndpoint;
        return `${endpoint}/${file.id}/contents`;
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
      while (!parent.loopContext) {
        parent = parent.$parent;

        if (parent === this.$root) {
          parent = null;
          break;
        }

        i++;
        if (i > 100) {
          throw new Error("Loop Error");
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
      const fileId = this.value
        ? this.value
        : _.get(this.requestData, this.fileDataName, null);
      let { endpoint } = this;

      if (this.requestFiles) {
        this.filesInfo.push(_.get(this.requestFiles, this.fileDataName, null));
        return;
      }

      if (!this.requestId || !fileId) {
        this.filesInfo = [];
        return;
      }

      if (!endpoint) {
        endpoint = `requests/${this.requestId}/files?id=${fileId}`;
        if (_.has(window, "PM4ConfigOverrides.getFileEndpoint")) {
          endpoint = window.PM4ConfigOverrides.getFileEndpoint;
          endpoint += `/${fileId}`;
        }
      }

      this.$dataProvider
        .get(endpoint)
        .then((response) => {
          const fileInfo = response.data.data
            ? _.get(response, "data.data.0", null)
            : _.get(response, "data", null);
          if (fileInfo) {
            if (typeof this.value === "number" && this.filesInfo.length > 0) {
              this.filesInfo[0] = fileInfo;
            } else {
              this.filesInfo.push(fileInfo);
            }
          } else {
            console.log(this.$t("File ID does not exist"));
          }
        })
        .catch((error) => {
          const alert = document.querySelector(".alert-danger");

          if (!alert) {
            let message = this.$t(
              "Something went wrong and the file cannot be previewed or downloaded."
            );

            if (error?.response?.data?.message) {
              message = error.response.data.message;
            }

            if (
              error?.response?.status === 404 ||
              error?.response?.data?.message
            ) {
              window.ProcessMaker.alert(message, "danger");
            }
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
