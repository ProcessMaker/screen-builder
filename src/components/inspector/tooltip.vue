<template>
  <div v-if="buttonType !== 'submit'">
    <label class="typo__label">{{ label }}</label>
    <br >
    <label class="typo__label">{{ $t("Position") }}</label>
    <multiselect
      v-model="position"
      :placeholder="$t('Select...')"
      :show-labels="false"
      class="mb-3"
      :options="options.map((option) => option.value)"
      :custom-label="getLabelFromValuePosition"
    />
    <label class="typo__label">{{ $t("Variant") }}</label>
    <multiselect
      v-model="variant"
      :placeholder="$t('Select...')"
      :show-labels="false"
      class="mb-3"
      :options="optionsVariant.map((option) => option.value)"
      :custom-label="getLabelFromValueVariant"
    />

    <form-text-area
      v-model="content"
      :label="$t('Tooltip Contains')"
      class="mb-3"
      data-cy="content-tooltip"
    />
    <small class="form-text text-muted">
      {{ $t("HTML, Mustache support") }}
    </small>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  inheritAttrs: false,
  props: ['label', 'value', 'helper'],
  data() {
    return {
      options: [
        {
          value: 'top',
          content: this.$t('Top'),
        },
        {
          value: 'topleft',
          content: this.$t('Top Left'),
        },
        {
          value: 'topright',
          content: this.$t('Top Right'),
        },
        {
          value: 'right',
          content: this.$t('Right'),
        },
        {
          value: 'righttop',
          content: this.$t('Right Top'),
        },
        {
          value: 'rightbottom',
          content: this.$t('Right Bottom'),
        },
        {
          value: 'bottom',
          content: this.$t('Bottom'),
        },
        {
          value: 'bottomleft',
          content: this.$t('Bottom Left'),
        },
        {
          value: 'bottomright',
          content: this.$t('Bottom Right'),
        },
        {
          value: 'left',
          content: this.$t('Left'),
        },
        {
          value: 'lefttop',
          content: this.$t('Left Top'),
        },
        {
          value: 'leftbottom',
          content: this.$t('Left Bottom'),
        },
      ],
      optionsVariant: [
        {
          value: 'primary',
          content: this.$t('Primary'),
        },
        {
          value: 'secondary',
          content: this.$t('Secondary'),
        },
        {
          value: 'success',
          content: this.$t('Success'),
        },
        {
          value: 'danger',
          content: this.$t('Danger'),
        },
        {
          value: 'warning',
          content: this.$t('Warning'),
        },
        {
          value: 'info',
          content: this.$t('Info'),
        },
        {
          value: 'light',
          content: this.$t('Light'),
        },
        {
          value: 'dark',
          content: this.$t('Dark'),
        },
      ],
      position: 'top',
      content: '',
      variant: '',
    };
  },
  computed: {
    buttonType() {
      return _.get(this.$attrs, 'selectedControl.config.event');
    },
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.position = this.value.position || '';
          this.content = this.value.content || '';
          this.variant = this.value.variant || '';
        } else {
          this.value = {
            position: '',
            content: '',
            variant: '',
          };
        }
      },
      immediate: true,
    },
    position() {
      this.value.position = this.position;
    },
    content() {
      this.value.content = this.content;
    },
    variant() {
      this.value.variant = this.variant;
    },
  },
  methods: {
    getLabelFromValuePosition(value) {
      const selectedOption = this.options.find(
        (option) => option.value == value
      );
      return selectedOption ? selectedOption.content : null;
    },
    getLabelFromValueVariant(value) {
      const selectedOption = this.optionsVariant.find(
        (option) => option.value == value
      );
      return selectedOption ? selectedOption.content : null;
    },
  },
};
</script>
