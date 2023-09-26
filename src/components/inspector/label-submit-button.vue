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
    props: ['value', 'selectedControl'],
    data() {
      return {
        event: "",
        loadingLabel: "Loading...",
      };
    },
    computed: {
      mode() {
        return this.$root.$children[0].mode;
      },
    },
    watch: {
      loadingLabel() {
        this.$emit('input', this.loadingLabel);
      },
      value() {
        if (typeof(this.value) === "undefined") {
        this.loadingLabel = "Loading...";
      }
      },
      "selectedControl.config.event": function (newVal) {
        this.event = newVal;
      }
    },
    mounted() {
      this.event = this.selectedControl.config.event;
    }
  };
  </script>
  