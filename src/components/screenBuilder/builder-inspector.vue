<template>
  <b-card
    no-body
    class="h-100 rounded-0 border-top-0 border-bottom-0 border-left-0"
  >
    <b-input-group size="sm">
      <b-input-group-prepend>
        <b-input-group-text
          class="filter-icon border-left-0 border-top-0 rounded-0"
        >
          <i class="fas fa-filter" />
        </b-input-group-text>
      </b-input-group-prepend>

      <b-form-input
        v-model="filterQuery"
        class="border-top-0 border-right-0 rounded-0"
        type="text"
        :placeholder="$t('Filter Controls')"
      />
    </b-input-group>

    <b-card-body no-body class="p-0 overflow-auto">
      <draggable
        v-if="renderControls"
        id="controls"
        v-model="filteredControls"
        data-cy="controls"
        v-bind="{
          sort: false,
          group: { name: 'controls', pull: 'clone', put: false }
        }"
        :clone="cloneControl"
        class="controls list-group w-auto list-group-flush"
      >
        <b-list-group-item
          v-for="(element, index) in filteredControls"
          :key="index"
          :data-cy="'controls-' + element.component"
        >
          <i v-if="element.config.icon" :class="element.config.icon" />
          {{ $t(element.label) }}
        </b-list-group-item>

        <li v-if="!filteredControls.length" class="list-group-item">
          <slot />
        </li>
      </draggable>
    </b-card-body>
  </b-card>
</template>

<script>
import _ from "lodash";
import draggable from "vuedraggable";
import { keyNameProperty } from "../../form-control-common-properties";
import VariableNameGenerator from "@/components/VariableNameGenerator";


const defaultConfig = [
  {
    name: "Default",
    items: []
  }
];

export default {
  name: "BuilderSidebar",
  components: {
    draggable
  },
  props: {
    controls: {
      type: Array,
      default: null
    },
    renderControls: {
      type: Boolean,
      default: true
    },
    collator: {
      type: Intl.Collator,
      default: null
    }
  },
  data() {
    const config = this.initialConfig || defaultConfig;
    this.migrateConfig(config);
    const generator = new VariableNameGenerator();
    const variables = generator.GetVariableNames(config);

    if (this.title && config[0].name === "Default") {
      config[0].name = this.title;
    }
    return {
      filterQuery: "",
      generator,
      variables,
      config
    };
  },
  computed: {
    filteredControls() {
      return this.controls
        .filter((control) => {
          return control.label
            .toLowerCase()
            .includes(this.filterQuery.toLowerCase());
        })
        .sort((a, b) => {
          return this.collator.compare(a.label, b.label);
        });
    }
  },
  methods: {
    cloneControl(control) {
      const copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: JSON.parse(JSON.stringify(control.inspector)),
        component: control.component,
        "editor-component": control["editor-component"],
        "editor-control": control["editor-control"],
        label: control.label,
        value: control.value
      };
      if (control.component === "FormDatePicker" && copy.config.phrases) {
        copy.config.phrases.ok = this.$t(copy.config.phrases.ok);
        copy.config.phrases.cancel = this.$t(copy.config.phrases.cancel);
      }
      copy.config.label = this.$t(copy.config.label);
      if (Array.isArray(copy.config.options)) {
        for (var io in copy.config.options) {
          copy.config.options[io].content = this.$t(
            copy.config.options[io].content
          );
        }
      }

      // If it's a container, let's add an items property, with the default of items in the control
      if (control.container) {
        copy.items = JSON.parse(JSON.stringify(control.items));
        copy.container = true;
      }

      // Generate Variable Name
      if (
        control.inspector.indexOf(keyNameProperty) !== -1 ||
        control.component === "FormLoop"
      ) {
        [this.variables, copy.config.name] = this.generator.generate(
          this.config,
          copy["editor-control"] ? copy["editor-control"] : copy.component
        );
        if (_.has(copy, "config.settings.varname")) {
          copy.config.settings.varname = copy.config.name;
        }
      }

      return copy;
    },
    migrateConfig(config = this.config) {
      config.forEach((page) => this.replaceFormText(page.items));
      config.forEach((page) => this.migrateFormSubmit(page.items));
      config.forEach((page) => this.updateFieldNameValidation(page.items));
      config.forEach((page) =>
        this.removeDataVariableFromNestedScreens(page.items)
      );
    },
    replaceFormText(items) {
      items.forEach((item) => {
        if (item.component === "FormText") {
          item.component = "FormHtmlEditor";
          item["editor-component"] = "FormHtmlEditor";
          const style =
            (item.config.fontSize
              ? "font-size: " + item.config.fontSize + ";"
              : "") +
            (item.config.fontWeight
              ? "font-weight: " + item.config.fontWeight + ";"
              : "") +
            (item.config.textAlign
              ? "text-align: " + item.config.textAlign + ";"
              : "");
          item.config = {
            content:
              '<div style="' + style + '">' + item.config.label + "</div>",
            interactive: true
          };
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    migrateFormSubmit(items) {
      items.forEach((item) => {
        if (item["editor-control"] !== "FormSubmit") {
          item["editor-control"] = item["editor-component"];
        }

        if (item.config.event === "submit") {
          if (item["editor-component"] === "FormNestedScreen") {
            // Old nested screens erroneously had an event key. Remove it here
            // and set the editor-control back to FormNestedScreen.
            delete item.config.event;
            item["editor-control"] = "FormNestedScreen";
            item.config.name = "Nested Screen";
          } else {
            if (item["editor-control"] !== "FormImage") {
              item["editor-control"] = "FormSubmit";
            }
          }
        }
        if (item.config.event === "pageNavigate") {
          item["editor-control"] = "PageNavigation";
        }
        if (
          item.items instanceof Array &&
          item.component === "FormMultiColumn"
        ) {
          item["editor-control"] = "FormMultiColumn";
          item.items.forEach((column) => this.migrateFormSubmit(column));
        }
      });
    },
    updateFieldNameValidation(items) {
      items.forEach((item) => {
        if (item.inspector) {
          item.inspector.forEach((inspector) => {
            if (
              inspector.field === "name" &&
              "validation" in inspector.config &&
              inspector.config.name !== "DataVariable" &&
              item.component !== "FileUpload" &&
              item.component !== "FormButton"
            ) {
              inspector.config.validation = keyNameProperty.config.validation;
            }
          });
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    removeDataVariableFromNestedScreens(items) {
      items.forEach((item) => {
        if (item.inspector) {
          const hasDataVariable = item.inspector.find(
            (inspector) => inspector.config.name === "DataVariable"
          );
          item.inspector = item.inspector.filter(
            (inspector) => inspector.config.name !== "DataVariable"
          );
          if (hasDataVariable) {
            delete item.config.name;
          }
        }
      });
    },
  }
};
</script>
