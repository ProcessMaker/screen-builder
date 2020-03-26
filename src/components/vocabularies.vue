<template>
  <div>
    <b-button
      variant="outline"
      v-b-toggle.schema-validator
      class="text-left card-header d-flex align-items-center w-100 shadow-none text-capitalize"
    >
      <i class="fas fa-file-import mr-2"></i>
      {{ $t('JSON Schema') }}
      <i
        class="fas ml-auto"
        :class="showSv ? 'fa-angle-right' : 'fa-angle-down'"
      ></i>
    </b-button>
    <b-collapse id="schema-validator" v-model="showSv">
      <div class="p-2">
        <!-- <b-form-file @change="loadSchema" placeholder="JSON Schema File"></b-form-file> -->
        <b-input-group>
          <b-form-select
            :options="selectOptions"
            v-model="selectedSchemaId"
          ></b-form-select>
        </b-input-group>

        <div
          class="alert mt-2 mb-0"
          v-if="jsonSchema"
          :class="{'alert-success': !jsonSchemaErrors, 'alert-danger': jsonSchemaErrors}"
        >
          <span v-if="!jsonSchemaErrors">{{ $t('Data Valid for JSON Schema') }}</span>
          <div v-else>
            <template v-if="jsonSchemaErrors">
              <span
                v-for="(error, i) of jsonSchemaErrors"
                :key="i"
              >{{ formatDataPath(error) }} {{ error.message }}</span>
            </template>
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>
<script>
import Ajv from 'ajv';

export default {
  props: ['data'],
  data() {
    return {
      vocabularies: [],
      showSv: true,
      jsonSchema: null,
      jsonSchemaErrors: null,
      ajv: new Ajv({ verbose: true }),
      selectedSchemaId: null,
    };
  },
  mounted() {
    this.load();
  },
  computed: {
    selectOptions() {
      return [
        { value: null, text: this.$t("Select a vocabulary to validate with") },
        ...this.vocabularies.map(vocab => {
          return { value: vocab.id, text: vocab.title }
        })
      ];
    },
  },
  watch: {
    selectedSchemaId() {
      const vocab = this.vocabularies.find(v => v.id === this.selectedSchemaId);
      if (vocab) {
        this.jsonSchema = JSON.parse(vocab.content);
      } else {
        this.jsonSchema = null;
      }
    },
    jsonSchema() {
      this.validateJsonSchema();
    },
    data() {
      this.validateJsonSchema();
    }
  },
  methods: {
    formatDataPath(error) {
      if (error.dataPath) {
        return dataPath.replace(/^\./, '');
      }
      return '';
    },
    load() {
      window.ProcessMaker.apiClient.get('/vocabularies')
      .then(result => {
        this.vocabularies = result.data.data;
        // this.jsonSchema = JSON.parse(this.vocabularies[0].content);
      })
    },
    validateJsonSchema() {
      if (this.jsonSchema) {
        try {
          const valid = this.ajv.validate(this.jsonSchema, this.data);
          if (valid) {
            this.jsonSchemaErrors = null;
          } else {
            this.jsonSchemaErrors = this.ajv.errors;
          }
        } catch(error) {
          this.jsonSchemaErrors = [error];
        }
      }
    },
  }
}
</script>