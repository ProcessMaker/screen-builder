<template>
  <div>
    <div class="p-2 d-flex justify-content-between">
      <h6 class="pt-2">Select a Template</h6>
      <button class="panel-close-btn" @click="$emit('close-templates-panel')"><i class="fas fa-times"></i></button>
    </div>
    <div class="p-4">
      <b-button-group class="p-2 template-tabs">
      <b-button @click="showMyTemplates" class="default-template-btn" :class="{ 'my-templates-selected': myTemplatesSelected }">My Templates</b-button>
      <b-button @click="showSharedTemplates" class="default-template-btn" :class="{ 'shared-templates-selected': sharedTemplatesSelected }">Shared Templates</b-button>
    </b-button-group>
    </div>
  </div>
</template>
  
<script>
//   import MonacoEditor from 'vue-monaco';
  export default {
    mounted() {
        console.log('screen-templates component mounted');
    },
    // props: ['value', 'cssErrors'],
    // components: { MonacoEditor },
    data() {
      return {
        myTemplatesSelected: true,
        sharedTemplatesSelected: false,
        monacoOptions: {
          language: 'css',
          automaticLayout: true,
          minimap: { enabled: false },
        },
      };
    },
    methods: {
      showMyTemplates() {
        this.myTemplatesSelected = true;
        this.sharedTemplatesSelected = false;
      },
      showSharedTemplates() {
        this.sharedTemplatesSelected = true;
        this.myTemplatesSelected = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .panel-close-btn {
    background-color: transparent;
    border: none;
    color: #596372;
  }

  .template-tabs {
    background-color: #E9ECF1;
    border-radius: 12px;
    font-size: 14px;
    text-transform: lowercase;
  }

  .default-template-btn {
    background-color: transparent;
    border: none;
    color: #596372;
  }

  .my-templates-selected {
    background-color: #ffffff;
    color: #20242A;
    border-radius: 12px;
    border: none;
  }

</style>
  