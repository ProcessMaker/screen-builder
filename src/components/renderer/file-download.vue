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
        <div v-for="(file, idx) in filesInfo" :key="idx" :data-cy="file.id + '-' + file.name.replace(/[^0-9a-zA-Z\-]/g, '-')">
          <b-btn v-show="!isReadOnly"
            class="mb-2 d-print-none" variant="primary" :aria-label="$attrs['aria-label']"
            @click="downloadFile(file)"
          >
            <i class="fas fa-file-download"/> {{ $t('Download') }}
          </b-btn>
          {{ file.name }}
        </div>
      </template>
      <div v-else>
        {{ $t('No files available for download') }}
      </div>
    </div>
  </div>
</template>


<script>
import _ from  'lodash';

export default {
  inheritAttrs: false,
  data() {
    return {
      filesInfo: [],
      prefix: '',
      rowId: null,
    };
  },
  props: ['name', 'value', 'endpoint', 'requestFiles', 'label'],
  mounted() {
    this.$root.$on('set-upload-data-name',
      (recordList, index, id) => this.listenRecordList(recordList, index, id));

    if (this.donwloadingNotAvailable) {
      // Not somewhere we can download anything (like web entry start event)
      return;
    }

    this.checkIfInRecordList();
    this.setPrefix();
    this.setFilesInfo();
  },
  watch: {
    value: {
      handler() {
        this.setFilesInfo();
      },
      deep: true,
    },
    fileDataName() {
      this.setFilesInfo();
    },
  },
  computed: {
    donwloadingNotAvailable() {
      return !this.collection && !this.requestId;
    },
    inPreviewMode() {
      return this.mode === 'preview' && !window.exampleScreens;
    },
    messageForPreview() {
      return this.$t(
        'Download button for {{fileName}} will appear here.',
        { fileName: this.name }
      );
    },
    messageForNotAvailable() {
      return this.$t('Downloading files is not available.');
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    isReadOnly() {
      return this.$attrs.readonly ? this.$attrs.readonly : false;
    },
    fileDataName() {
      return this.prefix + this.name + (this.rowId ? '.' + this.rowId : '');
    },
    requestId() {
      let node = document.head.querySelector('meta[name="request-id"]');
      if (node === null) {
        return null;
      }
      return node.content;
    },
    collection() {
      const collectionIdNode = document.head.querySelector('meta[name="collection-id"]');
      if (collectionIdNode) {
        return collectionIdNode.content;
      }
      return false;
    },
  },
  methods: {
    parentRecordList(node) {
      if (node.$parent && node.$parent.$options) {
        if (node.$parent.$options._componentTag ===  'form-record-list') {
          return node.$parent;
        }
        return this.parentRecordList(node.$parent);
      }
      return null;
    },
    listenRecordList(recordList, index, id) {
      const parent = this.parentRecordList(this);
      if (parent !== recordList) {
        return;
      }
      this.rowId = (parent !== null) ? id : null;
    },
    downloadFile(file) {
      if (this.collection) {
        this.downloadCollectionFile(file);
      } else {
        this.downloadRequestFile(file);
      }
    },
    requestEndpoint(file) {
      let endpoint = this.endpoint;

      if (_.has(window, 'PM4ConfigOverrides.getFileEndpoint')) {
        endpoint = window.PM4ConfigOverrides.getFileEndpoint;
      }

      if (endpoint && file.token) {
        return `${endpoint}/${file.id}?&token=${file.token}`;
      }

      return `/files/${file.id}/contents`;
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
          throw 'Loop Error';
        }
      }

      if (parent && parent.loopContext) {
        this.prefix = parent.loopContext + '.';
      }
    },
    downloadRequestFile(file) {
      this.$dataProvider.download(this.requestEndpoint(file)).then(response => {
        this.sendToBrowser(response, file);
      });
    },
    downloadCollectionFile(file) {
      this.$dataProvider.download('/files/' + file.id + '/contents').then(response => {
        this.sendToBrowser(response, file);
      });
    },
    sendToBrowser(response, file) {
      //axios needs to be told to open the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
    },
    setFilesInfo() {
      if (this.collection) {
        this.setFilesInfoFromCollectionValue();
      } else {
        this.setFilesInfoFromRequest();
      }
    },
    setFilesInfoFromRequest() {
      if (!this.value) {
        return;
      }

      let requestFiles = _.get(
        window,
        `PM4ConfigOverrides.requestFiles["${this.fileDataName}"]`,
        []
      );

      requestFiles = requestFiles.filter(file => {
        // Filter any requestFiles that don't exist in this component's value. This can happen if
        // a file is uploaded but the task is not saved.
        if (Array.isArray(this.value)) {
          return this.value.some(valueFile => valueFile.file === file.id);
        } else {
          return file.id === this.value;
        }
      });

      // Might be accessing individual files from inside a loop
      if (requestFiles.length === 0 && this.fileDataName.endsWith('.file')) {
        requestFiles = this.requestFileInsideALoop();
      }

      this.filesInfo = requestFiles.map(file => {
        const info = { id: file.id, name: file.file_name };
        if (file.token) {
          // web entry
          info.token = file.token;
        }
        return info;
      });
    },
    requestFileInsideALoop() {
      const path = this.fileDataName.slice(0, -5);
      const loopFile = _.get(
        window,
        `PM4ConfigOverrides.requestFiles.${path}`,
        null
      );
      if (loopFile) {
        return [loopFile]; // Treat as single file download
      }
      return [];
    },
    setFilesInfoFromCollectionValue() {
      if (!this.value) {
        this.filesInfo = [];
        return;
      }
      if (Array.isArray(this.value)) {
        // multi file upload
        this.filesInfo = this.value.map(value => value.file);
      } else {
        this.filesInfo = [this.value];
      }

    },
    checkIfInRecordList() {
      const parent = this.parentRecordList(this);
      if (parent !== null) {
        const recordList = parent;
        const prefix = recordList.name + '.';
        this.setFileUploadNameForChildren(recordList.$children, prefix);
      }
    },
    setFileUploadNameForChildren(children, prefix) {
      children.forEach(child => {
        if (_.get(child, '$options.name') === 'FileDownload') {
          child.prefix = prefix;
        } else if (_.get(child, '$children', []).length > 0) {
          this.setFileUploadNameForChildren(child.$children, prefix);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>