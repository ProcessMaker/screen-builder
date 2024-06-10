<template>
  <div class="flex-grow-1 d-flex flex-row-reverse">
    <b-button-group size="sm" class="bg-white p-2 screen-toolbar">
      <b-button
        class="screen-toolbar-button"
        variant="link"
        :disabled="!canUndo"
        data-cy="toolbar-undo"
        @click="$emit('undo')"
      >
        <i class="fas fa-undo" />
        {{ $t("Undo") }}
      </b-button>
      <b-button
        class="screen-toolbar-button"
        variant="link"
        :disabled="!canRedo"
        data-cy="toolbar-redo"
        @click="$emit('redo')"
      >
        <i class="fas fa-redo" />
        {{ $t("Redo") }}
      </b-button>
      <b-button
        type="button"
        class="screen-toolbar-button"
        variant="link"
        :title="$t('Calculated Properties')"
        data-cy="topbar-calcs"
        @click="$emit('open-calc')"
      >
        <i class="fas fa-flask" />
        {{ $t("Calcs") }}
      </b-button>
      <b-button
        type="button"
        class="screen-toolbar-button"
        variant="link"
        :title="$t('Custom CSS')"
        data-cy="topbar-css"
        @click="$emit('open-customCss')"
      >
        <i class="fab fa-css3" />
        {{ $t("CSS") }}
      </b-button>
      <b-button
        type="button"
        class="screen-toolbar-button"
        variant="link"
        :title="$t('Watchers')"
        data-cy="topbar-watchers"
        @click="$emit('open-watchers')"
      >
        <i class="fas fa-mask" />
        {{ $t("Watchers") }}
      </b-button>
      <b-dropdown
        type="button"
        class="screen-toolbar-button"
        variant="outlined-secondary"
        :popper-opts="{ placement: 'bottom-end' }"
        data-cy="topbar-options"
      >
        <template v-slot:button-content>
          <span class="screen-toolbar-button">
            <i class="fas fa-cog" />
            {{ $t("Options") }}
          </span>
        </template>
        <template v-slot:default>
          <slot />
        </template>
      </b-dropdown>
    </b-button-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showToolbar: true
    };
  },
  computed: {
    canUndo() {
      return this.$store.getters["undoRedoModule/canUndo"];
    },
    canRedo() {
      return this.$store.getters["undoRedoModule/canRedo"];
    },
  }
};
</script>

<style scoped>
.screen-toolbar-button {
  color: #556271;
}
</style>
