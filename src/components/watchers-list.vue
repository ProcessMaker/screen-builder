<template>
  <div>
    <b-row class="mb-3">
      <b-col>
        <basic-search v-model="filter" @submit="search">
          <template slot="buttons">
            <b-btn
              class="text-nowrap"
              variant="secondary"
              data-cy="watchers-add-watcher"
              @click.stop="displayFormProperty"
            >
              <i class="fas fa-plus" />
              {{ $t("Watcher") }}
            </b-btn>
          </template>
        </basic-search>
      </b-col>
    </b-row>

    <div class="card card-body table-card watchers-list">
      <b-table
        :items="filtered"
        :fields="fields"
        :empty-text="$t('No Data Available')"
        data-cy="watchers-table"
        sort-icon-left
      >
        <template #cell(actions)="{ item }">
          <div class="actions">
            <div class="popout">
              <b-btn
                v-b-tooltip.hover
                variant="link"
                :title="$t('Edit')"
                data-cy="watchers-table-edit"
                @click="editProperty(item)"
              >
                <i class="fas fa-edit fa-lg fa-fw" />
              </b-btn>
              <b-btn
                v-b-tooltip.hover
                variant="link"
                :title="$t('Delete')"
                data-cy="watchers-table-remove"
                @click="deleteProperty(item)"
              >
                <i class="fas fa-trash-alt fa-lg fa-fw" />
              </b-btn>
            </div>
          </div>
        </template>
      </b-table>
    </div>
    <template slot="modal-footer">
      <span />
    </template>
  </div>
</template>

<script>
import { FormInput, FormTextArea } from "@processmaker/vue-form-elements";
import BasicSearch from "./basic-search.vue";

export default {
  components: {
    BasicSearch,
    FormInput,
    FormTextArea
  },
  props: {
    value: {
      type: Array,
      /* istanbul ignore next */
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      filter: "",
      css: {
        tableClass: "table table-hover table-responsive text-break mb-0",
        loadingClass: "loading",
        detailRowClass: "vuetable-detail-row",
        handleIcon: "grey sidebar icon",
        sortableIcon: "fas fa-sort",
        ascendingIcon: "fas fa-sort-up",
        descendingIcon: "fas fa-sort-down",
        ascendingClass: "ascending",
        descendingClass: "descending"
      },
      fields: [
        {
          label: this.$t("Name"),
          key: "name",
          tdClass: "break-word"
        },
        {
          label: this.$t("Watching Variable"),
          key: "watching"
        },
        {
          label: this.$t("Output Variable"),
          key: "output_variable",
          tdClass: "break-word"
        },
        {
          label: this.$t("Source"),
          key: "script.title"
        },
        {
          key: "actions",
          label: ""
        }
      ]
    };
  },
  computed: {
    filtered() {
      const list = this.getValuesWithOutputVarsNames(this.value);

      if (!this.filter) {
        return list;
      }
      const filtered = [];
      list.forEach((item) => {
        if (
          Object.keys(item).find((key) =>
            typeof item[key] === "string"
              ? item[key].indexOf(this.filter) >= 0
              : false
          )
        ) {
          filtered.push(item);
        }
      });
      return filtered;
    }
  },
  methods: {
    search() {},
    displayFormProperty() {
      this.$emit("display-form");
    },
    editProperty(item) {
      this.$emit("edit-form", item);
    },
    deleteProperty(item) {
      this.$emit("delete-form", item);
    },
    getValuesWithOutputVarsNames(values) {
      const list = values.map((watcher) => {
        const newItem = { ...watcher };
        // If watcher is a data source, extract the output vars
        if (
          newItem.script &&
          newItem.script.id &&
          newItem.script.id.substr(0, 11) === "data_source"
        ) {
          const scriptConfig = JSON.parse(newItem.script_configuration);
          const vars =
            scriptConfig && scriptConfig.dataMapping
              ? scriptConfig.dataMapping
                  .map((mapping) => mapping.key)
                  .join(", ")
              : "";

          // var names string won't have more than 50 characters to avoid distorting the UI
          const maxLen = 50;
          newItem.output_variable =
            vars.length > maxLen ? `${vars.substr(0, maxLen)}...` : vars;
        }
        return newItem;
      });
      return list;
    }
  }
};
</script>

<style>
.watchers-list .break-word {
  word-break: break-word;
}

.watchers-list .table {
  margin-bottom: 0;
}
</style>
