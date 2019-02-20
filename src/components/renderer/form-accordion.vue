<template>
  <div class="form-accordtion-container">
    <button @click="showCollapse = !showCollapse" class="accordion-button">
      <i
        v-if="config.icon"
        class="fas"
        :class="`fa-${config.icon}`"
      />

      <span class="button-label">{{ config.label }}</span>

      <i
        class="fas fa-caret-right accordion-arrow"
        :class="{ opened: showCollapse }"
      />
    </button>

    <div class="accordion-wrapper">
      <b-collapse
        v-model="showCollapse"
        :id="'collapse-' + config.name"
        class="accordion"
      >
        <div v-for="element in items" :key="element.config.name">
          <component
            :class="elementCssClass(element)"
            v-bind="element.config"
            :is="element.component"
            v-model="transientData[element.config.name]"
          />
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import MultiColumn from '../editor/multi-column';

export default {
  extends: MultiColumn,
  props: ['transientData'],
  name: 'form-accordion',
  data() {
    return {
      showCollapse: Boolean(this.config.initiallyOpen),
    }
  },
}
</script>

<style scoped lang="scss">
.form-accordtion-container {
  padding-bottom: 0.25rem;

  .accordion-button {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0.25rem;

    .button-label {
      margin-right: auto;
      margin-left: 1rem;
    }

    .accordion-arrow {
      transition: all 200ms;

      &.opened {
        transform: rotate(90deg);
      }
    }
  }

  .accordion-wrapper {
    border-bottom: 1px solid #aaa;
    padding-top: 0.5rem;
  }
}
</style>
