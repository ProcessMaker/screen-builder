<template>
  <div>
    <label v-if="label && label !== ''">{{ label }}</label>
    <b-card v-if="inPreviewMode" class="mb-2">
      {{ messageForPreview }}
    </b-card>
    <div v-else>
      <div v-if="loading">
        <i class="fas fa-cog fa-spin text-muted"/>
        {{ $t('Loading...') }}
      </div>
      <div v-else>
        <template v-if="!loading && filesInfo">
          <div  v-for="file in asArray(filesInfo)" :key="file.id" :nada="JSON.stringify(file)" :data-cy="file.id + '-' + (file.name ? file.name : file.file_name).replace(/[^0-9a-zA-Z\-]/g, '-')">
            <b-btn v-show="!isReadOnly"
              class="mb-2 d-print-none" variant="primary" :aria-label="$attrs['aria-label']"
              @click="downloadFile(file)"
            >
              <i class="fas fa-file-download"/> {{ $t('Download') }}
            </b-btn>
            {{ file.name ? file.name : file.file_name }}
          </div>
        </template>
        <div v-else>
          {{ $t('No files available for download') }}
        </div>
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
      fileType: null,
      loading: true,
      filesInfo: null,
      fileName: null,
      requestId: null,
      collectionId: null,
      recordId: null,
      prefix: '',
      recordListVarName: null,
    };
  },
  props: ['name', 'value', 'endpoint', 'requestFiles', 'label'],
  beforeMount() {
    this.fileType = this.getFileType();

    if (this.fileType == 'request') {
      this.requestId = this.getRequestId();
    }

    if (this.fileType == 'collection') {
      // Fill this.recordId and collectionId
      this.getCollectionInfo();
    }
  },
  mounted() {
    this.$root.$on('set-upload-data-name',
      (recordList, index, id) => this.listenRecordList(recordList, index, id));

    if (!this.fileType) {
      // Not somewhere we can download anything (like web entry start event)
      this.loading = false;
      return;
    }

    this.setPrefix();

    if (this.fileType == 'request') {
      this.getFilesInfo();
    }

    if (this.fileType == 'collection') {
      this.getCollectionFiles();
    }
  },
  watch: {
    value(value) {
      this.fileName = value;
      if (this.parentRecordList((this)) === null) {
        this.getFilesInfo();
      }
      else {
        this.getFilesInfo(this.recordListVarName);
      }
    },
  },
  computed: {
    inPreviewMode() {
      return this.mode === 'preview' && !window.exampleScreens;
    },
    messageForPreview() {
      return this.$t(
        'Download button for {{fileName}} will appear here.',
        { fileName: this.name }
      );
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    isReadOnly() {
      return this.$attrs.readonly ? this.$attrs.readonly : false;
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
      if (parent === recordList) {
        const prefix = (this.parentRecordList(this) === null) ? '' : recordList.name + '.';
        this.recordListVarName = prefix + this.name + (id ? '.' + id : '');
        this.getFilesInfo(this.recordListVarName);
      }
    },
    downloadFile(file) {
      if (this.fileType == 'request') {
        this.downloadRequestFile(file);
      }

      if (this.fileType == 'collection') {
        this.downloadCollectionFile(file);
      }
    },
    requestEndpoint(file) {
      let endpoint = this.endpoint;

      if (_.has(window, 'PM4ConfigOverrides.getFileEndpoint')) {
        endpoint = window.PM4ConfigOverrides.getFileEndpoint;
      }

      if (endpoint && this.filesInfo) {
        const query = '?name=' + encodeURIComponent(this.prefix + this.name) + '&token=' + this.filesInfo.token;
        return endpoint + query;
      }

      return '/request/' + this.requestId + '/files/' + file.id;
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
      window.ProcessMaker.apiClient({
        baseURL: '/',
        url: this.requestEndpoint(file),
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        //axios needs to be told to open the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', (file.name ? file.name : file.file_name));
        document.body.appendChild(link);
        link.click();
      });
    },
    downloadCollectionFile(file) {
      window.ProcessMaker.apiClient({
        url: '/files/' + file.id + '/contents',
        method: 'GET',
        responseType: 'blob', // important
      }).then(response => {
        //axios needs to be told to open the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.name);
        document.body.appendChild(link);
        link.click();
      });
    },
    getFileType() {
      let result = null;
      const requestIdNode = document.head.querySelector('meta[name="request-id"]');
      if (requestIdNode && requestIdNode.content) {
        result = 'request';
      }

      if (document.head.querySelector('meta[name="collection-id"]')) {
        result = 'collection';
      }
      return result;
    },
    getRequestId() {
      let node = document.head.querySelector('meta[name="request-id"]');
      if (node === null) {
        this.loading = false;
        return;
      }
      return node.content;
    },
    getCollectionInfo() {
      let collectionId, recordId = null;
      let collectionNode = document.head.querySelector('meta[name="collection-id"]');
      if (collectionNode === null) {
        this.loading = false;
        return;
      }
      this.collectionId = collectionNode.content;

      let recordNode = document.head.querySelector('meta[name="record-id"]');
      if (recordNode === null) {
        this.loading = false;
        return;
      }
      this.recordId = recordNode.content;
      return {collectionId, recordId};
    },
    getFilesInfo(variableName = null) {
      if (this.getFileType() === 'collection') {
        this.filesInfo = this.value;
        return;
      }

      if (this.value === null) {
        this.loading=false;
        return;
      }
      const name = variableName ? variableName : this.prefix + this.name;
      const fileIds = this.asArray(this.value);
      let requestFilesForVarExist = _.has(window, ['PM4ConfigOverrides', 'requestFiles', name]);

      const allFilesInValueHaveData =
        requestFilesForVarExist &&
        fileIds.every(fileId => {
          let fieldIsFoundinRequestData = false;
          for (const variable in window.PM4ConfigOverrides.requestFiles) {
            const varData = this.asArray(window.PM4ConfigOverrides.requestFiles[variable]);
            fieldIsFoundinRequestData = fieldIsFoundinRequestData || varData.some(requestFile => requestFile.id === fileId);
          }
          return fieldIsFoundinRequestData;
        });

      if (allFilesInValueHaveData) {
        this.setFileInfo(name);
      }
      else {
        window.ProcessMaker.apiClient
          .get(`requests/${this.requestId}/files`)
          .then(response => {
            const data = response.data.data;
            let filesData = {};
            data.forEach(fileData => {
              const varName = _.get(fileData, 'custom_properties.data_name', null);
              if (varName) {
                const item = {
                  id: fileData.id,
                  file_name: fileData.file_name,
                };
                if (filesData[varName]) {
                  if (!Array.isArray(filesData[varName])) {
                    filesData[varName] = [filesData[varName]];
                  }
                  filesData[varName].push(item);
                }
                else {
                  filesData[varName] = item;
                }
              }
              _.set(window, 'PM4ConfigOverrides.requestFiles', filesData);
              this.setFileInfo(name);
            });
            this.loading = false;
          });
      }
    },
    setFileInfo(name) {
      let requestFiles = this.requestFiles;
      if (_.has(window, 'PM4ConfigOverrides.requestFiles')) {
        requestFiles = window.PM4ConfigOverrides.requestFiles;
      }

      if (requestFiles[name]) {
        this.loading = false;
        //return always an array
        const filesData = Array.isArray(requestFiles[name]) ? requestFiles[name] :  [requestFiles[name]];
        const valueIds = Array.isArray(this.value) ? this.value : [this.value];
        let result = [];
        valueIds.forEach(valueId => {
          const fileData = filesData.find(item => item.id === valueId);
          if (fileData) {
            result.push(fileData);
          }
        });
        this.filesInfo = result;
      }
    },
    asArray(value) {
      if (value === null || value === undefined) {
        return null;
      }
      return Array.isArray(value) ? value : [value];
    },
    setFileInfoFromCache() {
      const info = this.asArray(_.get(window.ProcessMaker.CollectionData, this.prefix + this.name, null));
      if (info) {
        this.filesInfo = info.map(item => {
          return {...item, file_name: item.name};
        });
      }
    },
    getCollectionFiles() {
      if (this.collectionId === null || this.recordId === null) {
        this.loading = false;
        return;
      }

      window.ProcessMaker.EventBus.$on('got-collection-data', () => {
        this.setFileInfoFromCache();
        this.loading = false;
      });

      if (!window.ProcessMaker.CollectionData) {
        window.ProcessMaker.CollectionData = {};
        window.ProcessMaker.apiClient
          .get('collections/' + this.collectionId + '/records/' + this.recordId)
          .then(response => {
            window.ProcessMaker.CollectionData = response.data.data;
            this.filesInfo = this.value;
            window.ProcessMaker.EventBus.$emit('got-collection-data');
          });
      }
      this.filesInfo = this.value;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>