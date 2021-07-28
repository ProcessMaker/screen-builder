<template>
  <b-input-group>
    <b-form-input v-bind="$attrs" v-model="localValue" @focus="focus" @input="input" @blur="blur" @change="change"/>
    <template v-slot:append>
      <b-dropdown
        ref="dropdown"
        text="(x)"
        right
        no-caret
        variant="outline-secondary"
        :menu-class="{'input-variable-open': open}"
      >
        <b-dropdown-item
          v-for="option in options"
          :key="option.value"
          class="text-small"
          @click="choose(option)"
        >
          <small><code v-html="option.text" /></small>
        </b-dropdown-item>
      </b-dropdown>
    </template>
  </b-input-group>
</template>

<script>
export default {
  props: {
    builder: Object,
    selectedControl: Object,
    formConfig: Array,
    value: null,
  },
  data() {
    return {
      localValue: this.value || '',
      open: false,
    };
  },
  computed: {
    allOptions() {
      const tree = this.builder.variablesTree;
      const {variables, prefix, parent_prefix} = this.loadVariables({items: tree});
      const plen = prefix.length;
      const pplen = parent_prefix.length;
      if (prefix) {
        return [
          ...Object.keys(variables).filter(v => (v.substr(0, plen) === prefix))
            .map(v => v.substr(plen)),
          ...Object.keys(variables).filter(v => (v.substr(0, pplen) === parent_prefix))
            .map(v => `_parent.${v.substr(pplen)}`),
        ];
      } else {
        return Object.keys(variables);
      }
    },
    options() {
      if (!this.localValue) {
        return;
      }
      const regexp = new RegExp(
        this.localValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\.\d+/g, '.index'),
        'g'
      );
      return this.allOptions.filter(option => option.match(regexp))
        .splice(0, 5)
        .map(option => ({
          value: option.replace(regexp, this.localValue),
          text: option.replace(regexp, `<b>${this.localValue}</b>`),
        }));
    },
  },
  methods: {
    loadVariables(def, prefix = '', variables = {}, output = {prefix:'', parent_prefix:''}) {
      const prefix0 = prefix;
      if (def.items) {
        prefix += def.prefix || '';
        def.items.forEach(def => {
          if (def.config === this.selectedControl.config) {
            output.prefix = prefix;
            output.parent_prefix = prefix0;
          }
          this.loadVariables(def, prefix, variables, output);
        });
      } else {
        variables[`${prefix}${def.name}`] = null;
      }
      return {variables, ...output};
    },
    choose(option) {
      this.localValue = option.value;
      this.$emit('input', this.localValue);
      this.$emit('change', this.localValue);
      this.open = false;
    },
    blur() {
      setTimeout(()=> this.open = false, 500);
    },
    focus() {
      this.open = true;
    },
    input() {
      this.$emit('input', this.localValue);
    },
    change() {
      this.open = true;
      this.$emit('change', this.localValue);
    },
  },
  watch: {
    value(value) {
      if (value != this.localValue) {
        this.localValue = value;
      }
    },
  },
};
</script>

<style>
.input-variable-open {
  display: block!important;
}
</style>
