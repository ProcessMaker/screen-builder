<template>
  <div class="form-group">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <label class="m-0">{{ label }}</label>
      <b-button
        class=""
        variant="secondary"
        size="sm"
        data-cy="add-rule"
        @click="showAddCard"
        >{{ $t("Add Rule") }}</b-button
      >
    </div>
    <div v-if="showCard" class="card mb-2">
      <div class="card-body p-2">
        <multiselect
          v-model="selectedOption"
          label="content"
          track-by="content"
          :placeholder="$t('Select...')"
          :show-labels="false"
          :options="options"
          :class="fieldClass"
          data-cy="select-rule"
        >
          <template slot="noResult">{{
            $t("No elements found. Consider changing the search query.")
          }}</template>
          <template slot="noOptions">{{ $t("No Data Available") }}</template>
        </multiselect>
        <div v-if="optionError" class="invalid-feedback d-block">
          <div>{{ optionError }}</div>
        </div>
      </div>
      <div class="card-footer text-right p-2">
        <b-button
          variant="outline-secondary"
          size="sm"
          class="mr-2"
          data-cy="cancel-rule"
          @click="hideCard"
          >{{ $t("Cancel") }}</b-button
        >
        <b-button
          :disabled="disableBtn"
          variant="secondary"
          size="sm"
          data-cy="save-rule"
          @click="saveRule"
          >{{ $t("Save") }}</b-button
        >
      </div>
    </div>
    <p v-if="!hasRules && !showCard">{{ $t("No validation rule(s)") }}</p>
    <div v-if="hasRules">
      <div role="tablist">
        <b-card
          v-for="(rule, index) in rules"
          :key="index"
          class="mb-2 border-1"
          :class="{
            'border-0': showDeleteConfirmCard,
            'border-top-1': showDeleteConfirmCard,
            'border-1': !showDeleteConfirmCard
          }"
        >
          <div
            v-if="showDeleteConfirmCard && removeIndex == index"
            class="card mb-3 bg-danger text-white text-right"
          >
            <div class="card-body p-2 text-left">
              {{ confirmMessage }}
            </div>
            <div class="card-footer text-right p-2">
              <button
                type="button"
                class="btn btn-sm btn-light mr-2"
                data-cy="cancel-confirm-delete-rule"
                @click="hideDeleteConfirmCard"
              >
                {{ $t("Cancel") }}
              </button>
              <button
                type="button"
                class="btn btn-sm btn-danger"
                data-cy="confirm-delete-rule"
                @click="deleteRule(index)"
              >
                {{ $t("Delete") }}
              </button>
            </div>
          </div>
          <b-card-header header-tag="header" class="p-0" role="tab">
            <div class="p-1 d-flex justify-content-between align-items-center">
              {{ rule.content }}
              <div class="actions">
                <b-button
                  v-if="rule.configs"
                  v-b-toggle="formatRuleContentAsId(rule.content)"
                  :aria-label="$t('Toggle Configuration')"
                  variant="link"
                  class="p-0 mr-1 secondary"
                  data-cy="edit-rule"
                >
                  <i class="fas fa-cog fa-fw text-secondary" />
                </b-button>
                <b-button
                  :aria-label="$t('Delete')"
                  variant="link"
                  class="p-0"
                  data-cy="remove-rule"
                  @click="confirmDelete(index)"
                  ><i class="fas fa-trash-alt fa-fw text-secondary"
                /></b-button>
              </div>
            </div>
          </b-card-header>
          <b-collapse
            :id="formatRuleContentAsId(rule.content)"
            :accordion="formatRuleContentAsId(rule.content)"
            :visible="rule.visible"
            role="tabpanel"
          >
            <b-card-body>
              <div class="p-2">
                <div
                  v-for="config in rule.configs"
                  :key="config.label"
                  class="mb-2"
                >
                  <div v-if="config.type === 'FormInput'">
                    <form-input
                      v-model="config.value"
                      :label="config.label"
                      :name="config.name || config.label"
                      :validation="config.validation"
                      :helper="config.helper"
                    />
                  </div>
                  <component
                    :is="config.type"
                    v-else
                    v-model="config.value"
                    :label="config.label"
                    :name="config.name || config.label"
                    :validation="config.validation"
                    :helper="config.helper"
                    :builder="builder"
                    :selected-control="selectedControl"
                    :form-config="formConfig"
                  />
                </div>
                <div>
                  <small class="form-text text-muted">{{ rule.helper }}</small>
                </div>
              </div>
              <b-card-footer class="text-right">
                <b-button
                  variant="outline-secondary"
                  size="sm"
                  class="mr-2"
                  data-cy="cancel-rule"
                  @click="onCancel(rule, index)"
                  >{{ $t("Cancel") }}</b-button
                >
                <b-button
                  variant="secondary"
                  size="sm"
                  data-cy="update-rule"
                  @click="onUpdate(rule, index)"
                  >{{ $t("Update") }}</b-button
                >
              </b-card-footer>
            </b-card-body>
          </b-collapse>
        </b-card>
      </div>
    </div>
    <small class="form-text text-muted">{{ helper }}</small>
    <div class="mt-4 required-checkbox">
      <form-checkbox v-model="requiredCheckbox" :label="$t('Make Required')" />
    </div>
  </div>
</template>

<script>
import { FormInput, FormCheckbox } from "@processmaker/vue-form-elements";
import _ from "lodash";
import InputVariable from "./input-variable.vue";

export default {
  components: {
    FormInput,
    InputVariable,
    FormCheckbox
  },
  props: [
    "label",
    "value",
    "helper",
    "name",
    "builder",
    "selectedControl",
    "formConfig"
  ],
  data() {
    return {
      rules: [],
      showCard: false,
      showDeleteConfirmCard: false,
      selectedOption: "",
      confirmMessage: "",
      removeIndex: null,
      optionError: "",
      disableBtn: false,
      cloneRules: [],
      options: [
        {
          value: "accepted",
          content: this.$t("Accepted"),
          helper: this.$t(
            "The field under validation must be yes, on, 1 or true."
          )
        },
        {
          value: "alpha",
          content: this.$t("Alpha"),
          helper: this.$t(
            "The field under validation must be entirely alphabetic characters."
          )
        },
        {
          value: "alpha_num",
          content: this.$t("Alpha-Numeric"),
          helper: this.$t(
            "The field under validation must be entirely alpha-numeric characters."
          )
        },
        {
          value: "",
          field: "between:",
          content: this.$t("Between Min & Max"),
          helper: this.$t(
            "The field under validation must have a size between the given min and max."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Min"),
              helper: "",
              validation: "required|integer"
            },
            {
              type: "FormInput",
              label: this.$t("Max"),
              helper: "",
              validation: "required|integer"
            }
          ]
        },
        {
          value: "email",
          content: this.$t("Email"),
          helper: this.$t(
            "The field under validation must be formatted as an e-mail address."
          )
        },
        {
          value: "",
          field: "in:",
          content: this.$t("In"),
          helper: this.$t(
            "The field under validation must be included in the given list of values. The field can be an array or string."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Values"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "",
          field: "max:",
          content: this.$t("Max Length"),
          helper: "",
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Max Input"),
              helper: this.$t(
                "Validate that an attribute is no greater than a given length."
              ),
              validation: "required|integer"
            }
          ]
        },
        {
          value: "",
          field: "min:",
          content: this.$t("Min Length"),
          helper: "",
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Min Input"),
              helper: this.$t(
                "Validate that an attribute is at least a given length."
              ),
              validation: "required|integer"
            }
          ]
        },
        {
          value: "",
          field: "not_in:",
          content: this.$t("Not In"),
          helper: this.$t(
            "The field under validation must not be included in the given list of values."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Values"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "required",
          content: this.$t("Required"),
          helper: this.$t(
            "Checks if the length of the String representation of the value is >"
          )
        },
        {
          value: "",
          field: "required_if:",
          content: this.$t("Required If"),
          helper: this.$t(
            "The field under validation must be present and not empty if the Variable Name field is equal to any value."
          ),
          visible: true,
          configs: [
            {
              type: "InputVariable",
              name: "variable-name",
              label: this.$t("Variable Name"),
              helper: "",
              validation: "required"
            },
            {
              type: "FormInput",
              name: "variable-value",
              label: this.$t("Variable Value"),
              helper: "",
              validation: ""
            }
          ]
        },
        {
          value: "",
          field: "required_unless:",
          content: this.$t("Required Unless"),
          helper: this.$t(
            "The field under validation must be present and not empty unless the Variable Name field is equal to any value."
          ),
          visible: true,
          configs: [
            {
              type: "InputVariable",
              name: "variable-name",
              label: this.$t("Variable Name"),
              helper: "",
              validation: "required"
            },
            {
              type: "FormInput",
              name: "variable-value",
              label: this.$t("Variable Value"),
              helper: ""
            }
          ]
        },
        {
          value: "",
          field: "same:",
          content: this.$t("Same"),
          helper: this.$t(
            "The given field must match the field under validation."
          ),
          visible: true,
          configs: [
            {
              type: "InputVariable",
              name: "variable-name",
              label: this.$t("Variable Name"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "url",
          content: "URL",
          helper: this.$t("Validate that an attribute has a valid URL format.")
        },
        {
          value: "custom_date",
          content: "Date",
          helper: this.$t(
            "The field under validation must be a valid date format which is acceptable by Javascript's Date object."
          )
        },
        {
          value: "",
          field: "after:",
          content: this.$t("After Date"),
          helper: this.$t(
            "The field under validation must be after the given date."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Date"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "",
          field: "after_or_equal:",
          content: this.$t("After or Equal to Date"),
          helper: this.$t(
            "The field unter validation must be after or equal to the given field."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Date"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "",
          field: "before:",
          content: this.$t("Before Date"),
          helper: this.$t(
            "The field unter validation must be before the given date."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Date"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "",
          field: "before_or_equal:",
          content: this.$t("Before or Equal to Date"),
          helper: this.$t(
            "The field unter validation must be before or equal to the given field."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Date"),
              helper: "",
              validation: "required"
            }
          ]
        },
        {
          value: "",
          field: "regex:",
          content: this.$t("Regex"),
          helper: this.$t(
            "The field under validation must match the given regular expression."
          ),
          visible: true,
          configs: [
            {
              type: "FormInput",
              label: this.$t("Regex Pattern"),
              helper: "",
              validation: "required"
            }
          ]
        }
      ].sort((a, b) => (a.content > b.content ? 1 : -1))
    };
  },
  computed: {
    fieldClass() {
      return this.optionError ? "is-invalid" : "";
    },
    hasRules() {
      if (this.rules && this.rules.length) {
        return true;
      }

      return false;
    },
    requiredCheckbox: {
      get() {
        return this.rules.some((item) => item.value === "required");
      },
      set(value) {
        if (value) {
          this.rules.push(
            this.options.find((item) => item.value === "required")
          );
        } else {
          this.rules = this.rules.filter((item) => item.value !== "required");
        }
      }
    }
  },
  watch: {
    rules: {
      deep: true,
      handler(rules) {
        this.showCard = false;
        this.selectedOption = "";
        if (typeof rules === "string" || rules === undefined) {
          this.rules = [];
        }
        if (this.rules) {
          this.setRuleConfigs();
        }
        this.$emit("input", rules);
      }
    },
    value() {
      this.rules = this.value || [];
      this.cloneSetRules();
    },
    selectedOption: {
      deep: true,
      handler(value) {
        this.disableBtn = true;
        this.optionError = "";
        if (!value) {
          return;
        }
        if (this.rules?.find((item) => item.content === value.content)) {
          this.optionError = this.$t("This field already exists");
          this.disableBtn = true;
        } else {
          this.disableBtn = false;
        }
      }
    }
  },
  mounted() {
    this.rules = this.value || [];
    this.cloneSetRules();
  },
  methods: {
    showAddCard() {
      this.showCard = true;
      if (!this.selectedOption) {
        this.disableBtn = true;
      }
    },
    hideCard() {
      this.showCard = false;
      this.selectedOption = "";
      this.optionError = "";
    },
    saveRule() {
      const option = _.cloneDeep(this.selectedOption);
      this.rules.push(option);
      this.hideCard();
      this.selectedOption = "";
    },
    confirmDelete(index) {
      this.removeIndex = index;
      this.showDeleteConfirmCard = true;
      this.confirmMessage = _.unescape(
        this.$t('Are you sure you want to delete the "{{item}}" rule?', {
          item: this.rules[index].content
        })
      );
    },
    hideDeleteConfirmCard() {
      this.removeIndex = null;
      this.showDeleteConfirmCard = false;
    },
    deleteRule(index) {
      this.rules.splice(index, 1);
      this.cloneRules.splice(index, 1);
      this.hideDeleteConfirmCard();
    },
    setRuleConfigs() {
      this.rules.forEach((rule) => {
        if (rule.configs) {
          let ruleConfigs = [];
          rule.configs.forEach((config) => {
            if (config.value) {
              ruleConfigs.push(config.value);
            }
          });

          if (ruleConfigs.length > 1) {
            ruleConfigs = ruleConfigs.join(",");
          }
          if (ruleConfigs.length) {
            rule.value = rule.field + ruleConfigs;
          }
        }
      });
    },
    onUpdate(rule, index) {
      const content = this.formatRuleContentAsId(rule.content);
      this.$root.$emit("bv::toggle::collapse", content);
      this.$set(this.rules[index], "visible", false);
      this.cloneRules = JSON.parse(JSON.stringify(this.rules));
    },
    onCancel(rule, index) {
      const content = this.formatRuleContentAsId(rule.content);
      if (this.cloneRules && this.cloneRules[index]) {
        if (!_.isEqual(rule, this.cloneRules[index])) {
          Object.assign(
            this.rules[index],
            JSON.parse(JSON.stringify(this.cloneRules[index]))
          );
        }
      } else {
        rule.configs.forEach((config) => {
          if (config.value) {
            config.value = "";
          }
        });
        this.rules[index].configs = rule.configs;
      }
      this.$root.$emit("bv::toggle::collapse", content);
    },
    formatRuleContentAsId(content) {
      return content.toLowerCase().split(" ").join("-");
    },
    cloneSetRules() {
      this.cloneRules = JSON.parse(JSON.stringify(this.rules));
    }
  }
};
</script>

<style lang="scss" scoped>
.card-body {
  padding: 0;
}
.required-checkbox .form-group {
  margin-bottom: 0;
}
</style>
