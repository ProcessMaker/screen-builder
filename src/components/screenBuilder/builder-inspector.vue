<template>
  <b-col
    v-if="renderControls"
    class="overflow-hidden h-100 p-0 inspector-column"
  >
    <b-card
      no-body
      class="h-100 rounded-0 border-top-0 border-bottom-0 border-left-0"
    >
      <b-card
        no-body
        class="p-0 h-100 border-top-0 border-bottom-0 border-right-0 rounded-0"
      >
        <b-card-body class="p-0 h-100 overflow-auto">
          <template v-for="accordion in accordions">
            <b-button
              v-if="getInspectorFields(accordion).length > 0"
              :key="`${accordionName(accordion)}-button`"
              variant="outline"
              class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize shadow-none"
              :data-cy="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :accordion-name="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :is-open="accordion.open ? '1' : '0'"
              @click="toggleAccordion(accordion)"
            >
              <i class="fas fa-cog mr-2" />
              {{ $t(accordionName(accordion)) }}
              <i
                class="fas fa-angle-down ml-auto"
                :class="{ 'fas fa-angle-right': !accordion.open }"
              />
            </b-button>
            <b-collapse
              :id="accordionName(accordion)"
              :key="`${accordionName(accordion)}-collapse`"
              v-model="accordion.open"
            >
              <component
                :is="item.type"
                v-for="(item, index) in getInspectorFields(accordion)"
                :key="index"
                v-bind="item.config"
                v-model="inspection.config[item.field]"
                :data-cy="'inspector-' + (item.field || item.config.name)"
                :field-name="item.field"
                :field-accordion="`accordion-${accordionName(accordion).replace(
                  ' ',
                  ''
                )}`"
                :builder="builder"
                :form-config="config"
                :screen-type="screenType"
                :current-page="currentPage"
                :selected-control="selected"
                class="border-bottom m-0 p-4"
                @focusout.native="updateState"
                @setName="inspection.config.name = $event"
              />
            </b-collapse>
          </template>
        </b-card-body>
      </b-card>
    </b-card>
  </b-col>
</template>

<script>
import _ from "lodash";
import draggable from "vuedraggable";
import { keyNameProperty } from "../../form-control-common-properties";
import VariableNameGenerator from "@/components/VariableNameGenerator";
import { inspectorFields } from "@/mixins";

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
  mixins: [inspectorFields],
  props: {
    accordions: {
      type: Array,
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
    }
  }
};
</script>
