<template>
  <div v-if="event === 'submit'" style="padding-top: 0px !important;">
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
import { FormInput } from '@processmaker/vue-form-elements';

export default {
  components: {
    FormInput
  },
  props: ['value', 'selectedControl'],
  data() {
    return {
      event: "",
      loadingLabel: null
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
      this.loadingLabel = this.value;
    },
    "selectedControl.config.event": function (newVal) {
      this.event = newVal;
    }
  },
  mounted() {
    this.event = this.selectedControl.config.event;
    this.loadingLabel = this.value;
  }
};
</script>
