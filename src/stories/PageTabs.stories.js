/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import TabsBar from "../components/TabsBar.vue";

export default {
  title: "Components/TabsBar",
  component: TabsBar,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { TabsBar },
    template: `
      <tabs-bar ref="tabsBar" v-bind="$props">
        <template v-slot:tabs-start>
          <b-form-select :options="pages.map((v,k)=>k)" @change="openPage($event)" data-test="open-page" />
        </template>
        <template v-slot="{ currentPage }">
          Here comes content of {{pages[currentPage].name}} (#{{currentPage}})
        </template>
      </tabs-bar>
    `,
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
    const selector = canvasElement.querySelector("[data-test=open-page]");

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

    // Select Page 2 using tab (data-test=tab-1)
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

    // Select Page 1 using tab (data-test=tab-0)
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

// Tab content fill all the available space
export const TabContentFillAllTheAvailableSpace = {
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
  parameters: {
    layout: "fullscreen"
  },
  decorators: [
    () => ({
      template: '<div style="height: calc(100vh - 2rem)"><story/></div>'
    })
  ],
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    // Check content position in Page 1
    await step("Check content position in Page 1", async () => {
      const tabContent = canvas.getByTestId("tab-content");
      const tabsBar = canvas.getByRole("tablist").parentElement;

      // -------------------------------------
      //
      // Check the height of the tab content is the same as the height
      // of the canvas minus height of the tabs bar. This is important
      // to make sure the tab content fill all the available space and
      // the dropzone can be used to drop elements. Also check the top
      // position of the tab content is the same as the height of the
      // tabs bar.
      //
      // -------------------------------------
      await waitFor(() => {
        const canvasHeight = canvasElement.clientHeight;
        const tabsBarHeight = tabsBar.clientHeight;
        const tabContentTop = tabContent.getBoundingClientRect().top;
        expect(tabContentTop).toBe(tabsBarHeight);
        expect(tabContent).toHaveStyle({
          height: `${canvasHeight - tabsBarHeight}px`
        });
      });
    });

    // Select Page 2 using tab (data-test=tab-1)
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

    // Check content position in Page 2
    await step("Check content position in Page 2", async () => {
      const tabContent = canvas.getByTestId("tab-content");
      const tabsBar = canvas.getByRole("tablist").parentElement;

      // -------------------------------------
      //
      // Check the height of the tab content is the same as the height
      // of the canvas minus height of the tabs bar. This is important
      // to make sure the tab content fill all the available space and
      // the dropzone can be used to drop elements. Also check the top
      // position of the tab content is the same as the height of the
      // tabs bar.
      //
      // -------------------------------------
      await waitFor(() => {
        const canvasHeight = canvasElement.clientHeight;
        const tabsBarHeight = tabsBar.clientHeight;
        const tabContentTop = tabContent.getBoundingClientRect().top;
        expect(tabContentTop).toBe(tabsBarHeight);
        expect(tabContent).toHaveStyle({
          height: `${canvasHeight - tabsBarHeight}px`
        });
      });
    });
  }
};

// Without any page opened
export const WithoutAnyPageOpened = {
  args: {
    pages: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ],
    initialOpenedPages: []
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that there is a message when there is no page open.
    await waitFor(
      () => {
        expect(canvas.getByTestId("tab-content")).toContainHTML(
          "There are no open pages."
        );
      },
      { timeout: 1000 }
    );
  }
};
