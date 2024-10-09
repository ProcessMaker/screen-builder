<template>
  <div>
    <required-asterisk /><label v-uni-for="name">{{ label }}</label>
    <b-card v-if="inPreviewMode" class="mb-2">
      {{ $t('File uploads are unavailable in preview mode.') }}
    </b-card>
    <uploader
      v-if="!inPreviewMode && showComponent"
      :options="options"
      :attrs="attrs"
      ref="uploader"
      @complete="complete"
      @upload-start="start"
      @file-removed="removed"
      @file-success="fileUploaded"
      @file-error="fileError"
      @file-added="addFile"
      :class="{'was-validated': required}"
    >
      <uploader-unsupport/>

      <uploader-drop v-if="uploaderLoaded && !isConversationalForm" class="form-control-file">
        <p>{{ $t('Drop a file here to upload or') }}</p>
        <uploader-btn
          :attrs="nativeButtonAttrs"
          :class="{disabled: disabled}"
          tabindex="0"
          v-on:keyup.native="browse"
          :aria-label="$attrs['aria-label']"
          class="btn btn-secondary text-white"
        >
          {{ $t('select file') }}
        </uploader-btn>
        <span v-if="validation === 'required' && !value" class="required">{{ $t('Required') }}</span>
      </uploader-drop>

      <!-- Render the conversational form file upload UI when the screen type is conversational forms -->
      <uploader-list v-if="isConversationalForm" class="cf-uploader-list">
        <template v-slot="{fileList}">
          <ul v-if="uploading" class="cf-upload-progress">
            <li v-for="file in fileList" :key="file.id || file.name">
              <uploader-file :file="file" list />
            </li>
          </ul>
          <ul v-else>
            <li v-for="(file, i) in files" :key="file.id || i" :data-cy="file.id" class="cf-file-upload-list">
              <span class="cf-filename text-truncate">
                <i :class="getFileIconClass(file)" class="mr-2"></i>
                {{ nativeFiles[file.id].name }}
              </span>
              <b-btn 
                variant="outline" 
                @click="removeFile(file)" 
                v-b-tooltip.hover :title="$t('Delete')"
                class="pr-0"
                :aria-label="$t('Delete file {{ nativeFiles[file.id].name }}')"
              >
                <i class="fas fa-trash-alt"></i>
              </b-btn>
            </li>
          </ul>
        </template>
      </uploader-list>
      <uploader-drop v-if="uploaderLoaded && isConversationalForm" class="form-control-file">
        <b-button
          v-if="!required"
          @click="cfSkipFileUpload"
          class="btn cf-skip-btn mb-3"
        >
          <i class="fas fa-arrow-left mr-2"></i> {{ $t('Skip Uploading') }}
        </b-button>

        <uploader-btn
          :attrs="nativeButtonAttrs"
          :class="[
            { disabled: disabled }, 
            'btn',
            showSingleUploadButton ? 'cf-single-upload-btn' : (showMultiUploadButton ? 'cf-multi-upload-btn' : '')
          ]"
          tabindex="0"
          v-on:keyup.native="browse"
          :aria-label="$attrs['aria-label']"
        >
          <span v-if="showSingleUploadButton"><i class="far fa-image mr-2"></i> {{ $t('Add File/Photo') }}</span>
          <span v-else-if="showMultiUploadButton"><i class="fas fa-plus mr-2"></i> {{ $t('Add another') }}</span>
        </uploader-btn>

        <b-button v-if="files.length !== 0" class="cf-file-upload-submit" variant="primary" @click="emitConversationalFormSubmit" :aria-label="$t('Submit')">
          <i class="fas fa-paper-plane"></i> <span v-if="files.length !== 0 && showMultiUploadButton">{{ $t('Send All') }}</span>
        </b-button>
      </uploader-drop>
      
      <uploader-list v-else>
        <template slot-scope = "{ fileList }">
          <ul v-if="uploading">
            <li v-for="file in fileList" :key="file.id">
              <uploader-file :file="file" :list="true"/>
            </li>
          </ul>
          <ul v-else>
            <li v-for="(file, i) in files " :key="i" :data-cy="file.id">
              <div class="">
                <div class="" style="display:flex; background:rgb(226 238 255)">
                  <div v-if="nativeFiles[file.id]" style="flex: 1" class="overflow-hidden" :data-cy="file.file_name.replace(/[^0-9a-zA-Z\-]/g, '-')">
                    <uploader-file :file="nativeFiles[file.id]" :list="true" />
                  </div>
                  <div v-else class="text-truncate" :title="file.file_name" style="flex: 1">
                    <i class="fas fa-paperclip"/> {{ file.file_name }}
                  </div>
                  <div class="pt-1">
                    <b-btn variant="outline" @click="removeFile(file)" v-b-tooltip.hover :title="$t('Delete')">
                      <i class="fas fa-trash-alt"/>
                    </b-btn>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </uploader-list>
      <div class="invalid-feedback" :class="{'d-block': error && !value}">
        {{ $t('Field is required') }}
      </div>
    </uploader>

    <div class="invalid-feedback" v-if="error">{{ error }}</div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from 'vue-uniq-ids';
import uploader from 'vue-simple-uploader';
import _ from 'lodash';
import { RequiredAsterisk } from '@processmaker/vue-form-elements';

// Create the mixin
const uniqIdsMixin = createUniqIdsMixin();

// vue-simple-uploader tries to call these after the component has
// been destroyed since it does it in nextTick(). It has no effect
// on functionality because a new copy is created.
// TODO: Why is this component being recreated when used in a loop?
const ignoreErrors = [
  'Cannot read property \'assignBrowse\' of null',
  'Cannot read property \'assignDrop\' of null',
  'Cannot read properties of null (reading \'assignBrowse\')',
  'Cannot read properties of null (reading \'assignDrop\')',
];

export default {
  components: { ...uploader, RequiredAsterisk },
  mixins: [uniqIdsMixin],
  props: ['label', 'error', 'helper', 'name', 'value', 'controlClass', 'endpoint', 'accept', 'validation', 'parent', 'config', 'multipleUpload', 'screenType'],
  updated() {
    this.removeDefaultClasses();
  },
  mounted() {
    this.$root.$on('set-upload-data-name',
      (recordList, index, id) => this.listenRecordList(recordList, index, id));

    this.$root.$on('removed-record',
      (recordList, record) => this.listenRemovedRecord(recordList, record));

    this.$root.$on('removed-loop',
      (loop, removed) => this.listenRemovedLoop(loop, removed));
    
    window.ProcessMaker.EventBus.$on("modal-shown", () => {
      this.clearFiles();
    });

    this.removeDefaultClasses();

    this.setPrefix();
    if (this.$refs['uploader']) {
      this.$refs['uploader'].$forceUpdate();
    }

    this.disabled = _.get(window, 'ProcessMaker.isSelfService', false);
  },
  errorCaptured(err) {
    if (ignoreErrors.includes(err.message)) {
      return false;
    }
  },
  computed: {
    filesFromGlobalRequestFiles() {
      if (!this.value) {
        return [];
      }
      return _.get(window, `PM4ConfigOverrides.requestFiles["${this.fileDataName}"]`, []).filter(file => {
        // Filter any requestFiles that don't exist in this component's value. This can happen if
        // a file is uploaded but the task is not saved.
        if (this.multipleUpload) {
          return this.value.some(valueFile => valueFile.file === file.id);
        } else {
          return file.id === this.value;
        }
      });
    },
    filesFromCollection() {
      if (!this.value) {
        return [];
      }
      return this.filesFromCollectionValue(this.value);
    },
    collection() {
      const collectionIdNode = document.head.querySelector('meta[name="collection-id"]');
      if (collectionIdNode) {
        return collectionIdNode.content;
      }
      return false;
    },
    filesData() {
      if (this.collection) {
        return this.filesFromCollection;
      } else {
        return this.filesFromGlobalRequestFiles;
      }
    },
    fileIds() {
      return this.files.map(f => f.id);
    },
    nativeButtonAttrs() {
      const attrs = { 'data-cy':'file-upload-button' };
      if (this.disabled) {
        attrs.disabled = true;
      }
      attrs.accept = this.attrs.accept;
      return attrs;
    },
    required() {
      if (this.config && this.config.validation) {
        return this.config.validation === 'required';
      } else {
        return false;
      }
    },
    inPreviewMode() {
      return ((this.mode === 'preview' && !window.exampleScreens) || this.mode === 'editor');
    },
    mode() {
      return this.$root.$children[0].mode;
    },
    classList() {
      return {
        'is-invalid': (this.validator && this.validator.errorCount) || this.error,
        [this.controlClass]: !!this.controlClass,
      };
    },
    inProgress() {
      return this.$refs.uploader.fileList.some(file => file._prevProgress < 1);
    },
    filesAccept() {
      if (!this.accept) {
        return null;
      }

      let accept = [];

      (this.accept.split(',')).forEach(item => {
        accept.push(item.trim());
      });
      return accept;
    },
    fileDataName() {
      return this.prefix + this.name + (this.row_id ? '.' + this.row_id : '');
    },
    isConversationalForm() {
      return this.screenType === 'conversational-forms';
    },
    showSingleUploadButton() {
      return this.files.length === 0 || !this.multipleUpload;
    },
    showMultiUploadButton() {
      return this.files.length !== 0 && this.multipleUpload;
    },
  },
  watch: {
    filesData: {
      handler() {
        this.setFiles();
      },
      immediate: true,
      deep: true,
    },
    files: {
      handler() {
        if (!this.collection) {
          this.setRequestFiles();
        }
        this.$emit('input', this.valueToSend());
      },
      deep: true,
    },
    name: {
      handler() {
        this.options.query.data_name = this.fileDataName;
      },
      immediate: true,
    },
    parent: {
      handler() {
        this.options.query.parent = this.parent;
      },
      immediate: true,
    },
    prefix: {
      handler() {
        this.options.query.data_name = this.fileDataName;
      },
      immediate: true,
    },
    row_id: {
      handler() {
        this.options.query.row_id = this.row_id;
        this.options.query.data_name = this.prefix + this.name + (this.row_id ? '.' + this.row_id : '');
      },
      immediate: true,
    },
    multipleUpload: {
      handler() {
        // Add the multiple parameter for the endpoint call that will be executed by vue-simple-uploader
        this.options.query.multiple = this.multipleUpload;
      },
      immediate: true,
    },
  },
  data() {
    return {
      uploaderId: 1,
      content: '',
      validator: {
        errorCount: 0,
        errors: [],
      },
      prefix: '',
      row_id: null,
      options: {
        target: this.getTargetUrl,
        // We cannot increase this until laravel chunk uploader handles this gracefully
        simultaneousUploads: 1,
        query: {
          chunk: true,
          data_name: this.name,
          parent: null,
          row_id: null,
          task_id: _.get(window, '_current_task_id', 0),
        },
        testChunks: false,
        // Setup our headers to deal with API calls
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': window.ProcessMaker.apiClient.defaults.headers.common['X-CSRF-TOKEN'],
        },
        singleFile: !this.multipleUpload,
      },
      attrs: {
        accept: this.accept,
      },
      disabled: false,
      files: [],
      nativeFiles: {},
      uploading: false,
      invalidFile: false,
      showComponent: true,
    };
  },
  methods: {
    clearFiles() {
      this.showComponent = false;
      this.$nextTick(() => {
        this.showComponent = true;
      });
    },
    uploaderLoaded() {
      return this.$refs['uploader'];
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
      } else {
        return this.filesFromCollectionSingle(value);
      }
    },
    filesFromCollectionSingle(value) {
      return [{ id: value.id, file_name: value.name }];
    },
    filesFromCollectionMulti(value) {
      return value.map(v => {
        return { id: v.file.id, file_name: v.file.name };
      });
    },
    setRequestFiles() {
      _.set(window, `PM4ConfigOverrides.requestFiles["${this.fileDataName}"]`, this.files);
      console.log("!!!!!! SET REQUEST FILES", this.valueToSend());
      this.$emit('input', this.valueToSend());
    },
    valueToSend() {
      if (this.multipleUpload) {
        return this.valueForMulti();
      } else {
        return this.valueForSingle();
      }
    },
    valueForMulti() {
      return this.files.map(file => {
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
      for (const prop in object) {
        if (prop === this.name && object[prop]) {
          const idsInRemoved = this.idsFromValue(object[prop]);

          for (const id of idsInRemoved) {
            if (this.hasFileId(id)) {
              // In record lists, delete can be called twice on the same file.
              // Catch and igore the error.
              // eslint-disable-next-line no-unused-vars
              await this.$dataProvider.deleteFile(id).catch(e => {});
              this.removeFromFiles(id);
            }
          }
        }
      }
    },
    idsFromValue(value) {
      if (this.collection) {
        return this.filesFromCollectionValue(value).map(f => f.id);
      } else {
        if (this.multipleUpload) {
          return value.map(v => v.file);
        } else {
          return [value];
        }
      }
    },
    async removeFile(file) {
      const id = file.id;
      const token = file.token ? file.token : null;

      // If it's not a web entry start event
      if (!isNaN(id)) {
        await this.$dataProvider.deleteFile(id, token);
      }

      this.removeFromFiles(id);
    },
    removeFromFiles(id) {
      const idx = this.files.findIndex(f => f.id === id);
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
      this.row_id = (parent !== null) ? id : null;
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
    validateFile(file, acceptFiles){
      const extensions = acceptFiles.filter(item => item.startsWith('.'));
      const mimeTypes = acceptFiles.filter(item => !item.startsWith('.'));
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      const fileType = file.fileType;
      const isExtensionValid = extensions.includes(fileExtension);
      const isMimeTypeValid = mimeTypes.includes(fileType);

      if (!isExtensionValid && !isMimeTypeValid) {
        return false;
      }
      return true;
    },
    addFile(file) {
      if (this.disabled) {
        file.ignored = true;
        return false;
      }
      if (file.fileType === undefined) {
        const existingFile = this.files.find(el => {
          if (el.name === file.name) {
            return el.fileType;
          }
        });
        file.fileType = existingFile.fileType;
      }

      if (this.filesAccept) {
        file.ignored = true;
        if (this.validateFile(file, this.filesAccept)) {
          file.ignored = false;
        }
        if (file.ignored) {
          this.invalidFile = true;
          this.uploading = false;
          window.ProcessMaker.alert(this.$t('This file type is not accepted.'), 'danger');
          return false;
        }
      }
      file.ignored = false;
      if (!this.name) {
        this.options.query.data_name = file.name;
      }
      return true;
    },
    removeDefaultClasses() {
      // we need to be able to remove the classes from the npm package
      this.$el.querySelectorAll('.uploader-btn, .uploader-drop').forEach(el => {
        el.classList.remove('uploader-btn', 'uploader-drop');
      });
    },
    browse(e) {
      if (['Enter', 'Space'].includes(e.code)) {
        e.target.click();
      }
    },
    fileError(rootFile, file, messages, chunk)
    {
      let displayMessage = '';
      try {
        const messagesArray = JSON.parse(messages);
        displayMessage = messagesArray.join(', ');
      }
      catch (e) {
        displayMessage = messages;
      }

      if (displayMessage.length > 0) {
        window.ProcessMaker.alert(`${this.$t('File Upload Error:')}  ${displayMessage}`, 'danger');
      }

      window.onbeforeunload = function() {};
      this.$emit('file-error', messages);
    },
    fileUploaded(rootFile, file, message) {
      this.uploading = false;
      let name = file.name;
      if (message) {
        const msg = JSON.parse(message);

        let id = msg.fileUploadId;
        if (this.collection) {
          id = msg.id;
        }

        const fileInfo = {
          id,
          file_name: name,
          mime_type: rootFile.fileType,
          // additional properties needed when re-uploading files to the uploader component
          name: name,
          fileType: rootFile.fileType,
        };

        this.$set(this.nativeFiles, id, rootFile);
        this.addToFiles(fileInfo);
      } else {
        console.log("!!!!!! FILE UPLOADED", name);
        this.$emit('input', name);
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
      window.onbeforeunload = function() {};
    },
    parentRecordList(node) {
      if (node.$parent && node.$parent.$options) {
        if (node.$parent.$options._componentTag ===  'form-record-list') {
          return node.$parent;
        }
        return this.parentRecordList(node.$parent);
      }
      return null;
    },
    start() {
      // Prevent the upload from being started when the file is invalid.
      if (this.invalidFile) {
        return;
      }

      this.uploading = true;
      if (this.parentRecordList(this) === null) {
        this.row_id = null;
      }

      // Block submit until files are loaded
      this.validator.errorCount = 1;
      window.onbeforeunload = function() {
        return true;
      };
    },
    getTargetUrl() {
      if (_.has(window, 'PM4ConfigOverrides.postFileEndpoint')) {
        return window.PM4ConfigOverrides.postFileEndpoint;
      }

      if (this.endpoint) {
        return this.endpoint;
      }

      if (this.collection) {
        return '/api/1.0/files' +
            '?model=' +
            'ProcessMaker\\Plugins\\Collections\\Models\\Collection' +
            '&model_id=' +
            this.collection +
            '&collection=' +
            'collection';
      } else {
        const requestIDNode = document.head.querySelector('meta[name="request-id"]');
        return requestIDNode
          ? `/api/1.0/requests/${requestIDNode.content}/files`
          : null;
      }
    },
    getFileIconClass(file) {
      return this.nativeFiles[file.id].fileType.includes('image/') 
        ? 'far fa-image' 
        : 'far fa-file';
    },
    emitConversationalFormSubmit($event) {
      this.$emit('cf-submit', $event);
    },
    cfSkipFileUpload() {
      this.$emit('cf-skip-file-upload');
    }
  },
};
</script>

<style scoped>
.required {
  color: red;
  font-size: 0.8em;
}

/* Conversational Forms Styling */
.cf-single-upload-btn {
  background-color: #EAF2FF;
  border: 1px solid #81AFFF;
  color: #81AFFF;
  width: 100%;
  padding: 12px 10px;
  text-transform: capitalize;
  margin: 0;
}
.cf-multi-upload-btn {
  background: #fff;
  color: #20242A;
  border: 1px solid #D7DDE5;
  font-size: 12px;
  width: 57%;
  padding: 7px;
  border-radius: 8px;
  margin: 0;
  text-transform: capitalize;
  margin-right: 30px;
}
.cf-file-upload-submit {
  border-radius: 8px;
  color: #fff;
  font-size: 12px;
  text-transform: capitalize;
  padding: 7px;
}
.cf-filename {
  width: 88%;
  display: inline-block;
  vertical-align: middle;
}
.cf-uploader-list {
  margin-bottom: 14px;
  max-height: 75px;
  overflow:auto;
}
.cf-file-upload-list {
  color: #20242A;
  margin-bottom: 3px;
  border-bottom: 1px solid #F3F5F7;
}
.cf-skip-btn {
  background-color: #FFF;
  border: 1px solid #D7DDE5;
  color: #20242A;
  width: 100%;
  padding: 12px 10px;
  box-shadow: 0px 12px 24px -12px #0000001F;
}

</style>
