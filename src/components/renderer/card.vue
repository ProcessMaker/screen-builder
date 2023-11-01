<template>
  <div class="m-3 card-request">
    <div v-for="event in emptyStartEvents" :key="event.id" class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div>
            <span v-uni-id="event.id.toString()">{{ transformedName }}</span>
            <span v-if="process.startEvents.length > 1">
              : {{ event.name }}
            </span>
            <a
              href="#"
              :aria-expanded="ariaExpanded"
              :aria-controls="getComputedId(process)"
              @click="showRequestDetails"
            >
              ...
            </a>
          </div>
          <div class="text-right">
            <button
              v-uni-aria-describedby="event.id.toString()"
              :href="getNewRequestLinkHref(process, event)"
              class="btn btn-primary btn-sm"
              @click.prevent="newRequestLink(process, event)"
            >
              <i class="fas fa-caret-square-right mr-1"></i> {{ $t("Start") }}
            </button>
          </div>
        </div>
        <div
          v-if="showdetail"
          :id="getComputedId(process)"
          :aria-hidden="ariaHidden"
        >
          <hr />
          <p class="card-text text-muted">{{ process.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createUniqIdsMixin } from "vue-uniq-ids";

const uniqIdsMixin = createUniqIdsMixin();

export default {
  mixins: [uniqIdsMixin],
  props: ["name", "description", "filter", "id", "process"],
  data() {
    return {
      disabled: false,
      spin: 0,
      showtip: true,
      showdetail: false
    };
  },
  computed: {
    ariaHidden() {
      return this.showdetail ? "false" : "true";
    },
    ariaExpanded() {
      return this.showdetail ? "true" : "false";
    },
    emptyStartEvents() {
      return this.process.startEvents.filter(
        (event) =>
          !event.eventDefinitions || event.eventDefinitions.length === 0
      );
    },
    transformedName() {
      return this.process.name.replace(
        new RegExp(this.filter, "gi"),
        (match) => {
          return match;
        }
      );
    },
    truncatedDescription() {
      if (!this.process.description) {
        return `<span class="text-primary"></span>`;
      }

      let result = "";
      const wordArray = this.process.description.split(" ");

      // Number of maximum characters we want for our description
      const maxLength = 100;
      let word = null;

      while ((word = wordArray.shift())) {
        if (result.length + word.length + 1 <= maxLength) {
          result = `${result} ${word}`;
        }
      }

      return result.replace(new RegExp(this.filter, "gi"), (match) => {
        return `<span class="text-primary"> ${match} </span>`;
      });
    }
  },
  methods: {
    newRequestLink(process, event) {
      if (this.disabled) return;
      this.disabled = true;

      // Start a process
      this.spin = `${process.id}.${event.id}`;
      const startEventId = event.id;

      window.ProcessMaker.apiClient
        .post(`/process_events/${this.process.id}?event=${startEventId}`)
        .then((response) => {
          this.spin = 0;
          const instance = response.data;
          if (this.$cookies.get("isMobile")) {
            window.location = `/requests/mobile/${instance.id}?fromRedirect=true`;
          } else {
            window.location = `/requests/${instance.id}?fromRedirect=true`;
          }
        })
        .catch((err) => {
          this.disabled = false;
          const { data } = err.response;
          if (data.message) {
            ProcessMaker.alert(data.message, "danger");
          }
        });
    },
    showRequestDetails(id) {
      if (this.showdetail === false) {
        this.showdetail = true;
      } else {
        this.showdetail = false;
      }
    },
    getNewRequestLinkHref(process, event) {
      const { id } = process;
      const startEventId = event.id;
      return `/process_events/${id}?event=${startEventId}`;
    },
    getComputedId(process) {
      return `process-${process.id}`;
    }
  }
};
</script>

<style scoped>
.card-request {
  width: 45%;
  min-width: 40%;
  max-width: 50%;
}
</style>
