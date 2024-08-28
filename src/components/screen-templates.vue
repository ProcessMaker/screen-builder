<template>
  <div>
    <div class="p-2 d-flex justify-content-between">
      <h6 class="pt-2">Select a Template</h6>
      <button class="panel-close-btn" @click="$emit('close-templates-panel')"><i class="fas fa-times"></i></button>
    </div>
    <div class="d-flex m-2 template-tabs justify-content-center">
      <b-button @click="showMyTemplates" class="d-inline default-template-btn px-1" :class="{ 'my-templates-selected': myTemplatesSelected }">My Templates</b-button>
      <b-button @click="showSharedTemplates" class="d-inline default-template-btn" :class="{ 'shared-templates-selected': sharedTemplatesSelected }">Shared Templates</b-button>
    </div>
  </div>
</template>
  
<script>
  export default {
    mounted() {
        console.log('screen-templates component mounted');
    },
    props: ['myTemplatesData', 'sharedTemplatesData'],
    data() {
      return {
        myTemplatesSelected: true,
        sharedTemplatesSelected: false,
      };
    },
    watch: {
      sharedTemplatesData() {
        if (this.sharedTemplatesData !== null) {
          console.log('SHARED TEMPLATES DATA NOT NULL', this.sharedTemplatesData);
        this.sharedTemplatesSelected = true;
        this.myTemplatesSelected = false;
        console.log('sharedTemplatesData in screen-templates', this.sharedTemplatesData);
        }
      },
    },
    methods: {
      showMyTemplates() {
        this.myTemplatesSelected = true;
        this.sharedTemplatesSelected = false;
        console.log('myTemplatesData in screen-templates', this.myTemplatesData);
      },
      showSharedTemplates() {
        this.$emit('show-shared-templates');
      },
    },
    mounted() {
      this.showMyTemplates();
      this.$on('shared-templates-loaded', () => {
      console.log('Shared templates data received in screen-templates');
    });
    }
  };
</script>

<style lang="scss" scoped>
  .panel-close-btn {
    background-color: transparent;
    border: none;
    color: #596372;
  }

  .template-tabs {
    padding: 4px;
    background-color: #E9ECF1;
    border-radius: 8px;
  }

  .default-template-btn {
    width: 50%;
    background-color: transparent;
    border: none;
    color: #596372;
    font-size: 12px;
    padding-left: 0px;
    padding-right: 0px;
    text-transform: none;
    box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05), 0px 1px 2px -1px rgb(0, 0, 0, 0.05), 0px 1px 0px -1px rgb(0, 0, 0, 0.05);
  }

  .my-templates-selected {
    background-color: #ffffff;
    color: #20242A;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 12px;
    padding-left: 0px;
    padding-right: 0px;
  }

  .shared-templates-selected {
    background-color: #ffffff;
    color: #20242A;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 12px;
    padding-left: 0px;
    padding-right: 0px;
  }

</style>
