<template>
  <div>
    <b-card
      img-top
      class="mb-2 screenbuilder-template-card"
      @click="showDetails"
    >
      <div
        v-if="thumbnail"
        class="thumbnail-container thumbnail-image-container"
      >
        <img class="thumbnail-image" :src="thumbnail" :alt="`${template.name}`"/>
      </div>
      <div
        v-else
        class="thumbnail-container thumbnail-icon-container d-flex align-items-center justify-content-center"
      >
        <i class="p-4 fas fa-palette thumbnail-icon"></i>
      </div>
      <hr class="card-divider">
      <b-card-body class="p-1">
        <div class="template-details">
          <span class="template-name d-block pt-1">{{ template.name }}</span>
          <span class="template-description d-block">{{ template.description }}</span>
        </div>
        <b-collapse v-model="showApplyOptions">
            <b-form-checkbox-group
              class="apply-options-group p-2"
              v-model="selected"
              name="apply-options"
            >
              <div v-for="option in applyOptions" :key="option.value">
                <i :class="option.icon"></i>
                <b-form-checkbox
                  class="option-checkbox"
                  :value="option.value"
                >
                  {{ option.text }}
                </b-form-checkbox>
              </div>
            </b-form-checkbox-group>

            <hr class="bottom-card-divider">
            <div class="apply-btn-container d-flex justify-content-end">
              <button
                type="button"
                size="sm"
                class="btn btn-outline-secondary card-btn"
                @click="onCancel"
              >
                {{ $t("Cancel") }}
              </button>
              <button
                :disabled="!selected.length"
                type="button"
                size="sm"
                class="btn btn-primary ml-2 card-btn"
                @click="onApply"
              >
                {{ $t("Apply") }}
              </button>
            </div>
        </b-collapse>
      </b-card-body>
    </b-card>
    
  </div>
</template>

<script>

export default {
  mixins: [],
  props: ['template'],
  data() {
    return {
      showApplyOptions: false,
      selected: [],
      applyOptions: [
        { text: 'CSS', value: 'css', icon: 'fp-css-icon' },
        { text: 'Fields', value: 'fields', icon: 'fp-fields-icon' },
        { text: 'Layout', value: 'layout', icon: 'fp-layout-icon' },
      ],
    };
  },
  computed: {
    thumbnail() {
      if (this.template?.template_media && this.template.template_media.length > 0) {
        return this.template.template_media[0].url;
      } else if (this.template?.template_media?.thumbnail?.url) {
        return this.template?.template_media.thumbnail.url
      }
      return null;
    },
  },
  mounted() {
  },
  methods: {
    showDetails() {
      this.showApplyOptions = !this.showApplyOptions;
    },
    onApply() {
      // TODO: apply selected options
    },
    onCancel() {
      this.showApplyOptions = false;
      this.selected = [];
    }
  },
};
</script>

<style lang="scss" scoped>

.screenbuilder-template-card {
  width: 225px;
  margin: 8px;
  border: 1px solid #D7DDE5;
  border-radius: 8px;
  box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05), 0px 2px 4px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.card-divider {
  width: 100%;
  margin: 0px;
  background-color: #D7DDE5;
}

// .thumbnail-container {
//   width: 247px;
//   height: 133px;
//   border: 2px solid #CDDDEE;
//   border-radius: 7px;
//   background-color: #fff;
// }

.thumbnail-container:hover,
.thumbnail-container.active {
  border-color: #1572C2;
  cursor: pointer;
}

.thumbnail-image {
  width: 100%;
  border-radius: 8px 8px 0px 0px;
}

.thumbnail-image-container {
  border-radius: 8px;
  padding: 0px !important;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.thumbnail-icon {
  color: #CDDDEE;
  font-size: 59px;
}

.template-details {
  padding: 10px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2F343B;
}

.template-description {
  font-size: 12.5px;
  font-weight: 400;
  line-height: 18px;
  color: #4E5663;
}

.apply-options-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
}

.apply-options-group i {
  margin-bottom: 5px;
  display: block;
  font-size: 50px;
}

.option-checkbox {
  font-size: 12px;
}

.bottom-card-divider {
  width: 90%;
  background-color: #E9ECF1
}

.apply-btn-container {
  padding: 0px 10px 10px 0px;
}

.card-btn {
  font-size: 14px;
  text-transform: none;
  border-radius: 8px;
  padding: 5px 10px;
}

</style>