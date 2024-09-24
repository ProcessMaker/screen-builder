<template>
  <div
    class="screen-templates-container"
    data-cy="screen-templates-section"
  >
    <div class="d-flex justify-content-between">
      <h6 class="pt-2">{{ $t("Select a Template") }}</h6>
      <button
        class="panel-close-btn"
        @click="$emit('close-templates-panel')"
        data-cy="close-templates-section"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div class="d-flex template-tabs justify-content-center">
      <b-button
        @click="showMyTemplates"
        class="d-inline default-template-btn px-1"
        :class="{ 'my-templates-selected': myTemplatesSelected }"
        data-cy="my-templates-tab"
      >
        {{ $t("My Templates") }}
      </b-button>
      <b-button
        @click="showSharedTemplates"
        class="d-inline default-template-btn"
        :class="{ 'shared-templates-selected': sharedTemplatesSelected }"
        data-cy="shared-templates-tab"
      >
        {{ $t("Shared Templates") }}
      </b-button>
    </div>
    <div class="d-flex justify-content-center cards-container">
      <div
        v-if="myTemplatesSelected"
        class="d-flex justify-content-center p-0"
        data-cy="my-templates-list"
      >
        <b-card-group>
          <b-card-body
            v-if="noMyTemplatesFound"
            class="p-2 h-100 overflow-auto"
          >
            <h5>{{ $t("No templates found.") }}</h5>
          </b-card-body>
          <screen-template-card
            v-else
            v-for="template in myTemplatesData"
            :key="template.id"
            :template="template"
            :screen-id="screenId"
            :currentScreenPage="currentScreenPage"
          />
        </b-card-group>
      </div>
      <div
        v-if="sharedTemplatesSelected"
        class="d-flex justify-content-center p-0"
        data-cy="shared-templates-list"
      >
        <b-card-group>
          <b-card-body
            v-if="noSharedTemplatesFound"
            class="p-2 h-100 overflow-auto"
          >
            <h5>{{ $t("No templates found.") }}</h5>
          </b-card-body>
          <screen-template-card
            v-else
            v-for="template in sharedTemplatesData"
            :key="template.id"
            :template="template"
            :screen-id="screenId"
            :currentScreenPage="currentScreenPage"
          />
        </b-card-group>
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
    props: ['screenId', 'currentScreenPage'],
    mounted() {
    },
    data() {
      return {
        myTemplatesData: null,
        sharedTemplatesData: null,
        myTemplatesSelected: true,
        sharedTemplatesSelected: false,
        noMyTemplatesFound: false,
        noSharedTemplatesFound: false,
      };
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
          if (this.myTemplatesData.length === 0 || this.myTemplatesData === undefined) {
            this.noMyTemplatesFound = true;
          }
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
          if (this.sharedTemplatesData.length === 0 || this.sharedTemplatesData === undefined) {
            this.noSharedTemplatesFound = true;
          }
        })
        .catch((error) => {
          console.error(error);
        });
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
.cards-container {
  height: 100%;
}

  .panel-close-btn {
    background-color: transparent;
    border: none;
    color: #596372;
  }

  .template-tabs {
    padding: 4px;
    background-color: #E9ECF1;
    border-radius: 8px;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
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
    box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05), 0px 1px 2px -1px rgb(0, 0, 0, 0.05), 0px 1px 0px -1px rgb(0, 0, 0, 0.05);
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
    box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05), 0px 1px 2px -1px rgb(0, 0, 0, 0.05), 0px 1px 0px -1px rgb(0, 0, 0, 0.05);
  }

</style>
