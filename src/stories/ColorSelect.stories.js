/* eslint-disable import/no-extraneous-dependencies */
import { userEvent, expect } from "@storybook/test";
import "../bootstrap";
import ColorSelect from "../components/inspector/color-select.vue";

export default {
  title: "Components/ColorSelect",
  component: ColorSelect,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { ColorSelect },
    template: '<color-select v-bind="$props" v-model="inputValue" />',
    data() {
      return { inputValue: args.value };
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
// Preview the component
export const Preview = {
  args: {
    label: "Select a color",
    helper: "Helper text",
    options: [
      { value: "alert alert-primary", content: "primary" },
      { value: "alert alert-secondary", content: "secondary" },
      { value: "alert alert-success", content: "success" },
      { value: "alert alert-danger", content: "danger" },
      { value: "alert alert-warning", content: "warning" },
      { value: "alert alert-info", content: "info" },
      { value: "alert alert-light", content: "light" },
      { value: "alert alert-dark", content: "dark" }
    ],
    value: "alert alert-success"
  }
};

// A user can change the selected color
export const ChangeSelectedColor = {
  args: {
    label: "Select a color",
    helper: "Helper text",
    options: [
      { value: "alert alert-primary", content: "primary" },
      { value: "alert alert-secondary", content: "secondary" },
      { value: "alert alert-success", content: "success" },
      { value: "alert alert-danger", content: "danger" },
      { value: "alert alert-warning", content: "warning" },
      { value: "alert alert-info", content: "info" },
      { value: "alert alert-light", content: "light" },
      { value: "alert alert-dark", content: "dark" }
    ],
    value: "alert alert-success"
  },
  play: async ({ canvasElement }) => {
    const primaryColor = canvasElement.querySelector(".text-primary.fa-check");

    // check if the default value is the success color
    let selected = canvasElement.querySelector(".text-light");
    expect(selected.parentNode).toHaveClass("bg-success");

    // change the selected color
    await userEvent.click(primaryColor);

    // check if the alert is now the primary color
    selected = canvasElement.querySelector(".text-light");
    expect(selected.parentNode).toHaveClass("bg-primary");
  }
};
