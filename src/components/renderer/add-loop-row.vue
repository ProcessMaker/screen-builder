<template>
  <div>
    <b-row class="justify-content-start" v-if="error">
      <b-col md="auto">
        <div class="invalid-feedback d-block">{{ error }}</div>
      </b-col>
    </b-row>

    <b-row class="justify-content-md-center"  v-if="value && config.settings.add">
      <b-col md="auto">
        <b-button size="sm" variant="secondary" class="ml-1 mr-1" @click="add" :title="$t('Add Item')" :data-cy="`loop-${config.name}-add`">
          <i class="fas fa-plus"/>
        </b-button>
        <b-button v-if="value.length > 0" size="sm" variant="outline-danger" class="ml-1 mr-1" @click="removeConfirm" :title="$t('Delete Item')" :data-cy="`loop-${config.name}-remove`">
          <i class="fas fa-minus"/>
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    value: Array,
    config: Object,
    error: String,
  },
  methods: {
    add() {
      this.value.push({});
    },
    remove() {
      const removed = this.value.pop();
      this.$root.$emit('removed-loop', this, removed);
    },
    removeConfirm() {
      const message = this.$t('Are you sure you want to delete this?');
      window.ProcessMaker.confirmModal(
        this.$t('Caution!'),
        message,
        '',
        () => {
          this.remove();
        }
      );
    },
  },
};
</script>
