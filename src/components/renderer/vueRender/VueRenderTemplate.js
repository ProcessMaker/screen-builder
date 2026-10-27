function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function sanitizeHandlerPart(value, kind) {
  if (!isPlainObject(value)) {
    return {};
  }

  const sanitized = {};
  Object.keys(value).forEach((key) => {
    const entry = value[key];
    if (entry === null || entry === undefined) {
      return;
    }
    if (kind === 'methods' || kind === 'computed') {
      if (typeof entry === 'function') {
        sanitized[key] = entry;
      }
      return;
    }
    if (kind === 'watch') {
      sanitized[key] = entry;
      return;
    }
    if (kind === 'components') {
      if (typeof entry === 'object' || typeof entry === 'function') {
        sanitized[key] = entry;
      }
    }
  });
  return sanitized;
}

export default {
  name: 'RenderTemplate',
  inheritAttrs: false,
  props: [
    'error',
    'name',
    'value',
    'helper',
    'controlClass',
    'templateVue',
    'handlerVue',
    'validationData',
    'label',
    'renderVarHtml',
    'components',
  ],
  methods: {
    /**
     * Screen Builder binds v-model on this renderer when `config.name` is set.
     * Forward nested data writes so `$v.vdata.<name>` stays in sync.
     */
    emitInput(nextValue) {
      this.$emit('input', nextValue);
      this.$emit('change', nextValue);
    },
    resolveTransientData() {
      return this.$attrs['transient-data']
        || this.$attrs.transientData
        || this.validationData
        || null;
    },
    resolveTemplateSource() {
      const template = this.templateVue && String(this.templateVue).trim();
      return template || '<div></div>';
    },
    resolveHandlerOptions() {
      const empty = {
        methods: {},
        computed: {},
        watch: {},
        components: {},
        dataFn: null,
        error: null,
      };

      if (!this.handlerVue || !String(this.handlerVue).trim()) {
        return empty;
      }

      try {
        // eslint-disable-next-line no-new-func -- handlerVue is authored in the screen designer
        // NOSONAR -- This is a valid use of new Function
        const evaluated = new Function(this.handlerVue)();
        if (!isPlainObject(evaluated)) {
          return {
            ...empty,
            error:
              'handlerVue must return a plain object (Vue mixin). Example: return { methods: { ... } }',
          };
        }

        let dataFn = null;
        if (typeof evaluated.data === 'function') {
          dataFn = evaluated.data;
        }

        return {
          methods: sanitizeHandlerPart(evaluated.methods, 'methods'),
          computed: sanitizeHandlerPart(evaluated.computed, 'computed'),
          watch: sanitizeHandlerPart(evaluated.watch, 'watch'),
          components: sanitizeHandlerPart(evaluated.components, 'components'),
          dataFn,
          error: null,
        };
      } catch (err) {
        return {
          ...empty,
          error: err?.message || String(err),
        };
      }
    },
  },
  render(createElement) {
    const handlerOptions = this.resolveHandlerOptions();
    const templateSource = this.resolveTemplateSource();
    const getTransientData = () => this.resolveTransientData();
    const emitSubmit = () => this.$emit('submit');

    let component;
    try {
      component = createElement({
        components: {
          ...(this.components || {}),
          ...handlerOptions.components,
        },
        template: templateSource,
        data() {
          const base = {
            data: getTransientData(),
          };
          if (!handlerOptions.dataFn) {
            return base;
          }
          try {
            const handlerData = handlerOptions.dataFn.call(this);
            if (isPlainObject(handlerData)) {
              return { ...base, ...handlerData };
            }
          } catch (dataError) {
            // eslint-disable-next-line no-console
            console.warn('[VueRenderTemplate] handlerVue.data() failed', dataError);
          }
          return base;
        },
        computed: {
          ...handlerOptions.computed,
          transientData: {
            get: () => getTransientData() || {},
            set(value) {
              const target = getTransientData();
              if (target && typeof target === 'object') {
                Object.assign(target, value);
              }
            },
          },
        },
        watch: {
          ...handlerOptions.watch,
          data(value) {
            const target = getTransientData();
            if (!target || !value || typeof value !== 'object' || value === target) {
              return;
            }
            Object.assign(target, value);
            this.data = target;
          },
        },
        methods: {
          ...handlerOptions.methods,
          submit: () => emitSubmit(),
          getData: () => getTransientData() || {},
          updateTransientData(value) {
            this.transientData = value;
          },
        },
      });
    } catch (compileError) {
      component = createElement(
        'div',
        { class: 'invalid-feedback d-block', attrs: { role: 'alert' } },
        compileError?.message || String(compileError),
      );
    }

    const children = [component];

    const displayError = this.error || handlerOptions.error;
    if (displayError) {
      children.push(createElement(
        'div',
        {
          class: 'invalid-feedback d-block',
          attrs: { role: 'alert' },
        },
        displayError,
      ));
    }

    if (this.helper) {
      children.push(createElement(
        'small',
        { class: 'form-text text-muted' },
        this.helper,
      ));
    }

    return createElement(
      'div',
      {
        class: {
          'form-group': true,
          'form-group--error': Boolean(displayError),
          [this.controlClass]: Boolean(this.controlClass),
        },
      },
      children,
    );
  },
  mounted() {
    if (!this.name) {
      return;
    }
    const data = this.resolveTransientData();
    if (!data || typeof data !== 'object') {
      return;
    }
    this.sbDataUnwatch = this.$watch(
      () => data[this.name],
      (nextValue) => {
        if (nextValue !== this.value) {
          this.emitInput(nextValue === undefined ? null : nextValue);
        }
      },
      { immediate: true },
    );
  },
  beforeDestroy() {
    if (typeof this.sbDataUnwatch === 'function') {
      this.sbDataUnwatch();
    }
  },
};
