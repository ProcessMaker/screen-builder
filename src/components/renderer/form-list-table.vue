<template>
  <div class="container mt-4">
    <div class="card">
      <div
        class="card-header d-flex justify-content-between align-items-center"
      >
        <h4>{{ title }}</h4>
        <div>
          <i class="fas fa-search" />
        </div>
      </div>
      <div>
        <vuetable :api-mode="false" :fields="fields" :data="tableData">
        </vuetable>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$t("List Table"),
      fields: [
        {
          name: "created_at",
          title: () => "Created At"
        },
        {
          name: "due_at",
          title: () => "Due At"
        },
        {
          name: "element_name",
          title: () => "Element Name"
        }
      ],
      data: [],
      tableData: []
    };
  },
  created() {
    window.ProcessMaker.EventBus.$on("option-selected", (option) => {
      this.title = option;
      this.populateFields(this.title);
    });
  },
  methods: {
    callAPI(url) {
      try {
        ProcessMaker.apiClient.get(url).then((response) => {
          this.tableData = response.data;
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    populateFields(option) {
      this.fields = [];
      if (option === "My Tasks") {
        this.callAPI("/tasks");
        let field = [
          {
            name: "created_at",
            title: "Created At"
          },
          {
            name: "due_at",
            title: "Due At"
          },
          {
            name: "element_name",
            title: "Element Name"
          }
        ];
        this.fields.push(field);
      }

      if (option === "My Requests") {
        this.callAPI("/requests");
        let field = [
          {
            name: "created_at",
            title: "Created At Request"
          },
          {
            name: "due_at",
            title: "Due At Request"
          },
          {
            name: "element_name",
            title: "Element Name Request"
          }
        ];
        this.fields.push(field);
      }

      if (option === "Start new Request") {
        this.callAPI("/requests");
        let field = [
          {
            name: "created_at",
            title: "Created new Request"
          },
          {
            name: "due_at",
            title: "Due new Request"
          },
          {
            name: "element_name",
            title: "Element new Request"
          }
        ];
        this.fields.push(field);
      }
      /*
        This is needed because fields in vuetable2 are not reactive
        TO-DO: Vuetable component should be imported from CORE to use normalizeFields
        import datatableMixin from "../../components/common/mixins/datatable";
        Uncomment code below when import is done
      */

      // this.$nextTick(() => {
      //   this.$refs.vuetable.normalizeFields();
      // });
    }
  }
};
</script>

<style lang="scss">
.prevent-interaction.form-list-table::after {
  content: attr(placeholder);
}
</style>
