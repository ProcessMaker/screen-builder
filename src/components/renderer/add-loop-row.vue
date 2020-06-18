<template>
  <b-row class="justify-content-md-center" v-if="value && config.settings.add">
    <b-col md="auto">
      <b-button size="sm" variant="secondary" class="ml-1 mr-1" @click="add" :title="$t('Add Item')">
        <i class="fas fa-plus"/>
      </b-button>
      <b-button v-if="value.length > 0" size="sm" variant="outline-danger" class="ml-1 mr-1" @click="removeConfirm" :title="$t('Delete Item')">
        <i class="fas fa-minus"/>
      </b-button>
    </b-col>
  </b-row>
</template>

<script>
import _ from 'lodash';

export default {
  props: {
    value: Array,
    config: Object,
  },
  methods: {
    add() {
      this.value.push({});
    },
    remove() {
      this.value.pop();
    },
    removeConfirm() {
      const message = this.$t('Are you sure you want to delete this?');
      if (_.has(window, 'ProcessMaker.confirmModal')) {
        window.ProcessMaker.confirmModal(
          this.$t('Caution!'),
          message,
          '',
          () => {
            this.remove();
          }
        );
      } else if (_.has(window, 'confirm')) {
        if (window.confirm(message)) {
          this.remove();
        }
      } else {
        this.remove();
      }
    },
  },
};
</script>
