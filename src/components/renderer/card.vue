<template>
  <div>
    <template v-for="event in emptyStartEvents">
      <div :key="event.id" class="mb-3 card-request">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div>
              <span v-uni-id="event.id.toString()" class="card-info card-title">
                {{ transformedName }}
              </span>
              <span class="card-info">
                {{ event.name }}
              </span>
            </div>
            <div class="d-flex align-items-center">
              <button
                :aria-expanded="ariaExpanded"
                :aria-controls="getComputedId(process, event)"
                class="btn btn-ellipsis btn-sm mr-1"
                @click="showRequestDetails(process, event)"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <button
                v-uni-aria-describedby="event.id.toString()"
                :href="getNewRequestLinkHref(process, event)"
                class="btn btn-custom btn-sm"
                @click.prevent="newRequestLink(process, event)"
              >
                {{ $t("Start") }}
                <i class="fas fa-play mr-1 card-icon"></i>
              </button>
            </div>
          </div>
          <b-collapse
            :id="getComputedId(process, event)"
            :aria-hidden="ariaHidden"
          >
            <hr />
            <p class="card-text text-muted card-description">
              {{ process.description }}
            </p>
          </b-collapse>
        </div>
      </div>
    </template>
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
          this.$cookies.set("fromTriggerStartEvent", true, "1min");
          window.location = `/requests/${instance.id}?fromTriggerStartEvent=`;
        })
        .catch((err) => {
          this.disabled = false;
          const { data } = err.response;
          if (data.message) {
            ProcessMaker.alert(data.message, "danger");
          }
        });
    },
    showRequestDetails(process, event) {
      if (this.showdetail === false) {
        this.showdetail = true;
      } else {
        this.showdetail = false;
      }
      this.$root.$emit(
        "bv::toggle::collapse",
        this.getComputedId(process, event)
      );
    },
    getNewRequestLinkHref(process, event) {
      const { id } = process;
      const startEventId = event.id;
      return `/process_events/${id}?event=${startEventId}`;
    },
    getComputedId(process, event) {
      return `process-${process.id}-${event.id}`;
    }
  }
};
</script>

<style scoped>
.btn-custom {
  border-radius: 4px;
  border: 1px solid #eceff3;
  background: #e8f0f9;
  display: flex;
  height: 28px;
  padding: 4px 9px;
  justify-content: center;
  align-items: inherit;
  gap: 6px;
  color: #1572c2;
  font-size: 14px;
  font-weight: 600;
}
.btn-ellipsis {
  background: #fff;
  height: 28px;
  justify-content: center;
  align-items: center;
  color: #1572c2;
  font-size: 14px;
}
.btn-ellipsis:hover {
  border-radius: 4px;
  background: #e8f0f9;
}
.card-request {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  border: 1px solid #cdddee;
  background: #fff;
}
.card-info {
  -webkit-line-clamp: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-description {
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-title {
  font-weight: 700;
}
.card-icon {
  display: flex;
  padding: 2px 1px 0px 0px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 7px;
}
</style>
