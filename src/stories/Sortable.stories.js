/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent, fireEvent, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import Sortable from "../components/sortable/Sortable.vue";

/**
 * Simulates a drag and drop action from one element to another.
 *
 * @param {HTMLElement} sourceElement - The element to drag.
 * @param {HTMLElement} targetElement - The element to drop onto.
 */
async function dragAndDrop(sourceElement, targetElement) {
  await fireEvent.dragStart(sourceElement);
  await fireEvent.dragEnter(targetElement);
  await fireEvent.dragOver(targetElement);
  await fireEvent.drop(targetElement);
  await fireEvent.dragEnd(sourceElement);
}

export default {
  title: "Components/Sortable",
  component: Sortable,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Sortable },
    template: `
      <sortable
        v-bind="$props"
        @sorted="sorted"
        @item-edit="editPage"
        @item-delete="deletePage"
        :searchProperties= "['name']"
      />
    `,
    data() {
      return {};
    },
    methods: {
      sorted(orderedArray) {
        console.log("edit", orderedArray);
      },
      editPage(page) {
        console.log("edit", page);
      },
      deletePage(page) {
        this.items.splice(this.items.indexOf(page), 1);
      },
      openPage(index) {
        this.$refs.tabsBar.openPageByIndex(index);
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
    fields: [
      {
        label: "Name",
        key: "name",
      },
    ],
    filterKey: "name",
    items: [
      { name: "Page 1", order: 1 },
      { name: "Page 2", order: 2 },
      { name: "Page 3", order: 3 },
      { name: "Page 4", order: 4 },
      { name: "Page 5", order: 5 }
    ]
  }
};

// User can reorder items
export const UserCanReorderItems = {
  args: {
    fields: [
      {
        label: "Name",
        key: "name",
      },
    ],
    filterKey: "name",
    items: [
      { name: "Page 1", order: 1 },
      { name: "Page 2", order: 2 },
      { name: "Page 3", order: 3 },
      { name: "Page 4", order: 4 },
      { name: "Page 5", order: 5 }
    ]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Drag item-1 item-5 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-5")
    );

    // Drag item-1 item-4 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-4")
    );

    // Drag item-1 item-3 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-3")
    );

    // Drag item-1 item-2 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-2")
    );

    // Check the new order
    const items = canvas.getAllByTestId(/item-\d+/);
    expect(items[0]).toHaveTextContent("Page 5");
    expect(items[1]).toHaveTextContent("Page 4");
    expect(items[2]).toHaveTextContent("Page 3");
    expect(items[3]).toHaveTextContent("Page 2");
    expect(items[4]).toHaveTextContent("Page 1");
  }
};

// User can filter by text
export const UserCanFilterByText = {
  args: {
    fields: [
      {
        label: "Name",
        key: "name",
      },
    ],
    filterKey: "name",
    items: [
      { name: "Zeus", order: 1 },
      { name: "Hera", order: 2 },
      { name: "Poseidon", order: 3 },
      { name: "Athena", order: 4 },
      { name: "Hephaïstus", order: 5 }
    ]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("search");

    // Type "Zeus"
    await step("Type 'Zeus'", async () => {
      await userEvent.clear(search);
      await userEvent.type(search, "Zeus");
      const items = canvas.getAllByTestId(/item-\d+/);
      await waitFor(() => {
        expect(items).toHaveLength(1);
      });
    });

    // Type "a" should be case insensitive
    await step("Type 'a'", async () => {
      await userEvent.clear(search);
      await userEvent.type(search, "a");
      const items = canvas.getAllByTestId(/item-\d+/);
      await waitFor(() => {
        expect(items).toHaveLength(3);
      });
    });

    // Type "Ï" support unicode
    await step("Type 'Ï'", async () => {
      await userEvent.clear(search);
      await userEvent.type(search, "Ï");
      const items = canvas.getAllByTestId(/item-\d+/);
      await waitFor(() => {
        expect(items).toHaveLength(1);
      });
    });
  }
};

// User can sort with filter by text
export const UserCanSortWithFilterByText = {
  args: {
    fields: [
      {
        label: "Name",
        key: "name",
      },
    ],
    filterKey: "name",
    items: [
      { name: "Zeus", order: 1 },
      { name: "Hera", order: 2 },
      { name: "Poseidon", order: 3 },
      { name: "Athena", order: 4 },
      { name: "Hephaïstus", order: 5 }
    ]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByTestId("search");

    // Type "A"
    await step("Type 'A'", async () => {
      await userEvent.clear(search);
      await userEvent.type(search, "A");
      const items = canvas.getAllByTestId(/item-\d+/);
      await waitFor(() => {
        expect(items).toHaveLength(3);
      });
    });

    // Drag "Hera" to "Hephaïstus" position
    await dragAndDrop(
      canvas.getByTitle("Hera"),
      canvas.getByTitle("Hephaïstus")
    );

    // Drag "Athena" to "Hephaïstus" position
    await dragAndDrop(
      canvas.getByTitle("Athena"),
      canvas.getByTitle("Hephaïstus")
    );

    // Clean search
    await step("Clean search", async () => {
      await userEvent.clear(search);
      const items = canvas.getAllByTestId(/item-\d+/);
      await waitFor(() => {
        expect(items).toHaveLength(5);
      });
    });

    // Check the new order
    const items = canvas.getAllByTestId(/item-\d+/);
    expect(items[0]).toHaveTextContent("Zeus");
    expect(items[1]).toHaveTextContent("Poseidon");
    expect(items[2]).toHaveTextContent("Hephaïstus");
    expect(items[3]).toHaveTextContent("Athena");
    expect(items[4]).toHaveTextContent("Hera");

    // Drag "Athena" to "Hera" position
    await dragAndDrop(canvas.getByTitle("Athena"), canvas.getByTitle("Hera"));

    // Check the new order
    const itemsOrder = canvas.getAllByTestId(/item-\d+/);
    expect(itemsOrder[0]).toHaveAttribute("data-order", "1");
    expect(itemsOrder[1]).toHaveAttribute("data-order", "2");
    expect(itemsOrder[2]).toHaveAttribute("data-order", "3");
    expect(itemsOrder[3]).toHaveAttribute("data-order", "4");
    expect(itemsOrder[4]).toHaveAttribute("data-order", "5");
  }
};

// User can reorder items that does not have an order
export const UserCanReorderItemsThatDoesNotHaveAnOrder = {
  args: {
    fields: [
      {
        label: "Name",
        key: "name",
      },
    ],
    filterKey: "name",
    items: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Drag item-1 item-5 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-5")
    );

    // Drag item-1 item-4 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-4")
    );

    // Drag item-1 item-3 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-3")
    );

    // Drag item-1 item-2 position
    await dragAndDrop(
      canvas.getByTestId("item-1"),
      canvas.getByTestId("item-2")
    );

    // Check the new order
    const items = canvas.getAllByTestId(/item-\d+/);
    expect(items[0]).toHaveTextContent("Page 5");
    expect(items[1]).toHaveTextContent("Page 4");
    expect(items[2]).toHaveTextContent("Page 3");
    expect(items[3]).toHaveTextContent("Page 2");
    expect(items[4]).toHaveTextContent("Page 1");
  }
};
