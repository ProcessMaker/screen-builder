    <template>
      <div class="form-group">
        <label v-uni-for="name">{{ label }}</label>
        <component v-uni-id="name" :is="bootstrapComponent" v-bind="bootstrapConfigObject" v-model="model"></component>
        <b-form-invalid-feedback id="input-live-feedback">
          {{ errorMessage }}
        </b-form-invalid-feedback>
      </div>
    </template>

    <script>
    import { createUniqIdsMixin } from "vue-uniq-ids";
    const uniqIdsMixin = createUniqIdsMixin();

    export default {
      props: {
        bootstrapComponent: { type: String, default: 'b-form-tags' },
        bootstrapConfig: { type: String, default: '{}' },
        value: { default: null },
        name: { type: String, default: null },
        label: { type: String, default: '' },
        error: {},
      },
      mixins: [uniqIdsMixin],
      data() {
        return {
          errorMessage: ''
        };
      },
      computed: {
        model: {
          get() {
            return this.value;
          },
          set(value) {
            this.$emit('input', value);
          },
        },
        bootstrapConfigObject() {
          let config = {};
          try {
            config = JSON.parse(this.bootstrapConfig);
          } catch (e) {
            config = {};
          }
          /**
           * This place sets the component's properties, and if any of them change, 
           * by definition, the computed method will perform a calculation. 
           * We omit the state value as true to maintain a similar display to the 
           * other controls.
           */
          let state = null;
          if(typeof this.error === 'string' && this.error.length > 0) {
              this.errorMessage = this.error;
              state = false;
          }
          config.state = state;
          return config;
        }
      },
    };
    </script>