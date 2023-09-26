<template>
    <div v-if="event === 'submit'" style="border: 0">
    <div>
        <form-input
          v-model="loadingLabel"
          type="text"
          class="mb-3"
          :label="$t('Loading Label')"
        />
    </div>
  </div>
</template>
  
<script>
export default {
  props: ["value", "selectedControl"],
  data() {
    return {
      event: "",
    };
  },
  computed: {
    loadingLabel: {
      get() {
        return this.selectedControl.config.loadingLabel;
      },
      set(value) {
        this.selectedControl.config.loadingLabel = value;
      },
    },
    mode() {
      return this.$root.$children[0].mode;
    },
  },
  watch: {
    "selectedControl.config.loadingLabel": function (newVal) {
      this.loadingLabel = newVal;
    }
  },
  mounted() {
    this.event = this.selectedControl.config.event;
  }
};
</script>
