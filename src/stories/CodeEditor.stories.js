/* eslint-disable import/no-extraneous-dependencies */
import { userEvent, expect, within } from "@storybook/test";
import "../bootstrap";
import CodeEditor from "../components/inspector/code-editor.vue";

export default {
  title: "Components/CodeEditor",
  component: CodeEditor,
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: 'text' },
      description: 'The code value to display in the editor'
    },
    helper: {
      control: { type: 'text' },
      description: 'Helper text displayed below the editor'
    },
    dataFeature: {
      control: { type: 'text' },
      description: 'Data test attribute prefix for testing'
    }
  },
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { CodeEditor },
    template: '<code-editor v-bind="$props" v-model="inputValue" @input="handleInput" />',
    data() {
      return { inputValue: args.value };
    },
    methods: {
      handleInput(value) {
        this.inputValue = value;
      }
    },
    watch: {
      // Updates the value when the property changes in storybook controls
      value(value) {
        this.inputValue = value;
      }
    }
  })
};

/**
 * Stories of the component
 */
// Preview the component with basic JavaScript code
export const Preview = {
  args: {
    label: "Click Handler",
    helper: "Enter your JavaScript code here",
    dataFeature: "code-editor",
    value: "console.log('Hello, World!');\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}"
  }
};

// Story with empty value
export const EmptyEditor = {
  args: {
    label: "Empty Editor",
    helper: "Start typing your code...",
    dataFeature: "code-editor-empty",
    value: ""
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox'), 'console.log("Hello, World!");');
    // Check if the code is displayed
    expect(canvas.getByRole('textbox')).toHaveValue('console.log("Hello, World!");');
  }
};

// Story with long code
export const LongCode = {
  args: {
    label: "Long Code Example",
    helper: "This editor contains a longer piece of code",
    dataFeature: "code-editor-long",
    value: `// This is a longer code example
function processUserData(users) {
  return users
    .filter(user => user.active)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      permissions: user.permissions || []
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .reduce((acc, user) => {
      if (!acc[user.role]) {
        acc[user.role] = [];
      }
      acc[user.role].push(user);
      return acc;
    }, {});
}

// Example usage
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', active: true, lastLogin: new Date() },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', active: true, lastLogin: new Date() },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'admin', active: false, lastLogin: new Date() }
];

const processedUsers = processUserData(users);
console.log(processedUsers);`
  }
}; 