<template>
  <div>
    <button
      v-b-toggle="`collapse-${config.name || config.label}`"
      class="accordion-button text-left card-header d-flex align-items-center w-100 pl-3"
      :id="`accordion-button-${config.name || config.label}`"
      >
        <i
          v-if="config.icon"
          class="fas mr-1 fa-fw"
          :class="`fa-${config.icon}`"
        />

        <span class="ml-1 mr-auto">{{ config.label }}</span>

        <i class="when-opened fas fa-chevron-down accordion-arrow ml-auto" />
        <i class="when-closed fas fa-chevron-right accordion-arrow ml-auto" />
    </button>

    <b-collapse
      :visible="initiallyOpen"
      :id="`collapse-${config.name || config.label}`"
      :accordion="`accordion-${config.name}`"
    >
      <div v-for="element in items" :key="element.config.name">
        <component
          v-bind="element.config"
          :is="element.component"
          v-model="transientData[element.config.name]"
          class="pl-3 pr-3 pt-2 pb-2 border-bottom m-0"
        />
      </div>
    </b-collapse>
  </div>
</template>

<script>
export default {
  props: ['transientData', 'value', 'name', 'config', 'selected'],
  data() {
    return {
      initiallyOpen: Boolean(this.config.initiallyOpen),
      items: [],
    }
  },
  watch: {
    value: {
      handler() {
        this.items = this.value;
      },
      immediate: true,
    },
    items() {
      this.$emit('input', this.items);
    },
  },
}
</script>

<style scoped lang="scss">
.accordion-button {
  cursor: pointer;
  outline: none;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}

.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
</style>
