<template>
  <b-modal
    ref="modal"
    size="lg"
    id="watchers-synchronous"
    title=""
    hide-header
    no-close-on-esc
    hide-header-close
    no-close-on-backdrop
  >
    <div class="container text-center" v-if="display === 'running'">
      <div class="icon-container m-4">
        <svg class="lds-gear" width="50%" height="50%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <g transform="translate(50 50)">
            <g transform="rotate(248.825)">
              <animateTransform attributeName="transform" type="rotate" values="0;360" keyTimes="0;1" dur="4.7s" repeatCount="indefinite"/>
              <path d="M37.43995192304605 -6.5 L47.43995192304605 -6.5 L47.43995192304605 6.5 L37.43995192304605 6.5 A38 38 0 0 1 35.67394948182593 13.090810836924174 L35.67394948182593 13.090810836924174 L44.33420351967032 18.090810836924174 L37.83420351967032 29.34914108612188 L29.17394948182593 24.34914108612188 A38 38 0 0 1 24.34914108612188 29.17394948182593 L24.34914108612188 29.17394948182593 L29.34914108612188 37.83420351967032 L18.090810836924184 44.33420351967032 L13.090810836924183 35.67394948182593 A38 38 0 0 1 6.5 37.43995192304605 L6.5 37.43995192304605 L6.500000000000001 47.43995192304605 L-6.499999999999995 47.43995192304606 L-6.499999999999996 37.43995192304606 A38 38 0 0 1 -13.09081083692417 35.67394948182593 L-13.09081083692417 35.67394948182593 L-18.09081083692417 44.33420351967032 L-29.34914108612187 37.834203519670325 L-24.349141086121872 29.173949481825936 A38 38 0 0 1 -29.17394948182592 24.34914108612189 L-29.17394948182592 24.34914108612189 L-37.83420351967031 29.349141086121893 L-44.33420351967031 18.0908108369242 L-35.67394948182592 13.090810836924193 A38 38 0 0 1 -37.43995192304605 6.5000000000000036 L-37.43995192304605 6.5000000000000036 L-47.43995192304605 6.500000000000004 L-47.43995192304606 -6.499999999999993 L-37.43995192304606 -6.499999999999994 A38 38 0 0 1 -35.67394948182593 -13.090810836924167 L-35.67394948182593 -13.090810836924167 L-44.33420351967032 -18.090810836924163 L-37.834203519670325 -29.34914108612187 L-29.173949481825936 -24.34914108612187 A38 38 0 0 1 -24.349141086121893 -29.17394948182592 L-24.349141086121893 -29.17394948182592 L-29.349141086121897 -37.834203519670304 L-18.0908108369242 -44.334203519670304 L-13.090810836924195 -35.67394948182592 A38 38 0 0 1 -6.500000000000005 -37.43995192304605 L-6.500000000000005 -37.43995192304605 L-6.500000000000007 -47.43995192304605 L6.49999999999999 -47.43995192304606 L6.499999999999992 -37.43995192304606 A38 38 0 0 1 13.090810836924149 -35.67394948182594 L13.090810836924149 -35.67394948182594 L18.090810836924142 -44.33420351967033 L29.349141086121847 -37.83420351967034 L24.349141086121854 -29.17394948182595 A38 38 0 0 1 29.17394948182592 -24.349141086121893 L29.17394948182592 -24.349141086121893 L37.834203519670304 -29.349141086121897 L44.334203519670304 -18.0908108369242 L35.67394948182592 -13.090810836924197 A38 38 0 0 1 37.43995192304605 -6.500000000000007 M0 -20A20 20 0 1 0 0 20 A20 20 0 1 0 0 -20"/>
            </g>
          </g>
        </svg>
      </div>
      <h3 class="display-6">{{ message }}</h3>
      <p class="lead">{{ $t('This window will automatically close when complete.') }}</p>
    </div>

    <div class="container text-center" v-else>
      <div class="icon-container m-4">
        <i class="fas fa-sad-tear fa-10x"/>
      </div>
      <h3 class="display-6">{{ $t('Something has gone wrong.') }}</h3>
      <p class="lead">{{ $t("Unfortunately this screen has had an issue. We've notified the administrator.") }} <a href="javascript:void(0)" @click="showMessage=!showMessage" data-cy="watchers-show-error-message"><i class="fas fa-info-circle"/></a></p>
      <small v-if="showMessage" class="text-danger text-left small">{{ errorMessage }}</small>
    </div>

    <div slot="modal-footer" class="w-100 text-right">
      <button type="button" class="btn btn-outline-secondary" @click="hide(-1)" v-if="display === 'error'">{{ $t('Close') }}</button>
    </div>

  </b-modal>
</template>

<script>

export default {
  props: ['value'],
  data() {
    return {
      display:'running',
      errorMessage: '',
      showMessage: false,
      variables: [],
    };
  },
  computed: {
    message() {
      return this.$t('{{variable}} running.', {variable: this.variables.join(', ')});
    },
  },
  methods: {
    error(message) {
      this.display = 'error';
      this.errorMessage = message;
    },
    show(variableName) {
      (this.variables.indexOf(variableName) === -1) ? this.variables.push(variableName) : null;
      this.display = 'running';
      this.errorMessage = '';
      this.showMessage = false;
      this.$refs.modal.show();
    },
    hide(variableName) {
      (variableName === -1) ? this.variables.splice(0) : null;
      const index = this.variables.indexOf(variableName);
      index > -1 ? this.variables.splice(index, 1) : null;
      this.variables.length === 0 ? this.$refs.modal.hide() : null;
    },
  },
};
</script>
