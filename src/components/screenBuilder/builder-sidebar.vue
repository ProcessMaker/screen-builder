<template>
  <b-col class="overflow-hidden h-100 p-0 controls-column">
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
  </b-col>
</template>

<script>
import _ from "lodash";
import draggable from "vuedraggable";
import { keyNameProperty } from "../../form-control-common-properties";
import VariableNameGenerator from "@/components/VariableNameGenerator";



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
    },
    config: {
      type: Array,
      default: null
    }
  },
  data() {
    const generator = new VariableNameGenerator();
    const variables = generator.GetVariableNames(this.config);
    return {
      filterQuery: "",
      generator,
      variables
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
    }
  }
};
</script>
