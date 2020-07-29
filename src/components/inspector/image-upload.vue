<template>
  <div class="form-group">
    <file-upload
      extensions="gif,jpg,jpeg,png,webp"
      accept="image/png,image/gif,image/jpeg,image/webp"
      name="avatar"
      class="btn btn-sm btn-primary"
      v-model="files"
      @input-file="editSave"
      ref="upload"
    >
      {{ $t('Upload') }}
    </file-upload>
    <small data-v-7779e22f="" class="form-text text-muted">{{ $t('Preview') }}</small>
    <div class="image-preview">
      <img :src="value" style="height: 4em">
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component';

export default {
  props: ['value'],
  components: {
    FileUpload,
  },
  data() {
    return {
      files: [],
    };
  },
  computed: {
    owner() {
      return this.$parent.$parent.inspection.config;
    },
  },
  methods: {
    editSave(fileObject) {
      let reader = new FileReader();
      reader.readAsDataURL(fileObject.file);
      reader.addEventListener('load', () => {
        let name = fileObject.file.name.split('.');
        this.owner.name = escape(name[0]);
        this.$emit('input', reader.result);
      }, false);
    },
  },
};
</script>

<style lang="scss" scoped>
    .image-preview {
        border: 1px solid #ced4da;
        border-radius: 4px;
        height: 4em;
        text-align: center;
        overflow: hidden;
    }
</style>
