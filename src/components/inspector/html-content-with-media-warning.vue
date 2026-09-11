<template>
  <div class="form-group mb-0">
    <label v-if="label">{{ $t(label) }}</label>
    <textarea
      class="form-control"
      :rows="rows"
      :value="value"
      data-cy="inspector-content"
      @input="$emit('input', $event.target.value)"
    />
    <small v-if="helper" class="form-text text-muted">{{ $t(helper) }}</small>
    <div
      v-if="hasInlineBase64Images"
      class="alert alert-warning mt-2 mb-0 py-2 px-3"
      role="status"
      data-cy="inspector-content-base64-warning"
    >
      <i class="fas fa-exclamation-triangle mr-1" aria-hidden="true" />
      {{ warningMessage }}
    </div>
  </div>
</template>

<script>
const DATA_IMAGE_PATTERN = /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/;

export default {
  name: "HtmlContentWithMediaWarning",
  props: {
    value: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Content",
    },
    helper: {
      type: String,
      default: "",
    },
    rows: {
      type: [Number, String],
      default: 5,
    },
  },
  computed: {
    hasInlineBase64Images() {
      return DATA_IMAGE_PATTERN.test(this.value || "");
    },
    inlineImageCount() {
      const matches = (this.value || "").match(
        /data:image\/[a-zA-Z0-9+.-]+;base64,[A-Za-z0-9+/=]+/g,
      );
      return matches ? matches.length : 0;
    },
    warningMessage() {
      if (this.inlineImageCount === 1) {
        return this.$t(
          "A base64 image was detected. On save it will be stored as a media file and replaced with a URL.",
        );
      }
      return this.$t(
        "Base64 images were detected ({{count}}). On save they will be stored as media files and replaced with URLs.",
        { count: this.inlineImageCount },
      );
    },
  },
};
</script>
