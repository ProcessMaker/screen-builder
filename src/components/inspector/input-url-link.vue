<template>
  <div>
    <div v-if="event === 'link'" style="padding-top: 0px">
      <form-input
        v-model="linkUrl"
        type="text"
        class="mb-3"
        :label="$t('URL Link')"
        :helper="$t('Type here the URL link. Mustache syntax is supported.')"
      />
    </div>
  </div>
</template>

<script>
import { FormInput } from "@processmaker/vue-form-elements";

export default {
  components: {
    FormInput
  },
  props: ["value", "selectedControl"],
  data() {
    return {
      event: "",
      linkUrl: "button"
    };
  },
  computed: {
    mode() {
      return this.$root.$children[0].mode;
    }
  },
  watch: {
    linkUrl() {
      this.$emit("input", this.linkUrl);
    },
    value() {
      this.linkUrl = this.value;
    },
    "selectedControl.config.event": function (newVal) {
      this.event = newVal;
    }
  },
  mounted() {
    this.event = this.selectedControl.config.event;
    this.linkUrl = this.value;
  }
};
</script>
