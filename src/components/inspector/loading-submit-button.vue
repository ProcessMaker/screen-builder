<template>
  <div v-if="event === 'submit'" style="border-style: none !important;">
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
      loading: null
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
      this.loading = this.value;
    },
    "selectedControl.config.event": function (newVal) {
      this.event = newVal;
    }
  },
  mounted() {
    this.event = this.selectedControl.config.event;
    this.loading = this.value;
  }
};
</script>
