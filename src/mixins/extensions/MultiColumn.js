export default {
  methods: {
    loadMultiColumnProperties({ properties, element }) {
      properties.class = this.elementCssClass(element);
      properties.ref = 'container';
      properties.selected = 'selected';
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
    loadMultiColumnItems({ element, node, screen, definition, formIndex }) {
      element.items.forEach((col, index) => {
        const column = this.createComponent('div', {
          class: `col-sm-${element.config.options[index].content}`,
        });
        this.loadItems(col, column, screen, definition, formIndex);
        node.appendChild(column);
      });
    },
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (params.element.container && params.componentName === 'FormMultiColumn') {
          this.loadMultiColumnProperties(params);
        }
      },
      onloaditems(params) {
        if (params.element.container && params.componentName === 'FormMultiColumn') {
          this.loadMultiColumnItems(params);
        }
      },
    });
    this.alias['FormMultiColumn'] = 'NewFormMultiColumn';
    this.alias['MultiColumn'] = 'NewFormMultiColumn';
  },
};
