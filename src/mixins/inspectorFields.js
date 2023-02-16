export default {
  methods: {
    getInspectorFields(accordion) {
      if (!this.inspection.inspector) {
        return [];
      }

      const accordionFields = accordion.fields
        .filter((field) => {
          if (typeof field !== "string") {
            const { component } = this.inspection;
            const { showFor, hideFor } = field;

            return showFor === component || hideFor !== component;
          }

          return true;
        })
        .map((field) => (typeof field !== "string" ? field.name : field));

      const control = this.controls.find(
        (item) => item["editor-control"] === this.inspection["editor-control"]
      ) ||
        this.controls.find(
          (item) => item.component === this.inspection.component
        ) || { inspector: [] };

      return control.inspector.filter(
        (input) =>
          accordionFields.includes(input.field) ||
          (!this.knownField(input.field) && accordion.name === "Configuration")
      );
    },
    knownField(field) {
      return this.getAllAccordionizedFields().includes(field);
    },
    getAllAccordionizedFields() {
      if (this._allAccordionizedFields) {
        return this._allAccordionizedFields;
      }
      this._allAccordionizedFields = this.accordions.flatMap((accordion) => {
        return accordion.fields.map((fieldName) => {
          if (typeof fieldName === "string") {
            return fieldName;
          }
          return fieldName.name;
        });
      });
      return this._allAccordionizedFields;
    }
  }
};
