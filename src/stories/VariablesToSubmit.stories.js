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
    value: ["index", "name", "email", "loop_1", "selectedName", "totalAmount", "discount"],
    builder: createMockBuilder(mockFormConfig, mockVariablesTree, mockComputed),
    formConfig: mockFormConfig,
    selectedControl: mockSelectedControl
  }
};

