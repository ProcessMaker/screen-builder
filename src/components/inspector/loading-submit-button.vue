<template>
  <div v-if="event === 'submit'" style="border-style: none !important">
    <div>
      <form-checkbox
        v-model="loading"
        :label="$t('Loading Submit Button')"
        :toggle="false"
        :helper="$t('Loading Submit Button')"
      />
    </div>
  </div>
</template>

<script>
import { FormCheckbox } from "@processmaker/vue-form-elements";

export default {
  components: { FormCheckbox },
  props: ["value", "selectedControl"],
  data() {
    return {
      event: "",
      loading: null
    };
  },
  computed: {
    mode() {
      return this.$root.$children[0].mode;
    }
  },
  watch: {
    loading() {
      this.$emit("input", this.loading);
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
