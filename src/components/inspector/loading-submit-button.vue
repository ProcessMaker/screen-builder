<template>
  <div>
    <label class="typo__label">{{ $t("Type") }}</label>
    <multiselect
      v-model="event"
      :placeholder="$t('Select...')"
      :show-labels="false"
      class="mb-3"
      :options="options.map((option) => option.value)"
      :custom-label="getLabelFromValue"
    />
    <small v-if="helper" class="form-text text-muted">{{ $t("Choose whether the button should submit the form") }}</small>

    <div v-if="event === 'submit'">
      <form-checkbox
        :label="$t('Loading Submit Button')"
        v-model="loading"
        :toggle="false"
        :helper="$t('Loading Submit Button')"
      />

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
      options: [
        {
          value: "submit",
          content: "Submit Button"
        },
        {
          value: "script",
          content: "Regular Button"
        }
      ],
      event: 'submit',
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
    loading: {
      get() {
        return this.selectedControl.config.loading;
      },
      set(value) {
        this.selectedControl.config.loading = value;
      },
    },
    mode() {
      return this.$root.$children[0].mode;
    },
  },
  watch: {
    value() {
      if (this.value == undefined) {
        this.loading = false;
        this.loadingLabel = null;
      } else {
        this.event = this.value;
        this.loading = false;
        this.loadingLabel = 'Loading...';
      }
    },
    event() {
      this.$emit('input', this.event);
    },
  },
  methods: {
    getLabelFromValue(value) {
      const selectedOption = this.options.find(
        (option) => option.value == value
      );
      return selectedOption ? selectedOption.content : null;
    },
  }
};
</script>
