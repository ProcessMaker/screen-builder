<template>
  <div class="form-group">
    <required-asterisk /><label v-uni-for="name">{{ label }}</label>
    <component
      :is="componentType"
      v-if="componentType !== 'input' && !encryptedConfig?.encrypted"
      v-model="localValue"
      v-bind="componentConfigComputed"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      :type="inputType"
      @change="onChange"
    />
    <input
      v-else-if="componentType === 'input' && !encryptedConfig?.encrypted"
      v-model="localValue"
      v-bind="componentConfig"
      v-uni-id="name"
      :name="name"
      class="form-control"
      :class="classList"
      :type="inputType"
      :maxlength="maxlength"
      @change="onChange"
    />
    <div class="div-data-container" v-else-if="encryptedConfig?.encrypted">
      <component
        :is="componentType"
        v-if="componentType !== 'input'"
        v-model="localValue"
        v-bind="componentConfigComputed"
        v-uni-id="name"
        :name="name"
        class="form-control"
        :class="classList"
        :type="inputType"
        @change="onChange"
      />
      <input
        v-else
        v-model="localValue"
        v-bind="componentConfig"
        v-uni-id="name"
        :name="name"
        class="form-control"
        :class="classList"
        :type="inputType"
        :maxlength="maxlength"
        @change="onChange"
      />
      <b-button variant="outline-secondary conceal-reveal-btn" @click="concealOrReveal">
        <i :class="iconBtn"></i>
        {{ labelBtn }}
      </b-button>
    </div>

    <template v-if="validator && validator.errorCount">
      <div
        v-for="(errors, index) in validator.errors.all()"
        :key="index"
        class="invalid-feedback"
      >
        <div v-for="(error, subIndex) in errors" :key="subIndex">
          {{ error }}
        </div>
      </div>
    </template>
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
    <div v-if="encryptedConfig?.encrypted && errorEncryptedField" class="invalid-feedback d-block">{{ errorEncryptedField }}</div>
    <small v-if="helper" class="form-text text-muted">{{ helper }}</small>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";
import { TheMask } from "vue-the-mask";
import moment from "moment";
import {
  RequiredAsterisk,
  getUserDateFormat,
  getUserDateTimeFormat,
  ValidationMixin
} from "@processmaker/vue-form-elements";
import Inputmasked from "./form-input-masked.vue";
import { validate as uuidValidate } from 'uuid';

const uniqIdsMixin = createUniqIdsMixin();
const componentTypes = {
  currency: "inputmasked",
  date: "the-mask",
  datetime: "the-mask",
  percentage: "inputmasked",
  custom: "the-mask"
};
const componentTypesConfigs = {
  currency: "getCurrencyFormat",
  date: "getDateFormat",
  datetime: "getDatetimeFormat",
  percentage: "getPercentageFormat",
  custom: "getCustomFormatter"
};

export default {
  components: { TheMask, Inputmasked, RequiredAsterisk },
  mixins: [uniqIdsMixin, ValidationMixin],
  inheritAttrs: false,
  props: [
    "value",
    "label",
    "error",
    // 'required',
    "helper",
    "name",
    "controlClass",
    "dataMask",
    "config",
    // these should not be passed by $attrs
    "transientData",
    "formConfig",
    "form-watchers",
    "encryptedConfig",
  ],
  data() {
    const { dataFormat, customFormatter } = this.config;
    const maxlength =
      dataFormat === "int" || dataFormat === "float" ? 15 : null;
    const getCurrencyFormat = (() => {
      const format =
        this.dataMask && this.dataMask
          ? this.dataMask && this.dataMask.format
          : null;
      const separators = format ? format.match(/[.,]/g) : [".", ","];
      if (separators.length === 0) {
        separators.push("", ".");
      } else if (separators.length === 1) {
        separators.push(separators[0] === "." ? "," : ".");
      }
      const precision = format
        ? (format.split(separators[1])[1] || "").length
        : 2;
      return {
        decimal: separators[1],
        thousands: separators[0],
        prefix:
          this.dataMask && this.dataMask.symbol
            ? `${this.dataMask.symbol} `
            : "",
        suffix:
          this.dataMask && this.dataMask.code ? ` ${this.dataMask.code}` : "",
        precision,
        masked: false
      };
    })();
    const getPercentageFormat = {
      decimal: ".",
      thousands: "",
      prefix: "",
      suffix: " %",
      precision: 2,
      masked: false
    };
    const getDateFormat = {
      masked: true,
      mask: this.getUserConfig().date_mask || this.getMask().date
    };
    const getDatetimeFormat = {
      masked: true,
      mask: this.getUserConfig().datetime_mask || this.getMask().dateTime
    };
    const componentType = (() => {
      if (customFormatter) {
        return componentTypes.custom;
      }
      return componentTypes[dataFormat] || "input";
    })();
    const dataType = (() => {
      switch (dataFormat) {
        case "int":
          return "number";
        case "float":
          return "number";
        case "email":
          return "email";
        case "password":
          return "password";
        default:
          return "text";
      }
    })();
    const getCustomFormatter = {
      masked: true,
      mask: customFormatter
    };
    let config;
    if (customFormatter) {
      config = componentTypesConfigs.custom;
    } else {
      config = componentTypesConfigs[dataFormat];
    }
    const configs = {
      getCurrencyFormat,
      getDateFormat,
      getDatetimeFormat,
      getPercentageFormat,
      getCustomFormatter
    };
    return {
      dataFormat,
      customFormatter,
      maxlength,
      getCurrencyFormat,
      getPercentageFormat,
      getDateFormat,
      getDatetimeFormat,
      componentType,
      dataType,
      getCustomFormatter,
      componentConfig: JSON.parse(
        JSON.stringify({ ...(config ? configs[config] : {}), ...this.$attrs })
      ),
      validator: null,
      localValue: null,
      validationRules: {
        percentage: "regex:/^[+-]?\\d+(\\.\\d+)?$/"
      },
      // For encrypted field
      inputType: '',
      iconBtn: '',
      labelBtn: '',
      errorEncryptedField: ''
    };
  },
  computed: {
    classList() {
      return {
        "is-invalid":
          (this.validator && this.validator.errorCount) || this.error || this.errorEncryptedField,
        [this.controlClass]: !!this.controlClass
      };
    },
    componentConfigComputed() {
      return JSON.parse(JSON.stringify(this.componentConfig));
    },
    requestId() {
      const node = document.head.querySelector(`meta[name="request-id"]`);
      if (node === null) {
        return null;
      }
      return node.content;
    }
  },
  watch: {
    value(value) {
      if (this.localValue !== value) {
        this.localValue = value;
      }
    },
    localValue(value) {
      // To Do: Add logic for the encrypted fields
      if (value !== this.value) {
        this.$emit("input", this.convertToData(value));
      }
    }
  },
  mounted() {
    if (this.value !== undefined) {
      this.localValue = this.value;
    }
    /*
     * Set initial atttributes for Conceal/Reveal button only if
     * "encrypted" attribute is enabled
     */
    if (this.encryptedConfig?.encrypted) {
      if (uuidValidate(this.localValue)) {
        this.inputType = "password";
        this.iconBtn = "fas fa-eye";
        this.labelBtn = this.$t("Reveal");
        this.componentConfig.readonly = true;
      } else {
        this.inputType = "text";
        this.iconBtn = "fas fa-eye-slash";
        this.labelBtn = this.$t("Conceal");
        this.componentConfig.readonly = false;
      }
    } else {
        this.inputType = this.dataType;
      }
  },
  methods: {
    onChange() {
      this.$emit("change", this.convertToData(this.localValue));
    },
    getUserConfig() {
      return (window.ProcessMaker && window.ProcessMaker.user) || {};
    },
    getUserDateFormat,
    getUserDateTimeFormat,
    convertToData(newValue) {
      if (this.customFormatter) {
        newValue = newValue.replace(/[^\w]/g, "");
      } else {
        switch (this.dataFormat) {
          case "string":
            newValue = newValue.toString();
            break;
          case "boolean":
            newValue = Boolean(newValue);
            break;
          case "currency":
          case "percentage":
          case "float":
            newValue = parseFloat(newValue);
            if (isNaN(newValue)) {
              newValue = null;
            }
            break;
          case "int":
            newValue = parseInt(newValue);
            if (isNaN(newValue)) {
              newValue = null;
            }
            break;
          case "date":
            if (this.componentName === "FormDatePicker") {
              newValue = moment
                .utc(newValue, [getUserDateFormat(), moment.ISO_8601], true)
                .toISOString()
                .split(RegExp("T[0-9]"))[0];
            }
            break;
          case "datetime":
            if (this.componentName === "FormDatePicker") {
              newValue = moment(
                newValue,
                [getUserDateTimeFormat(), moment.ISO_8601],
                true
              ).toISOString();
            }
            break;
          case "array":
            break;
          default:
            newValue = newValue.toString();
            break;
        }
      }
      return newValue;
    },
    convertFromData(value) {
      return value;
    },
    getMask() {
      // Mask changed to ISO format for all the users
      return {
        date: ["####-##-##"],
        dateTime: ["####-##-## ##:##"]
      };
    },
    concealOrReveal() {
      // Execute only if "encrypted" attribute is enabled
      if (this.encryptedConfig?.encrypted) {
        if (this.inputType === "text") {
          if (this.localValue !== "") {
            // Build data to send
            const dataToEncrypt = {
              request_id: this.requestId,
              field_name: this.name,
              plain_text: this.localValue,
              screen_id: this.$root.task?.screen?.screen_id
            };

            // Call endpoint to encrypt data
            window.ProcessMaker.apiClient
              .post("encrypted_data/encryptText", dataToEncrypt)
              .then((response) => {
                // Change controls appearance
                this.inputType = "password";
                this.iconBtn = "fas fa-eye";
                this.labelBtn = this.$t("Reveal");
                this.componentConfig.readonly = true;
                this.errorEncryptedField = "";

                // Assign uuid from encrypted data
                this.localValue = response;
              })
              .catch((err) => {
                const { data } = err.response;
                if (data.message) {
                  this.errorEncryptedField = data.message;
                }
              });
          } else {
            this.errorEncryptedField = this.$t(
              "The current value is empty but a value is required. Please provide a valid value."
            );
          }
        } else {
          // Build data to send
          const dataToDecrypt = {
              request_id: this.requestId,
              field_name: this.name,
              screen_id: this.$root.task?.screen?.screen_id
            };

            // Call endpoint to decrypt data
            window.ProcessMaker.apiClient
              .post("encrypted_data/decryptText", dataToDecrypt)
              .then((response) => {
                // Change controls appearance
                this.inputType = this.dataType;
                this.iconBtn = "fas fa-eye-slash";
                this.labelBtn = this.$t("Conceal");
                this.componentConfig.readonly = false;

                // Assign value decrypted
                this.localValue = response;
              })
              .catch((err) => {
                const { data } = err.response;
                if (data.message) {
                  this.errorEncryptedField = data.message;
                }
              });
        }
      }
    }
  }
};
</script>
<style scoped>
.div-data-container {
  display: inline-flex;
  width: 100%;
}
.conceal-reveal-btn {
  width: 20%;
  margin-left: 5px;
}
</style>