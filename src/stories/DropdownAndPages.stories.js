/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import TabsBar from "../components/TabsBar.vue";
import PagesDropdown from "../components/editor/pagesDropdown.vue";

export default {
  title: "Components/DropdownAndPages",
  component: [TabsBar, PagesDropdown],
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { TabsBar, PagesDropdown },
    template: `
      <tabs-bar ref="tabsBar" v-bind="$props">
        <template v-slot:tabs-start>
          <pages-dropdown
            :data="pages"
            @addPage="onAddPage"
            @clickPage="onClick"
            @seeAllPages="onSeeAllPages"
          />
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
      onAddPage() {
        console.log("Add page clicked");
      },
      onSeeAllPages() {
        console.log("See all pages clicked");
      },
      onClick(index) {
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

// Open a page using the PageDropdown(index)
export const OpenPageUsingDropdown = {
  args: {
    pages: [
      { name: "Page1" },
      { name: "Page2" },
      { name: "Page3" },
      { name: "Page4" },
      { name: "Page5" }
    ],
    initialOpenedPages: [0]
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const selector = canvasElement.querySelector(
      "[data-test=page-dropdown] button"
    );
    let selectorAddPage = canvasElement.querySelector("[data-test=page-Page3]");
    console.log(selectorAddPage);
    await selector.click(selector);
    await selectorAddPage.click(selectorAddPage);
    // Open Page 3 (index=2)
    await step("Open Page 3 (index=2)", async () => {
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page3 (#2)"
          );
        },
        { timeout: 1000 }
      );
    });

    // Open Page 2 (index=1)
    await selector.click(selector);
    selectorAddPage = canvasElement.querySelector("[data-test=page-Page2]");
    await selectorAddPage.click(selectorAddPage);
    await step("Open Page 2 (index=1)", async () => {
      await waitFor(
        () => {
          expect(canvas.getByTestId("tab-content")).toContainHTML(
            "Here comes content of Page2 (#1)"
          );
        },
        { timeout: 1000 }
      );
    });
  }
};
