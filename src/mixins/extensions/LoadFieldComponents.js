/* eslint-disable no-param-reassign */
export default {
  data() {
    return {
      popups: []
    };
  },
  methods: {
    searchForRecordList(items) {
      items.forEach((item) => {
        if (item instanceof Array) {
          this.searchForRecordList(item);
        }
        if (item.items) {
          this.searchForRecordList(item.items);
        }
        if (item.component === "FormRecordList") {
          this.popups.push(parseInt(item.config.form));
        }
      });
    },
    loadFormPopups({ definition }) {
      this.popups = [];
      definition.config.forEach((page) => {
        if (page && page.items) {
          this.searchForRecordList(page.items);
        }
      });
    },
    /**
     * Get MIME type of the encoded code data if there are not type return null
     * @param {string} base64String
     * @returns {string|null}
     */
    getBase64MimeType(base64String) {
      const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      return matches && matches.length > 1 ? matches[1] : null;
    },
    /**
     * Create a Blob object from a base 64 string
     * @param {string} base64image 
     * @returns {object|null}
     */
    createObjectURL(base64image) {
      if (base64image) {
        const binaryData = atob(base64image.split(",")[1]);
        const binaryArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          binaryArray[i] = binaryData.charCodeAt(i);
        }
        const blob = new Blob([binaryArray], {
          type: this.getBase64MimeType(base64image)
        });
        return URL.createObjectURL(blob);
      }
      return false;
    },
    getBlobImageObject(element) {
      const allBlobImages =
        this.$store.getters["blobImagesModule/allBlobImages"];
      let blobImage = allBlobImages.find((item) => {
        return item.image === element.config.image;
      });
      if (!blobImage) {
        blobImage = {
          image: element.config.image,
          blob: this.createObjectURL(element.config.image)
        };
        this.$store.dispatch("blobImagesModule/addBlobImages", blobImage);
      }
      return blobImage.blob;
    },
    loadFieldProperties({
      properties,
      element,
      componentName,
      definition,
      formIndex,
      screen
    }) {
      properties.class = this.elementCssClass(element);
      properties[":validation-data"] = "getValidationData()";

      // verify if component is defined in popup
      if (!this.popups.includes(formIndex)) {
        if (componentName === "FormImage") {
          this.registerVariable(element.config.variableName, element);
          delete properties.image;
          properties[":image"] = this.byRef(this.getBlobImageObject(element));
        } else if (this.validVariableName(element.config.name)) {
          this.registerVariable(element.config.name, element);
          // v-model are not assigned directly to the field name, to prevent invalid references like:
          // `person.content` when `person`=null
          const safeDotName = this.safeDotName(element.config.name);
          properties["v-model"] = safeDotName;
          // Debounce input from FormTextArea and FormInput
          if (
            componentName === "FormTextArea" ||
            componentName === "FormInput"
          ) {
            properties[
              "@input"
            ] = `updateScreenData('${safeDotName}', '${element.config.name}')`;
            properties[
              "@change"
            ] = `updateScreenDataNow('${safeDotName}', '${element.config.name}')`;
          } else {
            properties[
              "@input"
            ] = `updateScreenDataNow('${safeDotName}', '${element.config.name}')`;
            properties[
              "@change"
            ] = `updateScreenDataNow('${safeDotName}', '${element.config.name}')`;
          }
          // Process the FormSelectList@reset event
          properties[
            "@reset"
          ] = `resetValue('${safeDotName}', '${element.config.name}')`;
        }
      }
      // Do not replace mustache in RichText control, it is replaced by the control
      if (
        componentName === "FormHtmlViewer" ||
        componentName === "FormHtmlEditorStatic"
      ) {
        delete properties.content;
        properties[":content"] = this.byRef(element.config.content);
      }
      if (componentName === "FormNestedScreen") {
        properties[":_parent"] = "_parent";
      }
      // Add cypress testing tags
      if (element.config.name) {
        properties["data-cy"] = `screen-field-${element.config.name}`;
      }
      properties[":ancestor-screens"] = "$parent && $parent.ancestorScreens";
      properties.name =
        element.config.name !== undefined ? element.config.name : null;
      properties.disabled =
        element.config.interactive || element.config.disabled;
      properties[":form-config"] = this.byRef(
        this.configRef || definition.config
      );
      properties[":form-computed"] = JSON.stringify(definition.computed);
      properties[":form-watchers"] = JSON.stringify(definition.watchers);
      // Check if control is assigned to a calculated property
      const isCalcProp = this.isComputedVariable(
        element.config.name,
        definition
      );
      properties[":readonly"] = isCalcProp || element.config.readonly;
      properties[":disabled"] = isCalcProp || element.config.disabled;
      // Events
      properties["@submit"] = "submitForm";
    }
  },
  mounted() {
    this.extensions.push({
      onloadproperties(params) {
        if (!params.element.container) {
          this.loadFormPopups(params);
          this.loadFieldProperties(params);
        }
        params.properties[":config"] = this.byRef(params.element.config);
        params.properties[":transientData"] = "vdata";
      }
    });
  }
};
