/* eslint-disable import/no-extraneous-dependencies */
import { within, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import PagesDropdown from "../components/editor/pagesDropdown.vue";

export default {
  title: "Components/PagesDropdown",
  component: PagesDropdown,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { PagesDropdown },
    template: `
      <pages-dropdown
        :data="data"
        @addPage="onAddPage"
        @clickPage="onClick"
        @seeAllPages="onSeeAllPages"
      />
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
        console.log("Click page item:", index);
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
    data: [
      { name: "Page 1" },
      { name: "Page 2" },
      { name: "Page 3" },
      { name: "Page 4" },
      { name: "Page 5" }
    ]
  }
};

// Open the pages dropdown
export const ClickInDropdown = {
  args: {
    data: [{ name: "Page 1" }, { name: "Page 2" }, { name: "Page 3" }]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selector = canvasElement.querySelector(
      "[data-test=page-dropdown] button"
    );
    console.log(selector);
    await selector.click(selector);
    await waitFor(
      () => {
        expect(canvas.getByTestId("page-dropdown")).toContainHTML(
          "Create Page"
        );
        expect(canvas.getByTestId("page-dropdown")).toContainHTML(
          "See all pages"
        );
        expect(canvas.getByTestId("page-dropdown")).toContainHTML("Page 1");
        expect(canvas.getByTestId("page-dropdown")).toContainHTML("Page 2");
        expect(canvas.getByTestId("page-dropdown")).toContainHTML("Page 3");
      },
      { timeout: 1000 }
    );
  }
};
// Open the Create Page
export const ClickInCreatePage = {
  args: {
    data: [{ name: "Page 1" }]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selector = canvasElement.querySelector(
      "[data-test=page-dropdown] button"
    );
    const selectorAddPage = canvasElement.querySelector("[data-test=add-page]");
    console.log(selectorAddPage);
    await selector.click(selector);
    await waitFor(
      () => {
        expect(canvas.getByTestId("page-dropdown")).toContainHTML(
          "Create Page"
        );
      },
      { timeout: 1000 }
    );
    await selectorAddPage.click(selectorAddPage);
  }
};
// Open the See all Pages
export const ClickInSeeAllPages = {
  args: {
    data: [{ name: "Page 1" }]
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const selector = canvasElement.querySelector(
      "[data-test=page-dropdown] button"
    );
    const selectorAddPage = canvasElement.querySelector(
      "[data-test=see-all-pages]"
    );
    console.log(selectorAddPage);
    await selector.click(selector);
    await waitFor(
      () => {
        expect(canvas.getByTestId("page-dropdown")).toContainHTML(
          "See all pages"
        );
      },
      { timeout: 1000 }
    );
    await selectorAddPage.click(selectorAddPage);
  }
};
