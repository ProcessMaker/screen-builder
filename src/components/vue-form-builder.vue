<!-- eslint-disable vue/no-v-html -->
<!-- eslint-disable vue/valid-v-for -->
<template>
  <b-row class="custom-row h-100 m-0">
    <!-- Controls -->
    <b-col class="overflow-hidden h-100 p-0 controls-column">
      <b-card
        no-body
        class="h-100 rounded-0 border-top-0 border-bottom-0 border-left-0"
      >
        <b-input-group size="sm" style="height: 42px">
          <b-input-group-prepend>
            <span
              class="input-group-text rounded-0 border-left-0 border-top-0 border-bottom-0"
            >
              <i class="fas fa-search icon"></i>
            </span>
          </b-input-group-prepend>
          <b-form-input
            v-model="filterQuery"
            class="border-0 rounded-0"
            type="text"
            size="lg"
            style="height: 42px"
            :placeholder="$t('Search Here')"
          >
          </b-form-input>
        </b-input-group>

        <b-card-body no-body class="p-0 overflow-auto">
          <!-- Accordion Bootstrap -->
          <template
            v-for="({ name, elements }, index) in filteredControlsGrouped"
          >
            <b-button
              class="w-100 rounded-0 text-left"
              :aria-controls="`collapse-${index + 1}`"
              style="
                font-size: smaller;
                height: 42px;
                color: grey;
                border-color: rgb(224, 224, 224);
                background-color: rgb(235, 238, 242);
              "
              @click="toggleCollapse(index)"
            >
              <strong>{{ $t(name) }}</strong>
              <b-icon
                :icon="isCollapsed(index) ? 'chevron-down' : 'chevron-up'"
                class="float-right"
              />
            </b-button>
            <b-collapse v-model="collapse[index]" class="mt-2">
              <b-list-group>
                <draggable
                  v-if="renderControls"
                  id="controls"
                  v-model="filteredControlsGrouped[index].elements"
                  data-cy="controls"
                  v-bind="{
                    sort: false,
                    group: { name: 'controls', pull: 'clone', put: false }
                  }"
                  :clone="cloneControl"
                  class="controls list-group w-auto list-group-flush"
                >
                  <b-list-group-item
                    v-for="(element, elementIndex) in elements"
                    :key="elementIndex"
                    v-b-popover.hover.right="{
                      content: $t(element.popoverContent),
                      customClass: 'custom-popover',
                      boundaryPadding: 16
                    }"
                    :boundary="'viewport'"
                    :data-cy="`controls-${element.component}`"
                    class="gray-text"
                  >
                    <i
                      v-if="element.config && element.config.icon"
                      :class="element.config.icon"
                    />
                    <span
                      class="svg-icon"
                      style="width: 12px; height: 12px"
                      v-html="element.config.svg"
                    ></span>
                    {{ $t(element.label) }}
                  </b-list-group-item>
                </draggable>
              </b-list-group>
            </b-collapse>
          </template>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Renderer -->
    <b-col
      id="screen-container"
      ref="screen-container"
      class="overflow-auto mh-100 p-0 d-flex flex-column position-relative"
    >
      <tabs-bar
        ref="tabsBar"
        :pages="config"
        :is-multi-page="showToolbar"
        @tab-opened="currentPage = $event"
      >
        <template #tabs-start>
          <pages-dropdown
            v-if="showToolbar"
            :data="sortedPages"
            @addPage="$bvModal.show('addPageModal')"
            @clickPage="onClick"
            @seeAllPages="$bvModal.show('openSortable')"
          />
        </template>
        <template #default="{ currentPage: tabPage }">
          <div
            v-if="isCurrentPageEmpty(tabPage)"
            data-cy="screen-drop-zone"
            class="d-flex justify-content-center align-items-center drag-placeholder text-center position-absolute rounded mt-4 flex-column"
          >
            <svg
              width="81"
              height="107"
              viewBox="0 0 81 107"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M47.125 28.6562V0.5H5.71875C2.96523 0.5 0.75 2.71523 0.75 5.46875V101.531C0.75 104.285 2.96523 106.5 5.71875 106.5H75.2812C78.0348 106.5 80.25 104.285 80.25 101.531V33.625H52.0938C49.3609 33.625 47.125 31.3891 47.125 28.6562ZM60.375 77.5156C60.375 78.882 59.257 80 57.8906 80H23.1094C21.743 80 20.625 78.882 20.625 77.5156V75.8594C20.625 74.493 21.743 73.375 23.1094 73.375H57.8906C59.257 73.375 60.375 74.493 60.375 75.8594V77.5156ZM60.375 64.2656C60.375 65.632 59.257 66.75 57.8906 66.75H23.1094C21.743 66.75 20.625 65.632 20.625 64.2656V62.6094C20.625 61.243 21.743 60.125 23.1094 60.125H57.8906C59.257 60.125 60.375 61.243 60.375 62.6094V64.2656ZM60.375 49.3594V51.0156C60.375 52.382 59.257 53.5 57.8906 53.5H23.1094C21.743 53.5 20.625 52.382 20.625 51.0156V49.3594C20.625 47.993 21.743 46.875 23.1094 46.875H57.8906C59.257 46.875 60.375 47.993 60.375 49.3594ZM80.25 25.7371V27H53.75V0.5H55.0129C56.3379 0.5 57.6008 1.01758 58.5324 1.94922L78.8008 22.2383C79.7324 23.1699 80.25 24.4328 80.25 25.7371Z"
                fill="#699CFF"
              />
            </svg>
            <h3>{{ $t("Place your controls here.") }}</h3>
            <p>
              {{
                $t(
                  "To begin creating a screen, drag and drop items from the Controls Menu on the left."
                )
              }}
            </p>
            <!-- {{ $t("Drag an element here") }} -->
          </div>

          <draggable
            v-if="renderControls"
            :key="editorContentKey"
            data-cy="editor-content"
            class="h-100"
            ghost-class="form-control-ghost"
            :value="config[tabPage].items"
            v-bind="{
              group: { name: 'controls' },
              swapThreshold: 0.5
            }"
            @input="updateConfig"
          >
            <div
              v-for="(element, index) in config[tabPage].items"
              :key="index"
              class="control-item mt-4 mb-4"
              :class="{
                selected: selected === element,
                hasError: hasError(element)
              }"
              :selector="element.config.customCssSelector"
              @click="inspect(element)"
            >
              <div
                v-if="element.container"
                class="card container-lement"
                :class="{ 'ai-section-card': isAiSection(element) }"
                data-cy="screen-element-container"
                @click="inspect(element)"
              >
                <div
                  v-if="selected === element"
                  class="card-header form-element-header d-flex align-items-center"
                  :class="{ pulse: isAiSection(element) && aiPreview(element) }"
                >
                  <i class="fas fa-arrows-alt-v mr-1 text-muted" />
                  <i
                    v-if="element.config.icon"
                    :class="element.config.icon"
                    class="mr-2 ml-1"
                  />
                  {{ element.config.name || element.label || $t("Field Name") }}
                  <div class="ml-auto">
                    <button
                      v-if="isAiSection(element) && aiPreview(element)"
                      data-test="apply-ai-btn"
                      class="btn btn-sm btn-primary mr-2"
                      :title="$t('Apply Changes')"
                      @click="applyAiChanges(element)"
                    >
                      {{ $t("Apply Changes") }}
                    </button>
                    <button
                      v-if="!(isAiSection(element) && aiPreview(element))"
                      data-test="copy-control-btn"
                      class="btn btn-sm btn-secondary mr-2"
                      :title="$t('Copy Control')"
                      @click="duplicateItem(index)"
                    >
                      <i class="fas fa-copy text-light" />
                    </button>
                    <button
                      data-test="delete-control-btn"
                      class="btn btn-sm btn-danger"
                      :title="$t('Delete Control')"
                      @click="deleteItem(index)"
                    >
                      <i class="far fa-trash-alt text-light" />
                    </button>
                  </div>
                </div>
                <component
                  :is="element['editor-component']"
                  v-model="element.items"
                  :validation-errors="validationErrors"
                  class="card-body"
                  :class="elementCssClass(element)"
                  :selected="selected"
                  :config="element.config"
                  :ai-element="element"
                  @inspect="inspect"
                  @update-state="updateState"
                />
              </div>

              <div v-else class="card" data-cy="screen-element-container">
                <div
                  v-if="selected === element"
                  class="card-header form-element-header d-flex align-items-center"
                >
                  <i class="fas fa-arrows-alt-v mr-1 text-muted" />
                  <i
                    v-if="element.config.icon"
                    :class="element.config.icon"
                    class="mr-2 ml-1"
                  />
                  {{ element.config.name || $t("Variable Name") }}
                  <div class="ml-auto">
                    <button
                      class="btn btn-sm btn-secondary mr-2"
                      :title="$t('Copy Control')"
                      @click="duplicateItem(index)"
                    >
                      <i class="fas fa-copy text-light" />
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      :title="$t('Delete Control')"
                      @click="deleteItem(index)"
                    >
                      <i class="far fa-trash-alt text-light" />
                    </button>
                  </div>
                </div>
                <component
                  v-bind="element.config"
                  :is="element['editor-component']"
                  :tabindex="element.config.interactive ? 0 : -1"
                  class="card-body m-0 pb-4 pt-4"
                  :class="[
                    elementCssClass(element),
                    { 'prevent-interaction': !element.config.interactive }
                  ]"
                  @input="
                    element.config.interactive
                      ? (element.config.content = $event)
                      : null
                  "
                  @focusout.native="updateState"
                />
              </div>
            </div>
          </draggable>

          <div v-if="!isCurrentPageEmpty(tabPage)" data-cy="screen-drop-zone">
            &nbsp;
          </div>
        </template>
      </tabs-bar>
    </b-col>

    <!-- Inspector -->
    <b-col
      v-if="renderControls"
      class="overflow-hidden h-100 p-0 inspector-column"
    >
      <b-card
        no-body
        class="p-0 h-100 border-top-0 border-bottom-0 border-right-0 rounded-0"
      >
        <b-card-body class="p-0 h-100 overflow-auto">
          <template v-for="accordion in accordions">
            <b-button
              v-if="
                getInspectorFields(accordion) &&
                getInspectorFields(accordion).length > 0
              "
              :key="`${accordionName(accordion)}-button`"
              variant="outline"
              class="text-left card-header d-flex align-items-center w-100 outline-0 text-capitalize shadow-none"
              :data-cy="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :accordion-name="`accordion-${accordionName(accordion).replace(
                ' ',
                ''
              )}`"
              :is-open="accordion.open ? '1' : '0'"
              @click="toggleAccordion(accordion)"
            >
              <i class="fas fa-cog mr-2" />
              {{ $t(accordionName(accordion)) }}
              <i
                class="fas fa-angle-down ml-auto"
                :class="{ 'fas fa-angle-right': !accordion.open }"
              />
            </b-button>
            <b-collapse
              :id="accordionName(accordion)"
              :key="`${accordionName(accordion)}-collapse`"
              v-model="accordion.open"
            >
              <component
                :is="item.type"
                v-for="(item, index) in getInspectorFields(accordion)"
                :key="index"
                v-model="inspection.config[item.field]"
                :data-cy="'inspector-' + (item.field || item.config.name)"
                v-bind="item.config"
                :field-name="item.field"
                :field-accordion="`accordion-${accordionName(accordion).replace(
                  ' ',
                  ''
                )}`"
                :builder="builder"
                :form-config="config"
                :screen-type="screenType"
                :current-page="currentPage"
                :selected-control="selected"
                class="border-bottom m-0 p-4"
                @focusout.native="updateState"
                @update-state="updateState"
                @setName="inspection.config.name = $event"
              />
            </b-collapse>
          </template>
        </b-card-body>
      </b-card>
    </b-col>

    <!-- Modals -->
    <b-modal
      id="openSortable"
      ref="openSortable"
      header-close-content="&times;"
      role="dialog"
      size="lg"
      :title="$t('Edit Pages')"
      :ok-title="$t('DONE')"
      ok-only
      ok-variant="secondary"
      header-class="modal-header-custom"
    >
      <template #modal-title>
        <h5 class="modal-title">{{ $t('Edit Pages') }}</h5>
        <span class="modal-subtitle">{{ $t('Change pages order and name') }}</span>
      </template>
      <template #modal-header-close="{ close }">
        <button type="button" aria-label="Close" class="close">×</button>
      </template>

      <Sortable
        :fields="fields"
        :items="config"
        filter-key="name"
        @item-edit="() => {}"
        @item-delete="confirmDelete"
        @add-page="$bvModal.show('addPageModal')"
      />
    </b-modal>

    <b-modal
      id="addPageModal"
      ref="addPageModal"
      header-class="pb-2"
      size="lg"
      :ok-title="$t('SAVE')"
      :cancel-title="$t('CANCEL')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
      data-cy="add-page-modal"
      :ok-disabled="!addPageName || !!checkPageName(addPageName)"
      @ok="addPage"
      @show="addPageName = ''; showAddPageValidations=false;"
    >
      <template #modal-title>
        <h5 class="modal-title">{{ $t('Create New Page') }}</h5>
        <small class="modal-subtitle mb-n2">{{ $t('Create a new page in your screen') }}</small>
      </template>
      <form-input
        ref="addPageInput"
        v-model="addPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The name of the new page to add')"
        :error="checkPageName(addPageName)"
        data-cy="add-page-name"
        aria-required="true"
      />
    </b-modal>

    <b-modal
      ref="editPageModal"
      :title="$t('Edit Page Title')"
      :ok-title="$t('Save')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
      @ok="editPage"
    >
      <required />
      <form-input
        ref="editPageInput"
        v-model="editPageName"
        :name="$t('Page Name')"
        :label="$t('Page Name') + ' *'"
        :helper="$t('The new name of the page')"
        validation="required"
        :error="checkPageName(editPageName)"
        required
        aria-required="true"
      />
    </b-modal>

    <b-modal
      ref="confirm"
      :title="$t('Caution!')"
      :ok-title="$t('Delete')"
      :cancel-title="$t('Cancel')"
      cancel-variant="btn btn-outline-secondary"
      ok-variant="btn btn-secondary ml-2"
      header-close-content="&times;"
      @ok="deletePage"
      @cancel="hideConfirmModal"
    >
      <p>{{ confirmMessage }}</p>
      <div slot="modal-ok">{{ $t("Delete") }}</div>
    </b-modal>
  </b-row>
</template>

<script>
import draggable from "vuedraggable";
import _ from "lodash";
import {
  FormInput,
  FormSelectList,
  FormTextArea,
  FormCheckbox,
  FormDatePicker,
  FormHtmlEditor,
  FormHtmlViewer
} from "@processmaker/vue-form-elements";
import Validator from "@chantouchsek/validatorjs";
import HasColorProperty from "../mixins/HasColorProperty";
import * as renderer from "./renderer";
import * as inspector from "./inspector";
import "@processmaker/vue-form-elements/dist/vue-form-elements.css";
import accordions from "./accordions";
import { keyNameProperty } from "../form-control-common-properties";
import VariableNameGenerator from "@/components/VariableNameGenerator";
import PagesDropdown from "@/components/editor/pagesDropdown";
import testing from "@/mixins/testing";
import defaultValueEditor from "./inspector/default-value-editor";
import RequiredCheckbox from "./utils/required-checkbox";
import MultipleUploadsCheckbox from "./utils/multiple-uploads-checkbox";
import { formTypes } from "@/global-properties";
import TabsBar from "./TabsBar.vue";
import Sortable from './sortable/Sortable.vue';

// To include another language in the Validator with variable processmaker
const globalObject = typeof window === "undefined" ? global : window;

if (
  globalObject.ProcessMaker &&
  globalObject.ProcessMaker.user &&
  globalObject.ProcessMaker.user.lang
) {
  Validator.useLang(globalObject.ProcessMaker.user.lang);
}

// Todo: Validation messages are not translated. These will need to be converted
// to Validator.registerAsync() in order to get the $t translator.
// Should also probably be converted to a mixin. These changes would then
// require modifications to to App.vue and PM4 Core implementations
Validator.register(
  "columns-adds-to-12",
  (value) => {
    const sum = value.reduce((total, options) => {
      return total + parseInt(options.content);
    }, 0);

    if (sum === 12) {
      return true;
    }
    return false;
  },
  "Columns must add to 12"
);

const defaultConfig = [
  {
    name: "Default",
    items: []
  }
];

const defaultGroupOrder = {
  "Input Fields" : 1.0,
  "Content Fields" : 2.0,
  "Dashboards" : 2.5,
  "Navigation" : 3.0,
  "Files" : 4.0,
  "Advanced" : 5.0,
};

const DEFAULT_GROUP = "Advanced";

export default {
  components: {
    TabsBar,
    draggable,
    FormInput,
    FormSelectList,
    FormCheckbox,
    FormTextArea,
    FormDatePicker,
    FormHtmlEditor,
    FormHtmlViewer,
    RequiredCheckbox,
    MultipleUploadsCheckbox,
    defaultValueEditor,
    ...inspector,
    ...renderer,
    PagesDropdown,
    Sortable,
  },
  mixins: [HasColorProperty, testing],
  props: {
    renderControls: {
      type: Boolean,
      default: true
    },
    validationErrors: {
      type: Array
    },
    initialConfig: {
      type: Array
    },
    title: {
      type: String
    },
    screenType: {
      type: String,
      default: formTypes.form
    },
    screen: {
      type: Object
    },
    processId: {
      default: 0
    }
  },
  data() {
    const config = this.initialConfig || defaultConfig;
    this.migrateConfig(config);
    const generator = new VariableNameGenerator();
    const variables = generator.GetVariableNames(config);

    if (this.title && config[0].name === "Default") {
      config[0].name = this.title;
    }

    return {
      showAddPageValidations: false,
      openedPages: [0],
      currentPage: 0,
      selected: null,
      display: "editor",
      inspection: {},
      // Blank at start, assume the parent component will call addControl for each control
      controls: [],
      pageAddModal: false,
      addPageName: "",
      editPageIndex: null,
      editPageName: "",
      originalPageName: null,
      fields: [
        {
          label: this.$t("Name"),
          key: "name",
        },
      ],
      config,
      confirmMessage: "",
      pageDelete: 0,
      translated: [],
      showAssignment: false,
      showVariable: false,
      showDesign: false,
      filterQuery: "",
      accordions,
      variables,
      generator,
      variablesTree: [],
      language: "en",
      collator: null,
      editorContentKey: 0,
      cancelledJobs: [],
      collapse: {},
      groupOrder: {}
    };
  },
  computed: {
    sortedPages() {
      return [...this.config].sort((a, b) => a.order - b.order);
    },
    builder() {
      return this;
    },
    displayDelete() {
      return this.config.length > 1;
    },
    filteredControls() {

      const excludedLabels = [""];

      const filtered = this.controls.filter((control) => {
        return control.label
          .toLowerCase()
          .includes(this.filterQuery.toLowerCase());
      });

      return filtered;
    },
    filteredControlsGrouped() {
      const grouped = this.filteredControls.reduce((groups, control) => {
        let groupName = _.get(control, 'group', null);

        if (!groupName) {
          groupName = DEFAULT_GROUP;
        }

        let existingGroupIndex = groups.findIndex((group) => {
          return group.name === groupName;
        });

        if (existingGroupIndex === -1) {
          groups.push({
            name: groupName,
            order: this.getGroupOrder(groupName),
            elements: []
          });
          existingGroupIndex = groups.length - 1;
        }

        groups[existingGroupIndex].elements.push(control);
        return groups;
      }, []);

      // Sort the groups
      grouped.sort((a, b) => a.order - b.order);

      // Sort the elements in each group
      grouped.forEach((_, index) => {
        grouped[index].elements.sort((a, b) => {
          const orderA =
            a.order !== undefined ? a.order : Number.POSITIVE_INFINITY;
          const orderB =
            b.order !== undefined ? b.order : Number.POSITIVE_INFINITY;
          return orderA - orderB;
        });
      });

      return grouped;
    },
    showToolbar() {
      return this.screenType === formTypes.form;
    }
  },
  watch: {
    config: {
      handler() {
        this.checkForCaptchaInLoops();
        this.$emit("change", this.config);
      },
      deep: true
    },
    currentPage() {
      this.inspect();
    },
    inspection(e) {
      if (this.translated.includes(e)) {
        // already translated, don't translate again!
        return;
      }
      for (const i in e.inspector) {
        e.inspector[i].config.label = this.$t(e.inspector[i].config.label);
        e.inspector[i].config.helper = this.$t(e.inspector[i].config.helper);
        if (e.inspector[i].config.options) {
          for (const io in e.inspector[i].config.options) {
            e.inspector[i].config.options[io].content = this.$t(
              e.inspector[i].config.options[io].content
            );
          }
        }
      }
      this.translated.push(e);
    },
    controls() {
      if (
        this.processId !== 0 &&
        this.processId !== undefined &&
        !this.config[this.currentPage].items.length
      ) {
        this.addDefaultAiControl();
      }
    }
  },
  created() {
    this.$store.dispatch("undoRedoModule/pushState", {
      config: JSON.stringify(this.config),
      currentPage: this.currentPage
    });
    this.initiateLanguageSupport();
  },
  mounted() {
    if (
      !localStorage.getItem("cancelledJobs") ||
      localStorage.getItem("cancelledJobs") === "null"
    ) {
      this.cancelledJobs = [];
    } else {
      this.cancelledJobs = JSON.parse(localStorage.getItem("cancelledJobs"));
    }

    this.checkForCaptchaInLoops();

    this.$root.$on("nested-screen-updated", () => {
      this.checkForCaptchaInLoops();
    });
    this.$root.$on("ai-form-generated", (formItems, nonce) => {
      this.previewAiChanges(formItems, nonce);
    });
    this.$root.$on("apply-ai-changes", (element) => {
      this.applyAiChanges(element);
    });
    this.$root.$on("ai-form-progress-updated", (progress, nonce) => {
      this.updateProgress(progress, nonce);
    });
    this.setGroupOrder(defaultGroupOrder);
  },
  methods: {
    isCurrentPageEmpty(currentPage) {
      return this.config[currentPage]?.items?.length === 0;
    },
    onClick(page) {
      this.$refs.tabsBar.openPageByIndex(this.config.indexOf(page));
    },
    checkPageName(value, force = false) {
      if (!force && !this.showAddPageValidations) {
        return null;
      }
      if (!value.trim()) {
        return this.$t("The Page Name field is required.");
      }
      const pageNames = this.config
        .map((config) => config.name)
        .filter((name) => name !== this.originalPageName);
      return pageNames.includes(value) ? this.$t("Must be unique.") : "";
    },
    getGroupOrder(groupName) {
      let order = _.get(this.groupOrder, groupName, Number.POSITIVE_INFINITY);
      return order;
    },
    setGroupOrder(orderConfig) {
      this.groupOrder = { ...this.groupOrder, ...orderConfig };
    },
    toggleCollapse(index) {
      if (this.collapse[index] && this.collapse[index] === true) {
        this.collapse[index] = false;
      } else {
        this.collapse[index] = true;
      }
    },
    isCollapsed(index) {
      return this.collapse[index];
    },
    refreshContent() {
      this.editorContentKey++;
    },
    checkForCaptchaInLoops() {
      this.config.forEach((page) => {
        this.checkForCaptcha(page.items);
      });
    },
    checkForCaptcha(items, insideLoop = false, nestedScreen = null) {
      items.forEach((item) => {
        if (!item.items && item.component === "Captcha" && insideLoop) {
          if (nestedScreen && nestedScreen.config.screen) {
            this.$root.$emit("remove-nested", nestedScreen.config.screen);
            nestedScreen.config.screen = null;
            globalObject.ProcessMaker.alert(
              this.$t(
                // eslint-disable-next-line max-len
                "You are trying to place a nested screen within CAPTCHA elements inside a loop. CAPTCHA controls cannot be placed within a Loop control."
              ),
              "danger"
            );
          } else {
            items.splice(items.indexOf(item), 1);
            globalObject.ProcessMaker.alert(
              this.$t(
                "CAPTCHA controls cannot be placed within a Loop control."
              ),
              "danger"
            );
          }
        }
        if (item.items) {
          this.checkForCaptcha(item.items, true, nestedScreen);
        }
        if (
          item.component === "FormNestedScreen" &&
          item.config.screen &&
          window.nestedScreens
        ) {
          const nestedScreenItems =
            window.nestedScreens[`id_${item.config.screen}`];
          if (nestedScreenItems) {
            nestedScreenItems.forEach((nestedScreenPage) => {
              this.checkForCaptcha(nestedScreenPage.items, insideLoop, item);
            });
          }
        }
      });
    },
    loadVariablesTree() {
      const definition = {
        config: this.$parent.config,
        computed: this.$parent.computed,
        customCSS: this.$parent.customCSS,
        watchers: this.$parent.watchers
      };
      this.variablesTree =
        this.$refs.treeOfVariables.getVariablesTree(definition);
      this.$refs.treeOfVariables.getVariablesTree({ config: [] });
    },
    accordionName(accordion) {
      return accordion.name instanceof Function
        ? accordion.name(this.inspection)
        : accordion.name;
    },
    toggleAccordion(accordion) {
      this.accordions.forEach((panel) => {
        if (panel !== accordion) {
          panel.open = false;
        }
      });
      accordion.open = !accordion.open;
    },
    openAccordion(accordion) {
      this.accordions.forEach((panel) => {
        panel.open = false;
      });
      accordion.open = true;
    },
    migrateConfig(config = this.config) {
      config.forEach((page) => this.replaceFormText(page.items));
      config.forEach((page) => this.migrateFormSubmit(page.items));
      config.forEach((page) => this.updateFieldNameValidation(page.items));
      this.updatePageOrder(config);
      config.forEach((page) =>
        this.removeDataVariableFromNestedScreens(page.items)
      );
      // add order attribute
      config.forEach((page, index) => {
        page.order = page.order || index + 1;
      });
    },
    updatePageOrder(pages) {
      const clone = [...pages];
      clone.sort((a, b) => {
        const aOrder = a.order || pages.indexOf(a) + 1;
        const bOrder = b.order || pages.indexOf(b) + 1;
        return aOrder - bOrder;
      });
      clone.forEach((item, index) => {
        // eslint-disable-next-line no-param-reassign
        item.order = index + 1;
      });
    },
    updateFieldNameValidation(items) {
      items.forEach((item) => {
        if (item.inspector) {
          item.inspector.forEach((inspector) => {
            if (
              inspector.field === "name" &&
              "validation" in inspector.config &&
              inspector.config.name !== "DataVariable" &&
              item.component !== "FileUpload" &&
              item.component !== "FormButton"
            ) {
              inspector.config.validation = keyNameProperty.config.validation;
            }
          });
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    removeDataVariableFromNestedScreens(items) {
      items.forEach((item) => {
        if (item.inspector) {
          const hasDataVariable = item.inspector.find(
            (inspector) => inspector.config.name === "DataVariable"
          );
          item.inspector = item.inspector.filter(
            (inspector) => inspector.config.name !== "DataVariable"
          );
          if (hasDataVariable) {
            delete item.config.name;
          }
        }
      });
    },
    replaceFormText(items) {
      items.forEach((item) => {
        if (item.component === "FormText") {
          item.component = "FormHtmlEditor";
          item["editor-component"] = "FormHtmlEditor";
          const style =
            (item.config.fontSize
              ? `font-size: ${item.config.fontSize};`
              : "") +
            (item.config.fontWeight
              ? `font-weight: ${item.config.fontWeight};`
              : "") +
            (item.config.textAlign
              ? `text-align: ${item.config.textAlign};`
              : "");
          item.config = {
            content:
              "<div style=\"" + style + "\">" + item.config.label + "</div>",
            interactive: true
          };
        }
        if (item.items instanceof Array) {
          this.replaceFormText(item.items);
        }
      });
    },
    migrateFormSubmit(items) {
      items.forEach((item) => {
        if (item["editor-control"] !== "FormSubmit") {
          item["editor-control"] = item["editor-component"];
        }

        if (item.config.event === "submit") {
          if (item["editor-component"] === "FormNestedScreen") {
            // Old nested screens erroneously had an event key. Remove it here
            // and set the editor-control back to FormNestedScreen.
            delete item.config.event;
            item["editor-control"] = "FormNestedScreen";
            item.config.name = "Nested Screen";
          } else if (item["editor-control"] !== "FormImage") {
            item["editor-control"] = "FormSubmit";
          }
        }
        if (item.config.event === "pageNavigate") {
          item["editor-control"] = "PageNavigation";
        }
        if (
          item.items instanceof Array &&
          item.component === "FormMultiColumn"
        ) {
          item["editor-control"] = "FormMultiColumn";
          item.items.forEach((column) => this.migrateFormSubmit(column));
        }
      });
    },
    getAllAccordionizedFields() {
      if (this._allAccordionizedFields) {
        return this._allAccordionizedFields;
      }
      this._allAccordionizedFields = this.accordions.flatMap((accordion) => {
        return accordion.fields.map((fieldName) => {
          if (typeof fieldName === "string") {
            return fieldName;
          }
          return fieldName.name;
        });
      });
      return this._allAccordionizedFields;
    },
    knownField(field) {
      return this.getAllAccordionizedFields().includes(field);
    },
    getInspectorFields(accordion) {
      if (!this.inspection.inspector) {
        return [];
      }

      const accordionFields = accordion.fields
        .filter((field) => {
          if (typeof field !== "string") {
            const { component } = this.inspection;
            const { showFor, hideFor } = field;

            if (showFor) {
              return showFor === component;
            }

            if (hideFor) {
              return hideFor !== component;
            }
          }

          return true;
        })
        .map((field) => {
          if (typeof field !== "string") {
            return field.name;
          }

          return field;
        });
      const control = this.controls.find(
        (control) =>
          control["editor-control"] === this.inspection["editor-control"]
      ) ||
        this.controls.find(
          (control) => control.component === this.inspection.component
        ) || { inspector: [] };
      return control.inspector.filter((input) => {
        if (accordionFields.includes(input.field)) {
          return true;
        }
        if (
          !this.knownField(input.field) &&
          accordion.name === "Configuration"
        ) {
          // If it's not a known inspector field from accordion.js and this is the
          // configuration accordion, then add it here
          return true;
        }
        return false;
      });
    },
    updateState() {
      this.$store.dispatch("undoRedoModule/pushState", {
        config: JSON.stringify(this.config),
        currentPage: this.currentPage
      });
    },
    async undo() {
      this.inspect();
      this.$store.dispatch("undoRedoModule/undo");
      this.config = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].config
      );
      await this.$nextTick();
      this.$refs.tabsBar.openPageByIndex(
        this.$store.getters["undoRedoModule/currentState"].currentPage
      );
    },
    async redo() {
      this.inspect();
      this.$store.dispatch("undoRedoModule/redo");
      this.config = JSON.parse(
        this.$store.getters["undoRedoModule/currentState"].config
      );
      await this.$nextTick();
      this.$refs.tabsBar.openPageByIndex(
        this.$store.getters["undoRedoModule/currentState"].currentPage
      );
    },
    updateConfig(items) {
      this.config[this.currentPage].items = items;
      this.updateState();
    },
    hasError(element) {
      return this.validationErrors.some(({ item }) => item === element);
    },
    focusInspector(validation) {
      this.showConfiguration = true;
      this.$refs.tabsBar.openPageByIndex(this.config.indexOf(validation.page));
      this.$nextTick(() => {
        this.inspect(validation.item);
        this.$nextTick(() => {
          const field = this.$el.querySelector(
            `[field-name="${validation.field}"]`
          );
          if (field) {
            const accordion = this.$el.querySelector(
              `[accordion-name="${field.getAttribute("field-accordion")}"]`
            );
            accordion &&
              accordion.getAttribute("is-open") === "0" &&
              accordion.click();
            field.focus instanceof Function && field.focus();
          }
        });
      });
    },
    confirmDelete(item = this.config[this.currentPage]) {
      this.confirmMessage = this.$t(
        "Are you sure you want to delete {{item}}?",
        { item: item.name }
      );
      const isLastPage = this.config.length === 1;
      if (isLastPage) {
        // can not delete the last page
        return;
      }
      this.pageDelete = this.config.indexOf(item);
      this.$refs.confirm.show();
    },
    hideConfirmModal() {
      this.$refs.confirm.hide();
    },
    addControl(control) {
      this.controls.push(control);
    },
    deleteItem(index) {
      // Remove the item from the array in currentPage
      this.config[this.currentPage].items.splice(index, 1);
      this.inspection.inspector.splice(0, this.inspection.inspector.length);
      this.updateState();
    },
    duplicateItem(index) {
      const duplicate = _.cloneDeep(this.config[this.currentPage].items[index]);
      this.config[this.currentPage].items.push(duplicate);
    },
    openEditPageModal(index) {
      this.editPageIndex = index;
      const pageName = this.config[index].name;
      this.originalPageName = pageName;
      this.editPageName = pageName;
      this.$refs.editPageModal.show();
    },
    editPage(e) {
      if (this.$refs.editPageInput.validator.errorCount) {
        e.preventDefault();
        return;
      }
      this.config[this.editPageIndex].name = this.editPageName;
      this.updateState();
    },
    addPage(e) {
      const error = this.checkPageName(this.addPageName, true);
      if (error) {
        this.showAddPageValidations = true;
        e.preventDefault();
        return;
      }

      const maxOrder = this.config.reduce((max, page) => {
        return page.order > max ? page.order : max;
      }, 0);

      this.config.push({
        name: this.addPageName,
        order: maxOrder + 1,
        items: []
      });
      this.addPageName = "";
      this.currentPage = this.config.length - 1;
      this.updateState();

      // open new page
      this.$refs.tabsBar.openPageByIndex(this.config.length - 1);
    },
    // This function is used to calculate the new index of the references
    calcNewIndexFor(index, referencedBy) {
      if (index === this.pageDelete) {
        throw new Error(
          `${this.$t(
            "Can not delete this page, it is referenced by"
          )}: ${referencedBy}`
        );
      }
      return index > this.pageDelete ? index - 1 : index;
    },
    // Update Record list references
    updateRecordListReferences() {
      this.config.forEach((page) => {
        page.items.forEach((item) => {
          if (item.component === "FormRecordList") {
            // eslint-disable-next-line no-param-reassign
            item.config.form = this.calcNewIndexFor(
              item.config.form * 1,
              item.config.label
            );
          }
        });
      });
    },
    // Update navigation buttons references
    updateNavigationButtonsReferences() {
      this.config.forEach((page) => {
        page.items.forEach((item) => {
          if (
            item.component === "FormButton" &&
            item.config.event === "pageNavigate"
          ) {
            // eslint-disable-next-line no-param-reassign
            item.config.eventData = this.calcNewIndexFor(
              item.config.eventData * 1,
              item.config.label
            );
          }
        });
      });
    },
    async deletePage() {
      const back = _.cloneDeep(this.config);
      try {
        this.updateRecordListReferences();
        this.updateNavigationButtonsReferences();
        this.$refs.tabsBar.closePageByIndex(this.pageDelete);
        this.$refs.tabsBar.updateTabsReferences(this.pageDelete);
        await this.$nextTick();
        this.config.splice(this.pageDelete, 1);
      } catch (error) {
        this.config = back;
        globalObject.ProcessMaker.alert(error.message, "danger");
        return;
      }
      this.updatePageOrder(this.config);
      this.$store.dispatch("undoRedoModule/pushState", {
        config: JSON.stringify(this.config),
        currentPage: this.currentPage,
        deletedPage: true
      });
    },
    inspect(element = {}) {
      this.inspection = element;
      this.selected = element;
      const defaultAccordion = this.accordions.find(
        (accordion) => this.getInspectorFields(accordion).length > 0
      );
      if (defaultAccordion) {
        this.openAccordion(defaultAccordion);
      }
    },
    // Cloning the control will ensure the config is not a copy of the observable but a plain javascript object
    // This will ensure each control in the editor has it's own config and it's not shared
    cloneControl(control) {
      const copy = {
        config: JSON.parse(JSON.stringify(control.config)),
        inspector: JSON.parse(JSON.stringify(control.inspector)),
        component: control.component,
        "editor-component": control["editor-component"],
        "editor-control": control["editor-control"],
        label: control.label,
        value: control.value
      };
      if (control.component === "FormDatePicker" && copy.config.phrases) {
        copy.config.phrases.ok = this.$t(copy.config.phrases.ok);
        copy.config.phrases.cancel = this.$t(copy.config.phrases.cancel);
      }
      copy.config.label = this.$t(copy.config.label);
      if (Array.isArray(copy.config.options)) {
        for (const io in copy.config.options) {
          copy.config.options[io].content = this.$t(
            copy.config.options[io].content
          );
        }
      }

      // If it's a container, let's add an items property, with the default of items in the control
      if (control.container) {
        copy.items = JSON.parse(JSON.stringify(control.items));
        copy.container = true;
      }

      // Generate Variable Name
      if (
        _.findIndex(control.inspector, keyNameProperty) !== -1 ||
        control.component === "FormLoop"
      ) {
        [this.variables, copy.config.name] = this.generator.generate(
          this.config,
          copy["editor-control"] ? copy["editor-control"] : copy.component
        );
        if (_.has(copy, "config.settings.varname")) {
          copy.config.settings.varname = copy.config.name;
        }
      }

      return copy;
    },
    initiateLanguageSupport() {
      if (document.documentElement.lang) {
        this.language = document.documentElement.lang;
      }
      this.collator = Intl.Collator(this.language);
    },
    isAiSection(element) {
      return element.component === "AiSection";
    },
    aiPreview(element) {
      return element.items && element.items[0] && element.items[0].length;
    },
    previewAiChanges(formItems, nonce) {
      this.config.forEach((page, pageKey) => {
        page.items.forEach((item, itemKey) => {
          if (
            item.component === "AiSection" &&
            nonce === item.config.aiConfig.nonce
          ) {
            this.$set(item, "items", JSON.parse(JSON.stringify(formItems)));
          }
        });
      });
    },
    applyAiChanges(element) {
      element.component = "FormMultiColumn";
      element.label = "Multicolumn / Table";
      element["editor-control"] = "MultiColumn";
      element["editor-component"] = "MultiColumn";
      element.inspector = [
        {
          type: "ContainerColumns",
          field: "options",
          config: {
            label: "Column Width",
            validation: "columns-adds-to-12"
          }
        }
      ];
      element.config = {
        icon: "fas fa-table",
        options: [
          {
            value: "1",
            content: "12"
          }
        ]
      };
    },
    updateProgress(progress, nonce) {
      this.config.forEach((page) => {
        page.items.forEach((item) => {
          if (
            item.component === "AiSection" &&
            nonce === item.config.aiConfig.nonce
          ) {
            if (this.cancelledJobs.some((element) => element === nonce)) {
              return;
            }
            this.$set(item.config.aiConfig, "progress", progress);
          }
        });
      });
    },
    addDefaultAiControl() {
      const aiControl = this.builder.controls.find((control) => {
        return control.component === "AiSection";
      });
      const clone = this.cloneControl(aiControl);
      clone.config.aiConfig.autofocus = true;
      clone.config.aiConfig.screenTitle = this.screen.title;
      clone.config.aiConfig.screenDescription = this.screen.description;

      this.config[this.currentPage].items.push(clone);
      this.updateState();
      this.inspect(clone);
    },

  }
};
</script>

<style scoped>
.custom-popover {
  margin-right: -400px;
  padding: 16px;
}
.popover-body {
  max-width: 350px;
}
</style>

<style>
.gray-text {
  color: #556271;
}

.icon {
  color: #6A7888;
}
.custom-row {
  height: 80vh;
  margin: 0;
}
.prevent-interaction {
  pointer-events: none;
}

.svg-icon > svg {
  margin-bottom: 3px;
}

.svg-icon > svg > path {
  fill: #6A7888;
}
</style>

<style lang="scss" scoped>
$header-bg: #f7f7f7;
$side-bar-font-size: 0.875rem;

.control-icon {
  width: 30px;
  font-size: 20px;

  img {
    height: 20px;
  }
}

.control-item {
  .delete {
    position: absolute;
    top: 0px;
    right: 0px;
    display: none;
  }

  &:hover {
    cursor: move;
  }

  &.selected {
    border-radius: 5px;
    cursor: move;
  }

  &:not(.selected) .card {
    border: none;
  }
}

.hasError {
  border: 1px solid red;
  border-radius: 0.25rem;

  .form-element-header {
    border-bottom: 1px solid red;
    color: red;
  }
}

.inspector-header {
  background: $header-bg;
}

.validation-panel {
  background: $header-bg;
  height: 10rem;
  width: 21.35rem;
  bottom: 3rem;
}

.validation__message {
  text-decoration: none;

  &:hover {
    background: rgba(51, 151, 225, 0.3);
  }
}

.controls-header {
  border-bottom: none;
}

.header-bg {
  background: $header-bg;
}

.controls {
  cursor: move;
  user-select: none;
  font-size: $side-bar-font-size;
}

.header-button {
  height: 38px;
  width: 38px;
}

.filter-icon {
  background-color: #e9ecef;
}

.controls-column {
  max-width: 185px;
}

.inspector-column {
  max-width: 265px;
  font-size: $side-bar-font-size;
}

.form-control-ghost {
  margin-bottom: 0;
  border-radius: 0.25rem;
}

.drag-placeholder {
  width: calc(100% - 2rem);
  height: calc(100% - 6rem);
  top: 4rem;
}
.ai-section-card {
  border-color: #8ab8ff;
}

.ai-section-card .card-header {
  background: #cbdfff;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgb(28 114 194 / 50%);
  }
  100% {
    box-shadow: 0 0 0 13px rgba(0, 0, 0, 0);
  }
}
.modal-subtitle {
  font-size: 15px;
  font-weight: normal;
}
</style>
