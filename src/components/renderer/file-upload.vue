<template>
  <div>
    <label v-uni-for="name">{{ label }}</label>
    <b-card v-if="inPreviewMode" class="mb-2">
      {{ $t("File uploads are unavailable in preview mode.") }}
    </b-card>
    <uploader
      v-else
      ref="uploader"
      :options="options"
      :attrs="attrs"
      :class="{ 'was-validated': required }"
      @complete="complete"
      @upload-start="start"
      @file-removed="removed"
      @file-success="fileUploaded"
      @file-added="addFile"
    >
      <uploader-unsupport />

      <uploader-drop v-if="uploaderLoaded" class="form-control-file">
        <p>{{ $t("Drop a file here to upload or") }}</p>
        <uploader-btn
          :attrs="nativeButtonAttrs"
          :class="{ disabled: disabled }"
          tabindex="0"
          :aria-label="ariaLabel"
          class="btn btn-secondary text-white"
          @keyup.native="browse"
        >
          {{ $t("select file") }}
        </uploader-btn>
        <span v-if="validation === 'required' && !value" class="required">
          {{ $t("Required") }}
        </span>
      </uploader-drop>
      <uploader-list>
        <template slot-scope="{ fileList }">
          <ul v-if="uploading">
            <li v-for="file in fileList" :key="file.id">
              <uploader-file :file="file" :list="true" />
            </li>
          </ul>
          <ul v-else>
            <li v-for="(file, i) in files" :key="i" :data-cy="file.id">
              <div>
                <div class="d-flex file-upload-item">
                  <div
                    v-if="nativeFiles[file.id]"
                    class="overflow-hidden flex-grow-1"
                    :data-cy="file.file_name.replace(/[^0-9a-zA-Z\-]/g, '-')"
                  >
                    <uploader-file :file="nativeFiles[file.id]" :list="true" />
                  </div>
                  <div
                    v-else
                    class="text-truncate flex-grow-1"
                    :title="file.file_name"
                  >
                    <i class="fas fa-paperclip" /> {{ file.file_name }}
                  </div>
                  <div class="pt-1">
                    <b-btn
                      v-b-tooltip.hover
                      variant="outline"
                      :title="$t('Delete')"
                      @click="removeFile(file)"
                    >
                      <i class="fas fa-trash-alt" />
                    </b-btn>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </uploader-list>
      <div class="invalid-feedback" :class="{ 'd-block': required && !value }">
        {{ $t("Field is required") }}
      </div>
    </uploader>

    <div v-if="error" class="invalid-feedback">{{ error }}</div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
// eslint-disable no-param-reassign
import { createUniqIdsMixin } from "vue-uniq-ids";
import uploader from "vue-simple-uploader";
import _ from "lodash";

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

// vue-simple-uploader tries to call these after the component has
// been destroyed since it does it in nextTick(). It has no effect
// on functionality because a new copy is created.
// TODO: Why is this component being recreated when used in a loop?
const ignoreErrors = [
  "Cannot read property 'assignBrowse' of null",
  "Cannot read property 'assignDrop' of null",
  "Cannot read properties of null (reading 'assignBrowse')",
  "Cannot read properties of null (reading 'assignDrop')"
];

export default {
  components: uploader,
  mixins: [uniqIdsMixin],
  props: [
    "label",
    "error",
    "helper",
    "name",
    "value",
    "controlClass",
    "endpoint",
    "accept",
    "validation",
    "parent",
    "config",
    "multipleUpload",
    "ariaLabel"
  ],
  data() {
    return {
      uploaderId: 1,
      content: "",
      validator: {
        errorCount: 0,
        errors: []
      },
      prefix: "",
      row_id: null,
      options: {
        target: this.getTargetUrl,
        // We cannot increase this until laravel chunk uploader handles this gracefully
        simultaneousUploads: 1,
        query: {
          chunk: true,
          data_name: this.name,
          parent: null,
          row_id: null
        },
        testChunks: false,
        // Setup our headers to deal with API calls
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRF-TOKEN":
            window.ProcessMaker.apiClient.defaults.headers.common[
              "X-CSRF-TOKEN"
            ]
        },
        singleFile: !this.multipleUpload
      },
      attrs: {
        accept: this.accept
      },
      disabled: false,
      files: [],
      nativeFiles: {},
      uploading: false
    };
  },
  computed: {
    filesData() {
      if (this.collection) {
        return this.filesFromCollection();
      }
      return this.filesFromGlobalRequestFiles();
    },
    fileIds() {
      return this.files.map((f) => f.id);
    },
    nativeButtonAttrs() {
      const attrs = { "data-cy": "file-upload-button" };
      if (this.disabled) {
        attrs.disabled = true;
      }
      return attrs;
    },
    required() {
      if (this.config && this.config.validation) {
        return this.config.validation === "required";
      }
      return false;
    },
    inPreviewMode() {
      return (
        (this.mode === "preview" && !window.exampleScreens) ||
        this.mode === "editor"
      );
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    classList() {
      return {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass
      };
    },
    inProgress() {
      return this.$refs.uploader.fileList.some(
        (file) => file._prevProgress < 1
      );
    },
    filesAccept() {
      if (!this.accept) {
        return null;
      }

      const accept = [];

      this.accept.split(",").forEach((item) => {
        accept.push(item.trim());
      });
      return accept;
    },
    fileDataName() {
      return this.prefix + this.name + (this.row_id ? `.${this.row_id}` : "");
    }
  },
  watch: {
    filesData: {
      handler() {
        this.setFiles();
      }
    },
    files: {
      handler() {
        if (!this.collection) {
          this.setRequestFiles();
        }
        this.$emit("input", this.valueToSend());
      }
    },
    name: {
      handler() {
        this.options.query.data_name = this.fileDataName;
      }
    },
    parent: {
      handler() {
        this.options.query.parent = this.parent;
      }
    },
    prefix: {
      handler() {
        this.options.query.data_name = this.fileDataName;
      }
    },
    row_id: {
      handler() {
        this.options.query.row_id = this.row_id;
        this.options.query.data_name =
          this.prefix + this.name + (this.row_id ? `.${this.row_id}` : "");
      },
      immediate: true
    },
    multipleUpload: {
      handler() {
        // Add the multiple parameter for the endpoint call that will be executed by vue-simple-uploader
        this.options.query.multiple = this.multipleUpload;
      },
      immediate: true
    }
  },
  updated() {
    this.removeDefaultClasses();
  },
  created() {
    this.collection = this.getCollectionId();
  },
  mounted() {
    this.setFiles();
    this.options.query.data_name = this.fileDataName;
    this.options.query.parent = this.parent;

    this.$root.$on("set-upload-data-name", (recordList, index, id) =>
      this.listenRecordList(recordList, index, id)
    );

    this.$root.$on("removed-record", (recordList, record) =>
      this.listenRemovedRecord(recordList, record)
    );

    this.$root.$on("removed-loop", (loop, removed) =>
      this.listenRemovedLoop(loop, removed)
    );

    this.removeDefaultClasses();

    this.setPrefix();
    if (this.$refs.uploader) {
      this.$refs.uploader.$forceUpdate();
    }

    this.disabled = _.get(window, "ProcessMaker.isSelfService", false);
  },
  methods: {
    getCollectionId() {
      const collectionIdNode = document.head.querySelector(
        "meta[name='collection-id']"
      );
      if (collectionIdNode) {
        return collectionIdNode.content;
      }
      return false;
    },
    filesFromCollection() {
      if (!this.value) {
        return [];
      }
      return this.filesFromCollectionValue(this.value);
    },
    filesFromGlobalRequestFiles() {
      if (!this.value) {
        return [];
      }
      return _.get(
        window,
        `PM4ConfigOverrides.requestFiles["${this.fileDataName}"]`,
        []
      ).filter((file) => {
        // Filter any requestFiles that don't exist in this component's value. This can happen if
        // a file is uploaded but the task is not saved.
        if (this.multipleUpload) {
          return this.value.some((valueFile) => valueFile.file === file.id);
        }
        return file.id === this.value;
      });
    },
    uploaderLoaded() {
      return this.$refs.uploader;
    },
    setFiles() {
      if (_.isEqual(this.filesData, this.files)) {
        return;
      }
      this.files = this.filesData;
    },
    filesFromCollectionValue(value) {
      if (!value) {
        return [];
      }
      if (this.multipleUpload) {
        return this.filesFromCollectionMulti(value);
      }
      return this.filesFromCollectionSingle(value);
    },
    filesFromCollectionSingle(value) {
      return [{ id: value.id, file_name: value.name }];
    },
    filesFromCollectionMulti(value) {
      return value.map((v) => {
        return { id: v.file.id, file_name: v.file.name };
      });
    },
    setRequestFiles() {
      _.set(
        window,
        `PM4ConfigOverrides.requestFiles["${this.fileDataName}"]`,
        this.files
      );
      this.$emit("input", this.valueToSend());
    },
    valueToSend() {
      if (this.multipleUpload) {
        return this.valueForMulti();
      }
      return this.valueForSingle();
    },
    valueForMulti() {
      return this.files.map((file) => {
        return { file: this.formatForType(file) };
      });
    },
    valueForSingle() {
      if (this.files.length > 0) {
        return this.formatForType(this.files[0]);
      }
      return null;
    },
    formatForType(file) {
      if (this.collection) {
        return { id: file.id, name: file.file_name };
      }
      return file.id;
    },
    hasFileId(id) {
      return this.fileIds.includes(id);
    },
    listenRemovedLoop(loop, removed) {
      this.deleteAssociatedFiles(removed);
    },
    listenRemovedRecord(recordList, record) {
      const parent = this.parentRecordList(this);
      if (parent !== recordList) {
        return;
      }
      this.deleteAssociatedFiles(record);
    },
    async deleteAssociatedFiles(object) {
      Object.keys(object).forEach(async (prop) => {
        if (prop === this.name && object[prop]) {
          const idsInRemoved = this.idsFromValue(object[prop]);
          idsInRemoved.forEach(async (id) => {
            if (this.hasFileId(id)) {
              // In record lists, delete can be called twice on the same file.
              // Catch and igore the error.
              // eslint-disable-next-line no-unused-vars
              await this.$dataProvider.deleteFile(id).catch((e) => {});
              this.removeFromFiles(id);
            }
          });
        }
      });
    },
    idsFromValue(value) {
      if (this.collection) {
        return this.filesFromCollectionValue(value).map((f) => f.id);
      }
      if (this.multipleUpload) {
        return value.map((v) => v.file);
      }
      return [value];
    },
    async removeFile(file) {
      const { id } = file;
      const token = file.token ? file.token : null;

      // If it's not a web entry start event
      if (!Number.isNaN(Number(id))) {
        await this.$dataProvider.deleteFile(id, token);
      }

      this.removeFromFiles(id);
    },
    removeFromFiles(id) {
      const idx = this.files.findIndex((f) => f.id === id);
      this.$delete(this.files, idx);

      if (this.nativeFiles[id]) {
        if (this.$refs.uploader) {
          this.$refs.uploader.uploader.removeFile(this.nativeFiles[id]);
        }
        this.$delete(this.nativeFiles, id);
      }
    },
    addToFiles(fileInfo) {
      if (this.multipleUpload) {
        this.files.push(fileInfo);
      } else {
        this.files = [fileInfo];
      }
    },
    listenRecordList(recordList, index, id) {
      const parent = this.parentRecordList(this);
      if (parent !== recordList) {
        return;
      }
      this.row_id = parent !== null ? id : null;
    },
    setPrefix() {
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
    addFile(file) {
      if (this.disabled) {
        // eslint-disable-next-line no-param-reassign
        file.ignored = true;
        return false;
      }

      if (this.filesAccept) {
        // eslint-disable-next-line no-param-reassign
        file.ignored = true;
        if (this.filesAccept.indexOf(file.fileType) !== -1) {
          // eslint-disable-next-line no-param-reassign
          file.ignored = false;
        }
        if (file.ignored) {
          window.ProcessMaker.alert(this.$t("File not allowed."), "danger");
          return false;
        }
      }
      // eslint-disable-next-line no-param-reassign
      file.ignored = false;
      if (!this.name) {
        this.options.query.data_name = file.name;
      }
      return true;
    },
    removeDefaultClasses() {
      // we need to be able to remove the classes from the npm package
      this.$el
        .querySelectorAll(".uploader-btn, .uploader-drop")
        .forEach((el) => {
          el.classList.remove("uploader-btn", "uploader-drop");
        });
    },
    browse(e) {
      if (["Enter", "Space"].includes(e.code)) {
        e.target.click();
      }
    },
    fileUploaded(rootFile, file, message) {
      this.uploading = false;
      const { name } = file;
      if (message) {
        const msg = JSON.parse(message);

        let id = msg.fileUploadId;
        if (this.collection) {
          id = msg.id;
        }

        const fileInfo = {
          id,
          file_name: name,
          mime_type: rootFile.fileType
        };

        this.$set(this.nativeFiles, id, rootFile);
        this.addToFiles(fileInfo);
      } else {
        this.$emit("input", name);
      }
    },
    removed() {
      if (!this.inProgress) {
        this.complete();
      }
    },
    complete() {
      // Unblock submit
      this.validator.errorCount = 0;
      window.onbeforeunload = () => {};
    },
    parentRecordList(node) {
      if (node.$parent && node.$parent.$options) {
        if (node.$parent.$options._componentTag === "form-record-list") {
          return node.$parent;
        }
        return this.parentRecordList(node.$parent);
      }
      return null;
    },
    start() {
      this.uploading = true;
      if (this.parentRecordList(this) === null) {
        this.row_id = null;
      }

      // Block submit until files are loaded
      this.validator.errorCount = 1;
      window.onbeforeunload = () => true;
    },
    getTargetUrl() {
      if (_.has(window, "PM4ConfigOverrides.postFileEndpoint")) {
        return window.PM4ConfigOverrides.postFileEndpoint;
      }

      if (this.endpoint) {
        return this.endpoint;
      }

      if (this.collection) {
        return (
          `/api/1.0/files` +
          `?model=` +
          `ProcessMaker\\Plugins\\Collections\\Models\\Collection` +
          `&model_id=${this.collection}&collection=` +
          `collection`
        );
      }
      const requestIDNode = document.head.querySelector(
        "meta[name='request-id']"
      );
      return requestIDNode
        ? `/api/1.0/requests/${requestIDNode.content}/files`
        : null;
    }
  }
};
</script>

<style scoped>
.required {
  color: red;
  font-size: 0.8em;
}

.file-upload-item {
  display: flex;
  background: rgb(226 238 255);
}
</style>
