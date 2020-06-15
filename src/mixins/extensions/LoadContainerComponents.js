export default {
  methods: {
    loadContainerProperties({ properties, element }) {
      properties.class = this.elementCssClass(element);
      properties.ref = 'container';
      properties.selected = 'selected';
      properties[':transientData'] = 'vdata';
      //properties['v-model'] = "element.items";
      //@submit="submit"
      properties[':config'] = JSON.stringify(element.config);
      //:ancestor-screens="ancestorScreens"
      properties.name = element.config && element.config.name !== undefined ? element.config.name : null;
      //@pageNavigate="pageNavigate"
      //v-bind="element.config"
      //:is="element.component"
      properties[':form-config'] = '$parent && $parent.definition.config';
      //:mode="mode"
    },
    loadContainerItems({ element, componentName, node }) {
      if (element.container) {
        if (componentName === 'FormMultiColumn') {
          element.items.forEach((col, index) => {
            const column = this.createComponent('div', {
              class: `col-sm-${element.config.options[index].content}`,
            });
            this.loadItems(col, column);
            node.appendChild(column);
          });
        } else {
          this.loadItems(element.items, node);
        }
      }
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (params.element.container) {
          this.loadContainerProperties(params);
        }
      },
      onloaditems(params) {
        if (params.element.container) {
          this.loadContainerItems(params);
        }
      },
    });
    this.alias['FormMultiColumn'] = 'NewFormMultiColumn';
  },
};
