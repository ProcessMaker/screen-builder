import ClipboardButton from '../components/ClipboardButton.vue';
import { within, userEvent, expect } from "@storybook/test";

export default {
  title: 'Components/ClipboardButton',
  tags: ["autodocs"],
  component: ClipboardButton,
  argTypes: {
    isInClipboard: { control: 'boolean' },
  },
};

const Template = (args) => ({
  components: { ClipboardButton },
  setup() {
    return { args };
  },
  template: '<ClipboardButton v-bind="args" @addToClipboard="args.addToClipboard" @removeFromClipboard="args.removeFromClipboard"/>',
});

// Story for when the item is in the clipboard
export const InClipboard = Template.bind({});
InClipboard.args = {
  isInClipboard: true,
  index: 1,
  addToClipboard: () => {},
  removeFromClipboard: () => {},
};
InClipboard.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Expect the "Remove from clipboard" button to be rendered
  const removeButton = await canvas.getByRole('button', { name: /Remove from clipboard/i });
  expect(removeButton).toBeInTheDocument();

  // Simulate a click on the remove button
  await userEvent.click(removeButton);

  // Ensure that the button remains visible after interaction
  expect(removeButton).toBeVisible();
};

// Story for when the item is not in the clipboard
export const NotInClipboard = Template.bind({});
NotInClipboard.args = {
  isInClipboard: false,
  index: 1,
  addToClipboard: () => {},
  removeFromClipboard: () => {},
};

NotInClipboard.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  // Expect the "Add to clipboard" button to be rendered
  const addButton = await canvas.getByRole('button', { name: /Add to clipboard/i });
  expect(addButton).toBeInTheDocument();

  // Simulate a click on the add button
  await userEvent.click(addButton);

  // Ensure that the button remains visible after interaction
  expect(addButton).toBeVisible();
};
