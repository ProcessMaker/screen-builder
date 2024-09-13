<template>
  <div data-cy="screen-templates-section">
    <div class="d-flex justify-content-between">
      <h6 class="pt-2">Select a Template</h6>
      <button
        class="panel-close-btn"
        @click="$emit('close-templates-panel')"
        data-cy="close-templates-section"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="d-flex m-2 template-tabs justify-content-center">
      <b-button
        @click="showMyTemplates"
        class="d-inline default-template-btn px-1"
        :class="{ 'my-templates-selected': myTemplatesSelected }"
        data-cy="my-templates-tab"
      >
        My Templates
      </b-button>
      <b-button
        @click="showSharedTemplates"
        class="d-inline default-template-btn"
        :class="{ 'shared-templates-selected': sharedTemplatesSelected }"
        data-cy="shared-templates-tab"
      >
        Shared Templates
      </b-button>
    </div>
    <div class="d-flex justify-content-center">
      <div
        v-if="myTemplatesSelected"
        class="d-flex justify-content-center p-0"
        data-cy="my-templates-list"
      >
        <screen-template-card
          v-for="template in myTemplatesData"
          :key="template.id"
          :template="template"
          @template-selected="handleSelectedTemplate"
        />
      </div>
      <div
        v-if="sharedTemplatesSelected"
        class="d-flex justify-content-center p-0"
        data-cy="shared-templates-list"
      >
        <screen-template-card
          v-for="template in sharedTemplatesData"
          :key="template.id"
          :template="template"
          @template-selected="handleSelectedTemplate"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
  import ScreenTemplateCard from './ScreenTemplateCard.vue';

  export default {
    components: {
      ScreenTemplateCard,
    },
    mounted() {
        console.log('screen-templates component mounted');
    },
    data() {
      return {
        myTemplatesData: null,
        sharedTemplatesData: null,
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
        this.fetchMyTemplates();
      },
      fetchMyTemplates() {
        ProcessMaker.apiClient
        .get(
          "templates/screen?is_public=0",
        )
        .then((response) => {
          this.myTemplatesData = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
      },
      fetchSharedTemplates() {
      ProcessMaker.apiClient
        .get(
          "templates/screen?is_public=1",
        )
        .then((response) => {
          this.sharedTemplatesData = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
      },
      handleSelectedTemplate() {
        console.log('hit handleSelectedTemplate');
      },
      showSharedTemplates() {
        this.myTemplatesSelected = false;
        this.sharedTemplatesSelected = true;
        this.fetchSharedTemplates();
      },
    },
    mounted() {
      this.showMyTemplates();
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
