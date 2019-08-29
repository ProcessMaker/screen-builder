<template>
  <div class="card" v-if="showOptionCard">
    <div class="card-header pl-2" v-if="optionCardType == 'insert'">
      {{ $t('Add Option') }}
    </div>
    <div v-else class="card-header">
      {{ $t('Edit Option') }}
    </div>
    <div class="card-body p-2">
      <label for="option-value">{{ $t('Value') }}</label>
      <b-form-input id="option-value" v-model="optionValue" :classs="optionKeyClass" />
      <div v-if="optionError" class="invalid-feedback d-block text-right">
        <div>{{ optionError }}</div>
      </div>
      <label class="mt-3" for="option-content">{{ $t('Content') }}</label>
      <b-form-input id="option-content" v-model="optionContent"/>
      <div class="card-footer pr-1 mt-3 text-right">
        <button type="button" class="btn btn-sm btn-outline-secondary mr-3" @click="showOptionCard=false">
          {{ $t('Close') }}
        </button>
        <button type="button" class="btn btn-sm btn-secondary" @click="addOption()">
          {{ $t('Save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['optionValue','optionContent'],
  data() {
  },
  watch: {
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>
