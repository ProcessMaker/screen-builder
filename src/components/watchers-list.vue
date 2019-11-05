<template>
  <div>
    <b-row class="mb-2">
      <b-col sm="8">
        Filter
      </b-col>
      <b-col sm="4" class="text-right">
        <b-btn size="sm" variant="secondary" @click.stop="displayFormProperty">
          <i class="fas fa-plus" />
          {{ $t('Watcher') }}
        </b-btn>
      </b-col>
    </b-row>

    <b-table :items="value" :fields="fields" responsive striped bordered small hover fixed>
      <template slot="HEAD_property" slot-scope="data">{{ $t(data.label) }}</template>
      <template slot="HEAD_actions" slot-scope="data">{{ $t(data.label) }}</template>

      <template slot="actions" slot-scope="row">
        <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
        <a
          variant="action"
          @click.stop="row.toggleDetails"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          :title="$t('Details')"
        >
          <i class="fa fa-list-alt fa-1x" />
        </a>
        <a
          size="lg"
          variant="action"
          :title="$t('edit')"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          @click.stop="editProperty(row.item)"
        >
          <i class="fa fa-edit fa-1x" />
        </a>
        <a
          size="lg"
          variant="action"
          :title="$t('Delete')"
          class="btn btn-lg p-0 mr-2 border-0 bg-transparent"
          @click.stop="deleteProperty(row.item)"
        >
          <i class="fa fa-trash fa-1x" />
        </a>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row class="mb-1">
            <b-col sm="3" class="text-sm-right">
              <b>{{ $t('Field:') }}</b>
            </b-col>
            <b-col>{{ $t(row.item.property) }}</b-col>
          </b-row>
          <b-row class="mb-1">
            <b-col sm="3" class="text-sm-right">
              <b>{{ $t('Formula:') }}</b>
            </b-col>
            <b-col>{{ $t(row.item.formula) }}</b-col>
          </b-row>
          <b-button
            class="float-right"
            size="sm"
            @click="row.toggleDetails"
          >{{ $t('Hide Details') }}</b-button>
        </b-card>
      </template>
    </b-table>
    <template slot="modal-footer">
      <span />
    </template>
  </div>
</template>

<script>
import { FormInput, FormTextArea } from '@processmaker/vue-form-elements';

export default {
  components: {
    FormInput,
    FormTextArea,
  },
  props: ['value'],
  data() {
    return {
      fields: [
        {
          key: 'name',
          label: 'Name',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'watching',
          label: 'Watching',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'variable',
          label: 'Variable',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'script',
          label: 'Script',
          class: 'text-center',
          sortable: true,
        },
        {
          key: 'actions',
          label: '',
          class: 'text-center',
          sortable: false,
        },
      ],
    };
  },
  methods: {
    displayFormProperty() {
      this.$emit('display-form');
    },
  },
};
</script>
