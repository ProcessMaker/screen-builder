<template>
  
  <div>
    <div class="form-group">
      <b-form-checkbox
        v-model="settings.encrypted"
        @change="emitChanges"
        switch
      >
        {{ $t("Encrypted") }}
      </b-form-checkbox>

      <div v-if="settings.encrypted">
        <select-user-group
          :key="componentKey"
          :label="$t('Users/Groups to View')"
          v-model="settings.assignments"
          :multiple="true"
          @input="emitChanges"
        />
      </div>
  </div>
</div>

</template>

<script>
import SelectUserGroup from '../../components/SelectUserGroup.vue';

export default {
  components: { SelectUserGroup },
  props: {
    label: String,
    value: {
      type: Object,
      default: () => {
        return {
          encrypted: false,
          assignments: {users: [], groups: []},
        };
      }
    },
    helper: String,
  },
  data() {
    return {
      componentKey: 0,
      settings:{
        encrypted: false,
        assignments: {users: [], groups: []},
      },
    };
  },
  watch: {
    value: {
      handler() {
        this.settings = this.value;
        if (this.value.encrypted) {
          // Force to redraw component
          this.componentKey += 1;
        }
      },
      immediate: true,
    },
  },
  methods: {
    emitChanges() {
      if (!this.settings.encrypted) {
        this.settings.assignments = {users: [], groups: []};
      }
      this.$emit("input", this.settings);
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
