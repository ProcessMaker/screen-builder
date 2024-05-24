<template>
  <div>
    <div v-if="Object.keys(processes).length && !loading" class="process-list">
      <b-container fluid>
        <div v-for="(process, index) in processes" :key="`process-${index}`">
          <ProcessCard
            v-if="hasEmptyStartEvents(process)"
            :filter="filter"
            :process="process"
          />
        </div>
      </b-container>
    </div>
    <div v-else>
      <formEmpty link="" title="No Case to Start" url="" />
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
              "&include=events" +
              "&without_event_definitions=true"
          )
          .then((response) => {
            const { data } = response;
            this.processes = data.data;
          })
          .catch(() => {
            this.error = true;
          });
      });
    },
    fetchData(value) {
      this.filter = value;
      this.fetch();
    }
  }
};
</script>
