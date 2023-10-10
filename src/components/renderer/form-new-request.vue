<template>
  <div>
    <div v-if="Object.keys(processes).length && !loading" class="process-list">
      <div
        v-for="(category, index) in processes"
        :key="`category-${index}`"
        class="mt-3"
      >
        <!--
        <h5 class="mb-n2">
          {{ index }}
          <span class="badge badge-pill badge-secondary">
            {{ category.length }}
          </span>
        </h5>
        -->
        <b-container fluid>
          <b-card-group>
            <template v-for="(process, id) in category">
              <ProcessCard
                v-if="hasEmptyStartEvents(process)"
                :key="`process-${id}`"
                :filter="filter"
                :process="process"
              />
            </template>
          </b-card-group>
        </b-container>
      </div>
    </div>
  </div>
</template>

<script>
import ProcessCard from "./card.vue";

export default {
  components: { ProcessCard },
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
  },
  methods: {
    hasEmptyStartEvents(process) {
      return !!process.events.find(
        (event) =>
          !event.eventDefinitions || event.eventDefinitions.length === 0
      );
    },
    fetch() {
      // Now call our api
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
        })
        .catch(() => {
          this.error = true;
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
    }
  }
};
</script>
