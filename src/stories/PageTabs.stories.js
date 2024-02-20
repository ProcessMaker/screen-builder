/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import TabsBar from "../components/TabsBar.vue";

export default {
  title: "Components/Tabs",
  component: TabsBar,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { TabsBar },
    template: `
    <tabs-bar ref="tabsBar" v-bind="$props">
      <template v-slot:tabs-start>
        <b-form-select :options="pages.map((v,k)=>k)" @change="openPage($event)" data-testid="open-page" />
      </template>
      <template v-slot="{ currentPage }">
        Here comes content of {{pages[currentPage].name}} (#{{currentPage}})
      </template>
    </tabs-bar>`,
    data() {
      return {};
    },
    methods: {
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
    pages: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ],
    initialOpenedPages: [0]
  }
};

// Open a page using openPageByIndex(index)
export const OpenPageByIndexFunction = {
  args: {
    pages: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ],
    initialOpenedPages: [0]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const selector = canvasElement.querySelector("[data-testid=open-page]");

    // Open Page 3 (index=2)
    await step("Open Page 3 (index=2)", async () => {
      userEvent.selectOptions(selector, "2");
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 3 (#2)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Open Page 2 (index=1)
    await step("Open Page 2 (index=1)", async () => {
      userEvent.selectOptions(selector, "1");
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 2 (#1)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Close Tab #1 = Page 3 (index=2)
    await step("Close Page 3 (index=2)", async () => {
      canvas.getByTestId("close-tab-2").click();
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).not.toContainHTML(
            "Here comes content of Page 3 (#2)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Select Page 1 using dropdown (index=0) (tab=0)
    await step("Select Page 1 (index=0)", async () => {
      userEvent.selectOptions(selector, "0");
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 1 (#0)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Select Page 2 using dropdown (index=1) (tab=1)
    await step("Select Page 2 (index=1)", async () => {
      userEvent.selectOptions(selector, "1");
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 2 (#1)"
          );
        },
        { timeout: 1000 }
      );
    });
  }
};

// User navigating through tabs
export const UserNavigatingThroughTabs = {
  args: {
    pages: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ],
    initialOpenedPages: [0, 1]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Select Page 2 using tab (data-testid=tab-1)
    await step("Select Page 2 using tab", async () => {
      canvas.getByTestId("tab-1").click();
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 2 (#1)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Select Page 1 using tab (data-testid=tab-0)
    await step("Select Page 1 using tab", async () => {
      canvas.getByTestId("tab-0").click();
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page 1 (#0)"
          );
        },
        { timeout: 1000 }
      );
    });
  }
};

// Lots of pages opened
export const ALotOfPagesOpen = {
  args: {
    pages: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" },
      { name: "Page 6" },
      { name: "Page 7" },
      { name: "Page 8" },
      { name: "Page 9" },
      { name: "Page 10" },
      { name: "Page 11" },
      { name: "Page 12" },
      { name: "Page 13" },
      { name: "Page 14" },
      { name: "Page 15" },
      { name: "Page 16" }
    ],
    initialOpenedPages: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const scrollLeft = canvas.getByTestId("scroll-left");
    const scrollRight = canvas.getByTestId("scroll-right");

    await waitFor(() => expect(scrollRight).toBeVisible());
    await waitFor(() => expect(scrollLeft).not.toBeVisible());

    // Scroll to the right
    await step("Scroll to the right", async () => {
      scrollRight.click();
      await waitFor(() => expect(scrollLeft).toBeVisible());
    });

    // Scroll to the left
    await step("Scroll to the left", async () => {
      scrollLeft.click();
      await waitFor(() => expect(scrollLeft).not.toBeVisible());
    });
  }
};