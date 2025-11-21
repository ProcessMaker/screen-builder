/* eslint-disable import/no-extraneous-dependencies */
import "../bootstrap";
import VariablesToSubmit from "../components/inspector/variables-to-submit.vue";

// Mock builder object
const createMockBuilder = (config = [], variablesTree = [], computed = []) => ({
  config,
  variablesTree,
  computed,
  screen: {
    computed
  }
});

// Mock form config with various field types
const mockFormConfig = [
  {
    name: "Default",
    items: [
      {
        component: "FormInput",
        "editor-component": "FormInput",
        config: {
          name: "index",
          label: "Index Number"
        }
      },
      {
        component: "FormInput",
        "editor-component": "FormInput",
        config: {
          name: "name",
          label: "Name"
        }
      },
      {
        component: "FormInput",
        "editor-component": "FormInput",
        config: {
          name: "email",
          label: "Email"
        }
      },
      {
        component: "FormMultiColumn",
        "editor-component": "MultiColumn",
        config: {
          container: true
        },
        items: [
          [
            {
              component: "FormLoop",
              "editor-component": "Loop",
              config: {
                container: true,
                settings: {
                  varname: "loop_1"
                }
              },
              items: [
                {
                  component: "FormInput",
                  config: {
                    name: "loop_1.field1",
                    label: "Field 1"
                  }
                }
              ]
            }
          ],
          [
            {
              component: "FormInput",
              config: {
                name: "selectedName",
                label: "Selected Name"
              }
            }
          ]
        ]
      },
      {
        component: "FormButton",
        "editor-component": "FormButton",
        config: {
          name: "submitButton",
          label: "Submit",
          event: "submit"
        }
      }
    ]
  }
];

// Mock variables tree
const mockVariablesTree = [
  { name: "index", config: {}, element: {} },
  { name: "name", config: {}, element: {} },
  { name: "email", config: {}, element: {} },
  { name: "loop_1", config: {}, element: {} },
  { name: "selectedName", config: {}, element: {} }
];

// Mock computed properties
const mockComputed = [
  {
    id: 1,
    property: "totalAmount",
    name: "Total Amount",
    formula: "price * quantity",
    type: "expression",
    byPass: false
  },
  {
    id: 2,
    property: "discount",
    name: "Discount",
    formula: "totalAmount * 0.1",
    type: "expression",
    byPass: false
  },
  {
    id: 3,
    property: "bypassedCalc",
    name: "Bypassed Calculation",
    formula: "someFormula()",
    type: "javascript",
    byPass: true
  }
];

// Mock selected control (submit button)
const mockSelectedControl = {
  config: {
    name: "submitButton",
    label: "Submit",
    event: "submit"
  }
};

export default {
  title: "Components/Inspector/VariablesToSubmit",
  component: VariablesToSubmit,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: 'object' },
      description: 'Array of selected variable names'
    },
    builder: {
      control: { type: 'object' },
      description: 'Builder object with config, variablesTree, and computed properties'
    },
    formConfig: {
      control: { type: 'object' },
      description: 'Form configuration array'
    },
    selectedControl: {
      control: { type: 'object' },
      description: 'Currently selected control (button)'
    }
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { VariablesToSubmit },
    template: `
      <div style="max-width: 400px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;">
        <variables-to-submit 
          v-bind="$props" 
          v-model="selectedVariables"
          @input="handleInput"
          @change="handleChange"
        />
      </div>
    `,
    data() {
      return {
        selectedVariables: args.value || []
      };
    },
    methods: {
      handleInput(value) {
        this.selectedVariables = value;
        console.log('Input event:', value);
      },
      handleChange(value) {
        console.log('Change event:', value);
      }
    },
    watch: {
      value(newValue) {
        this.selectedVariables = newValue || [];
      }
    }
  })
};

/**
 * Stories of the component
 */

// Basic preview with default variables
export const Preview = {
  args: {
    value: [],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, mockComputed),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

// With some variables pre-selected
export const WithPreSelectedVariables = {
  args: {
    value: ["index", "name", "totalAmount"],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, mockComputed),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

// With toggle enabled
export const ToggleEnabled = {
  args: {
    value: ["index", "email"],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, mockComputed),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

// With calculated variables only
export const WithCalculatedVariables = {
  args: {
    value: [],
    builder: createMockBuilder([], [], mockComputed),
    formConfig: [],
    selectedControl: mockSelectedControl
  }
};

// With no variables available
export const NoVariablesAvailable = {
  args: {
    value: [],
    builder: createMockBuilder([], [], []),
    formConfig: [],
    selectedControl: mockSelectedControl
  }
};

// With variables from containers
export const WithContainerVariables = {
  args: {
    value: [],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, []),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

// All variables selected
export const AllVariablesSelected = {
  args: {
    value: ["index", "name", "email", "loop_1", "loop_1.field1", "selectedName", "totalAmount", "submitButton", "discount"],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, mockComputed),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

// Mock nested screen configuration
const mockNestedScreenConfig = [
  {
    name: "Nested Page 1",
    items: [
      {
        component: "FormInput",
        config: {
          name: "nestedFirstName",
          label: "First Name (Nested)"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "nestedLastName",
          label: "Last Name (Nested)"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "nestedEmail",
          label: "Email (Nested)"
        }
      }
    ]
  },
  {
    name: "Nested Page 2",
    items: [
      {
        component: "FormInput",
        config: {
          name: "nestedPhone",
          label: "Phone (Nested)"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "nestedAddress",
          label: "Address (Nested)"
        }
      }
    ]
  }
];

// Form config with nested screen
const mockFormConfigWithNested = [
  {
    name: "Default",
    items: [
      {
        component: "FormInput",
        config: {
          name: "mainField1",
          label: "Main Field 1"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "mainField2",
          label: "Main Field 2"
        }
      },
      {
        component: "FormNestedScreen",
        config: {
          name: "nestedScreen",
          label: "Nested Screen",
          screen: 123 // This ID will be used to lookup in window.nestedScreens
        }
      },
      {
        component: "FormInput",
        config: {
          name: "mainField3",
          label: "Main Field 3"
        }
      },
      {
        component: "FormButton",
        config: {
          name: "submitButton",
          label: "Submit",
          event: "submit"
        }
      }
    ]
  }
];

// Variables tree including nested screen variables
const mockVariablesTreeWithNested = [
  { name: "mainField1", config: {}, element: {} },
  { name: "mainField2", config: {}, element: {} },
  { name: "mainField3", config: {}, element: {} },
  { name: "nestedFirstName", config: {}, element: {} },
  { name: "nestedLastName", config: {}, element: {} },
  { name: "nestedEmail", config: {}, element: {} },
  { name: "nestedPhone", config: {}, element: {} },
  { name: "nestedAddress", config: {}, element: {} }
];

// Story with nested screen
export const WithNestedScreen = {
  args: {
    value: [],
    builder: createMockBuilder(mockFormConfigWithNested, mockVariablesTreeWithNested, []),
    formConfig: mockFormConfigWithNested,
    selectedControl: mockSelectedControl
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { VariablesToSubmit },
    template: `
      <div style="max-width: 400px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;">
        <div style="margin-bottom: 15px; padding: 10px; background: #f0f8ff; border-radius: 4px;">
          <strong>📦 Nested Screen Story</strong>
          <p style="margin: 5px 0; font-size: 12px; color: #666;">
            This story demonstrates variables from a FormNestedScreen.
            The nested screen contains variables like <code>nestedFirstName</code>, 
            <code>nestedLastName</code>, etc.
          </p>
        </div>
        <variables-to-submit 
          v-bind="$props" 
          v-model="selectedVariables"
          @input="handleInput"
          @change="handleChange"
        />
        <div style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          <strong>Selected Variables:</strong>
          <pre style="margin: 5px 0; font-size: 11px; overflow-x: auto;">{{ selectedVariables }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        selectedVariables: args.value || []
      };
    },
    methods: {
      handleInput(value) {
        this.selectedVariables = value;
        console.log('Input event:', value);
      },
      handleChange(value) {
        console.log('Change event:', value);
      }
    },
    watch: {
      value(newValue) {
        this.selectedVariables = newValue || [];
      }
    },
    created() {
      // Setup window.nestedScreens for nested screen component
      if (typeof window !== 'undefined') {
        if (!window.nestedScreens) {
          window.nestedScreens = {};
        }
        // Store the nested screen config with ID 123 (matching the screen ID in config)
        window.nestedScreens['id_123'] = mockNestedScreenConfig;
        console.log('✅ Nested screen data loaded:', window.nestedScreens);
      }
    },
    beforeDestroy() {
      // Cleanup
      if (typeof window !== 'undefined' && window.nestedScreens) {
        delete window.nestedScreens['id_123'];
      }
    }
  })
};

// Story with nested screen and some variables pre-selected
export const WithNestedScreenPreSelected = {
  args: {
    value: ["mainField1", "nestedFirstName", "nestedEmail"],
    builder: createMockBuilder(mockFormConfigWithNested, mockVariablesTreeWithNested, []),
    formConfig: mockFormConfigWithNested,
    selectedControl: mockSelectedControl
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { VariablesToSubmit },
    template: `
      <div style="max-width: 400px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;">
        <div style="margin-bottom: 15px; padding: 10px; background: #e8f5e9; border-radius: 4px;">
          <strong>✅ Nested Screen with Pre-Selected Variables</strong>
          <p style="margin: 5px 0; font-size: 12px; color: #666;">
            Main fields + Nested screen fields are pre-selected.
          </p>
        </div>
        <variables-to-submit 
          v-bind="$props" 
          v-model="selectedVariables"
          @input="handleInput"
          @change="handleChange"
        />
        <div style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          <strong>Selected Variables:</strong>
          <pre style="margin: 5px 0; font-size: 11px; overflow-x: auto;">{{ selectedVariables }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        selectedVariables: args.value || []
      };
    },
    methods: {
      handleInput(value) {
        this.selectedVariables = value;
        console.log('Input event:', value);
      },
      handleChange(value) {
        console.log('Change event:', value);
      }
    },
    watch: {
      value(newValue) {
        this.selectedVariables = newValue || [];
      }
    },
    created() {
      if (typeof window !== 'undefined') {
        if (!window.nestedScreens) {
          window.nestedScreens = {};
        }
        window.nestedScreens['id_123'] = mockNestedScreenConfig;
        console.log('✅ Nested screen data loaded:', window.nestedScreens);
      }
    },
    beforeDestroy() {
      if (typeof window !== 'undefined' && window.nestedScreens) {
        delete window.nestedScreens['id_123'];
      }
    }
  })
};

// Story with multiple nested screens
const mockFormConfigWithMultipleNested = [
  {
    name: "Default",
    items: [
      {
        component: "FormInput",
        config: {
          name: "mainField",
          label: "Main Field"
        }
      },
      {
        component: "FormNestedScreen",
        config: {
          name: "nestedScreen1",
          label: "Contact Information",
          screen: 100
        }
      },
      {
        component: "FormNestedScreen",
        config: {
          name: "nestedScreen2",
          label: "Address Information",
          screen: 200
        }
      },
      {
        component: "FormButton",
        config: {
          name: "submitButton",
          label: "Submit",
          event: "submit"
        }
      }
    ]
  }
];

const mockNestedScreen1Config = [
  {
    name: "Contact",
    items: [
      {
        component: "FormInput",
        config: {
          name: "contactEmail",
          label: "Email"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "contactPhone",
          label: "Phone"
        }
      }
    ]
  }
];

const mockNestedScreen2Config = [
  {
    name: "Address",
    items: [
      {
        component: "FormInput",
        config: {
          name: "street",
          label: "Street"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "city",
          label: "City"
        }
      },
      {
        component: "FormInput",
        config: {
          name: "zipCode",
          label: "ZIP Code"
        }
      }
    ]
  }
];

const mockVariablesTreeMultipleNested = [
  { name: "mainField", config: {}, element: {} },
  { name: "contactEmail", config: {}, element: {} },
  { name: "contactPhone", config: {}, element: {} },
  { name: "street", config: {}, element: {} },
  { name: "city", config: {}, element: {} },
  { name: "zipCode", config: {}, element: {} }
];

export const WithMultipleNestedScreens = {
  args: {
    value: [],
    builder: createMockBuilder(mockFormConfigWithMultipleNested, mockVariablesTreeMultipleNested, []),
    formConfig: mockFormConfigWithMultipleNested,
    selectedControl: mockSelectedControl
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { VariablesToSubmit },
    template: `
      <div style="max-width: 400px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 4px;">
        <div style="margin-bottom: 15px; padding: 10px; background: #fff3e0; border-radius: 4px;">
          <strong>🔗 Multiple Nested Screens</strong>
          <p style="margin: 5px 0; font-size: 12px; color: #666;">
            Form with two nested screens: Contact Info and Address Info.
          </p>
        </div>
        <variables-to-submit 
          v-bind="$props" 
          v-model="selectedVariables"
          @input="handleInput"
          @change="handleChange"
        />
        <div style="margin-top: 15px; padding: 10px; background: #f9f9f9; border-radius: 4px;">
          <strong>Selected Variables:</strong>
          <pre style="margin: 5px 0; font-size: 11px; overflow-x: auto;">{{ selectedVariables }}</pre>
        </div>
      </div>
    `,
    data() {
      return {
        selectedVariables: args.value || []
      };
    },
    methods: {
      handleInput(value) {
        this.selectedVariables = value;
        console.log('Input event:', value);
      },
      handleChange(value) {
        console.log('Change event:', value);
      }
    },
    watch: {
      value(newValue) {
        this.selectedVariables = newValue || [];
      }
    },
    created() {
      if (typeof window !== 'undefined') {
        if (!window.nestedScreens) {
          window.nestedScreens = {};
        }
        window.nestedScreens['id_100'] = mockNestedScreen1Config;
        window.nestedScreens['id_200'] = mockNestedScreen2Config;
        console.log('✅ Multiple nested screens loaded:', window.nestedScreens);
      }
    },
    beforeDestroy() {
      if (typeof window !== 'undefined' && window.nestedScreens) {
        delete window.nestedScreens['id_100'];
        delete window.nestedScreens['id_200'];
      }
    }
  })
};

