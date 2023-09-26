<template>
  <div v-if="event === 'submit'" style="border: 0">
    <div>
      <form-checkbox
        :label="$t('Loading Submit Button')"
        v-model="loading"
        :toggle="false"
        :helper="$t('Loading Submit Button')"
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
      loading: false,
    };
  },
  computed: {
    mode() {
      return this.$root.$children[0].mode;
    },
  },
  watch: {
    loading() {
      this.$emit('input', this.loading);
    },
    value() {
      if (typeof(this.value) === "undefined") {
        this.loading = false;
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
