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
        <img
          class="thumbnail-image"
          :src="thumbnail"
          :alt="`${template.name}`"
        />
      </div>
      <div
        v-else
        class="thumbnail-container thumbnail-icon-container d-flex align-items-center justify-content-center"
      >
        <i class="p-4 fas fa-palette thumbnail-icon"></i>
      </div>
      <hr class="card-divider" />
      <b-card-body class="p-1">
        <div class="template-details">
          <span class="template-name d-block pt-1">{{ template.name }}</span>
          <span class="template-description d-block">{{
            truncateText(template.description, 100)
          }}</span>
        </div>
        <b-collapse v-model="showApplyOptions">
          <b-form-checkbox-group
            v-model="selected"
            class="apply-options-group p-2"
            name="apply-options"
          >
            <div class="row row-cols-3 icons-row">
              <div
                v-for="option in applyOptions"
                :key="option.value"
                class="col apply-options-container d-flex align-items-baseline flex-column"
              >
                <div
                  class="icon-container"
                  :class="{ selected: selected.includes(option.value) }"
                  @click.stop="toggleOption(option.value)"
                >
                  <div v-if="option.value === 'CSS'">
                    <css-icon />
                  </div>
                  <div v-else>
                    <i :class="option.icon"></i>
                  </div>
                </div>
                <b-form-checkbox class="option-checkbox" :value="option.value">
                  {{ option.text }}
                </b-form-checkbox>
              </div>
            </div>
          </b-form-checkbox-group>
          <hr class="bottom-card-divider" />
          <div class="apply-btn-container d-flex justify-content-end">
            <button
              type="button"
              size="sm"
              class="btn btn-outline-secondary card-btn"
              @click.stop="onCancel"
            >
              {{ $t("Cancel") }}
            </button>
            <button
              :disabled="!selected.length"
              type="button"
              size="sm"
              class="btn btn-primary ml-2 card-btn"
              @click.stop="applyTemplate"
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
import CssIcon from "./CssIcon.vue";

export default {
  components: {
    CssIcon
  },
  mixins: [],
  props: ["template", "screenId", "currentScreenPage"],
  data() {
    return {
      showApplyOptions: false,
      selected: [],
      applyOptions: [
        { text: "CSS", value: "CSS" },
        { text: "Fields", value: "Fields", icon: "fp-fields-icon" },
        { text: "Layout", value: "Layout", icon: "fp-layout-icon" }
      ]
    };
  },
  computed: {
    thumbnail() {
      if (
        this.template?.template_media &&
        this.template.template_media.length > 0
      ) {
        return this.template.template_media[0].url;
      }
      if (this.template?.template_media?.thumbnail?.url) {
        return this.template?.template_media.thumbnail.url;
      }
      return null;
    }
  },
  mounted() {},
  methods: {
    showDetails() {
      this.showApplyOptions = !this.showApplyOptions;
    },
    applyTemplate() {
      ProcessMaker.apiClient
        .post(`/template/screen/${this.template.id}/apply`, {
          screenId: this.screenId,
          templateOptions: this.selected,
          currentScreenPage: this.currentScreenPage
        })
        .then((response) => {
          ProcessMaker.alert(
            this.$t("The template options have been applied."),
            "success"
          );
          window.location.reload();
        })
        .catch((error) => {
          const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
          ProcessMaker.alert(errorMessage, "danger");
        });
    },
    onCancel() {
      this.showApplyOptions = false;
      this.selected = [];
    },
    toggleOption(value) {
      const index = this.selected.indexOf(value);
      if (index === -1) {
        this.selected.push(value);
      } else {
        this.selected.splice(index, 1);
      }
    },
    truncateText(text, limit) {
      if (!text) return "";
      return text.length > limit ? `${text.substring(0, limit)}...` : text;
    }
  }
};
</script>

<style lang="scss" scoped>
.fp-fields-icon,
.fp-layout-icon {
  color: #eaf2ff;
}

.screenbuilder-template-card {
  width: 225px;
  margin: 8px;
  border: 1px solid #d7dde5;
  border-radius: 8px;
  box-shadow: 0px 3px 6px -3px rgb(0, 0, 0, 0.05),
    0px 2px 4px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.card-divider {
  width: 100%;
  margin: 0px;
  background-color: #d7dde5;
}

.thumbnail-container:hover,
.thumbnail-container.active {
  border-color: #1572c2;
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
  color: #cdddee;
  font-size: 59px;
}

.template-details {
  padding: 10px;
}

.template-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f343b;
}

.template-description {
  font-size: 12.5px;
  font-weight: 400;
  line-height: 18px;
  color: #4e5663;
}

.apply-options-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icons-row {
  margin-right: -5px !important;
  margin-left: -5px !important;
}

.apply-options-container {
  padding: 5px;
}

.apply-options-group i {
  display: block;
  font-size: 58px;
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 66px;
  height: 76px;
  border: 0.7px solid #d7dde5;
  border-radius: 8px;
  margin-bottom: 10px;
}

.option-checkbox {
  font-size: 12px;
}

.bottom-card-divider {
  width: 90%;
  background-color: #e9ecf1;
  margin-top: 0px;
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
