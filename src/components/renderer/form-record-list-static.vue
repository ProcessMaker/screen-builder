<template>
  <div class="record-list">
    <h4>{{ $t(label) }}</h4>
    <table>
      <thead>
        <tr>
          <th v-for="(field, index) in fields" :key="index">
            {{ field.content }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(val, index) in value" :key="index">
          <td v-for="(field, index) in fields" :key="index">
            {{ formatIfDate(mustache(field.value, val)) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import mustacheEvaluation from '../../mixins/mustacheEvaluation';
import { dateUtils } from '@processmaker/vue-form-elements';

export default {
  name: 'FormRecordListStatic',
  mixins: [mustacheEvaluation],
  props: ['label', 'fields', 'value', 'editable', '_config', 'form'],
  components: {
  },
  mounted() {
  },
  data() {
    return {
    };
  },
  methods: {
    formatIfDate(string) {
      return dateUtils.formatIfDate(string);
    },
  },
};
</script>
