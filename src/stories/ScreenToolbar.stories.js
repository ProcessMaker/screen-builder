/* eslint-disable import/no-extraneous-dependencies */
import { within, userEvent, fireEvent, expect, waitFor } from "@storybook/test";
import "../bootstrap";
// b-tabs from bootstrap-vue
import ScreenToolbar from "../components/ScreenToolbar.vue";

const options = [
  {
    id: "group_design",
    type: "group",
    section: "left",
    items: [
      {
        id: "button_design",
        type: "button",
        title: "Design Screen",
        name: "Design",
        variant: "secondary",
        icon: "fas fa-drafting-compass pr-1",
        action: "changeMode(\"editor\")",
      },
      {
        id: "button_preview",
        type: "button",
        title: "Preview Screen",
        name: "Preview",
        variant: "outline-secondary",
        icon: "fas fa-cogs pr-1",
        action: "changeMode(\"preview\")",
      },
    ],
  },
  {
    id: "group_preview",
    type: "group",
    section: "left",
    displayCondition: "displayPreview",
    items: [
      {
        id: "button_preview_desktop",
        type: "button",
        title: "Preview Desktop",
        variant: "secondary",
        icon: "fas fa-desktop",
        action: "changeDeviceScreen(\"desktop\")",
      },
      {
        id: "button_preview_mobile",
        type: "button",
        title: "Preview Mobile",
        variant: "outline-secondary",
        icon: "fas fa-mobile pr-1",
        action: "changeDeviceScreen(\"mobile\")",
      },
    ],
  },
  {
    id: "group_properties",
    type: "group",
    section: "right",
    items: [
      {
        id: "button_calcs",
        type: "button",
        title: "Calculated Properties",
        name: "Calcs",
        variant: "secondary",
        icon: "fas fa-flask",
        action: "openComputedProperties()",
      },
      {
        id: "button_custom_css",
        type: "button",
        title: "Custom CSS",
        name: "CSS",
        variant: "secondary",
        icon: "fab fa-css3",
        action: "openCustomCSS()",
      },
      {
        id: "button_watchers",
        type: "button",
        title: "Watchers",
        name: "Watchers",
        variant: "secondary",
        icon: "fas fa-mask",
        action: "openWatchersPopup()",
      },
    ],
  },
  {
    id: "button_export",
    section: "right",
    type: "button",
    title: "Export Screen",
    name: "",
    variant: "secondary",
    icon: "fas fa-file-export",
    action: "beforeExportScreen()",
  },
  {
    id: "button_save",
    section: "right",
    type: "button",
    title: "Save Screen",
    name: "",
    variant: "secondary",
    icon: "fas fa-save",
    action: () => {
      ProcessMaker.EventBus.$emit("save-screen", false);
    },
  },
];

export default {
  title: "Components/ScreenToolbar",
  component: ScreenToolbar,
  tags: ["autodocs"],
  render: (args, { argTypes }) => ({
    props: Object.keys(argTypes),
    components: { Toolbar: ScreenToolbar },
    template: `
      <toolbar v-bind="$props">
        <b-btn
          variant="secondary"
          size="sm"
          class="mr-2"
          :title="$t('Load Screen')"
        >
          <i class="fas fa-upload mr-1" />
        </b-btn>
        <button
          type="button"
          class="btn btn-secondary btn-sm ml-1"
          :title="$t('Save Screen')"
          @click="saveToLocalStorage()"
        >
          <i class="fas fa-save" />
        </button>
      </toolbar>
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
  }),
  decorators: [
    () => ({
      template: `<div class="d-flex flex-row align-items-center border">
        <b-button-group size="sm" class="mx-2 text-nowrap">
          <b-button
            variant="secondary"
          >
            <i class="fas fa-drafting-compass pr-1" />{{ $t("Design") }}
          </b-button>
          <b-button
            variant="outline-secondary"
          >
            <i class="fas fa-cogs pr-1" />{{ $t("Preview") }}
          </b-button>
        </b-button-group>
        <story />
      </div>`
    })
  ]
};

/**
 * Stories of the component
 */
// Preview the component
export const Preview = {
  args: {
    options
  },
};
