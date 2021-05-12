<template>
  <div>
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

    <form-text-area
      v-model="content"
      :label="$t('Tooltip Contains')"
      class="mb-3"
      data-cy="content-tooltip"
    />
    <small class="form-text text-muted">{{
      $t("HTML, Mustache support")
    }}</small>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  inheritAttrs: false,
  components: {
    Multiselect,
  },
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
      position: 'top',
      content: '',
    };
  },
  watch: {
    value: {
      handler() {
        if (this.value) {
          this.position = this.value.position || '';
          this.content = this.value.content || '';
        } else {
          this.value = {
            position: '',
            content: '',
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
  },
  methods: {
    getLabelFromValuePosition(value) {
      const selectedOption = this.options.find(
        (option) => option.value == value
      );
      return selectedOption ? selectedOption.content : null;
    },
  },
};
</script>
