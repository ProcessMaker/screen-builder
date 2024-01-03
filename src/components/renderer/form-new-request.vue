<template>
  <div>
    <div v-if="Object.keys(processes).length && !loading" class="process-list">
      <div
        v-for="(category, index) in processes"
        :key="`category-${index}`"
        class="mt-3"
      >
        <b-container fluid>
          <b-card-group>
            <template v-for="(process, id) in category">
              <b-col :key="`process-${id}`" cols="6">
                <ProcessCard
                  v-if="hasEmptyStartEvents(process)"
                  :filter="filter"
                  :process="process"
                />
              </b-col>
            </template>
          </b-card-group>
        </b-container>
      </div>
    </div>
    <div v-else>
      <formEmpty link="" title="No Request to Start" url="" />
    </div>
  </div>
</template>

<script>
import ProcessCard from "./card.vue";
import formEmpty from "./form-empty-table.vue";

export default {
  components: { ProcessCard, formEmpty },
  data() {
    return {
      filter: "",
      loading: false,
      error: false,
      loaded: false,
      processes: {},
      perPage: 10,
      page: 1
    };
  },
  mounted() {
    this.fetch();
    this.$root.$on("dropdownSelectionStart", this.fetchData);
  },
  methods: {
    hasEmptyStartEvents(process) {
      return !!process.events.find(
        (event) =>
          !event.eventDefinitions || event.eventDefinitions.length === 0
      );
    },
    fetch() {
      Vue.nextTick(() => {
        window.ProcessMaker.apiClient
          .get(
            `start_processes?page=${this.page}&per_page=${this.perPage}&filter=${this.filter}&order_by=category.name,name` +
              "&order_direction=asc,asc" +
              "&include=events,categories" +
              "&without_event_definitions=true"
          )
          .then((response) => {
            const { data } = response;
            // Empty processes
            this.processes = {};
            // Now populate our processes array with data for rendering
            this.populate(data.data);
            // Do initial filter
            // Set data in paginate
            data.meta.from -= 1;
            this.$refs.listProcess.data = data;
            this.$refs.listProcess.setPaginationData(data.meta);
            const dataControls = {
              count: "0",
              showControl: true,
              showAvatar: false,
              colorTextStart: "color: #57646F",
              url: ""
            };
            const tasksDropdown = [];
            this.$emit("startControl", { dataControls, tasksDropdown });
          })
          .catch(() => {
            this.error = true;
          });
      });
    },
    populate(data) {
      // Each element in data represents an individual process
      // We need to pull out the category name, and if it's available in our processes, append it there
      // if not, create the category in our processes array and then append it
      for (const process of data) {
        for (const category of process.categories) {
          // Now determine if we have it defined in our processes list
          if (typeof this.processes[category.name] === "undefined") {
            // Create it
            this.processes[category.name] = [];
          }
          // Now append
          this.processes[category.name].push(process);
        }
      }
    },
    fetchData(value) {
      this.filter = value;
      this.fetch();
    }
  }
};
</script>
