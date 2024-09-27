<template>
  <b-tabs
    ref="tabs"
    v-model="activeTab"
    class="h-100 w-100 flat-tabs"
    content-class="h-tab"
    nav-class="nav-tabs-nowrap"
    lazy
    @changed="tabsUpdated"
    @input="tabOpened"
  >
    <template #tabs-start>
      <div class="tabs-sticky d-flex flex-row tabs-start">
        <div
          v-show="tabsListOverflow"
          class="position-relative overflow-visible"
        >
          <div
            role="link"
            class="nav-scroll nav-scroll-left"
            data-test="scroll-left"
            @click="scrollTabsLeft"
          >
            <i class="fas fa-chevron-left" />
          </div>
        </div>
      </div>

      <div :class="{'dd-ml': tabsListOverflow}">
        <slot name="tabs-start" />
      </div>
    </template>
    <b-tab
      v-for="(index, n) in validLocalOpenedPages"
      :key="`tab-${n}`"
      class="h-100 w-100"
    >
      <template #title>
        <b-badge variant="primary" class="mr-1">
          {{ pageNumber(index) }}
        </b-badge>
        <span :data-test="`tab-${n}`">
          {{ pages[index]?.name }}
        </span>
        <span
          v-if="isMultiPage"
          :data-test="`close-tab-${n}`"
          class="close-tab"
          role="link"
          @click.stop="closeTab(n)"
        >
          <i class="fas fa-times" />
        </span>
      </template>
      <template #default>
        <div class="h-100 w-100" data-test="tab-content">
          <slot :current-page="index" />
        </div>
      </template>
    </b-tab>
    <b-tab
      v-if="showClipboard"
      ref="clipboard"
      class="h-100 w-100"
      name="clipboard"
      @click="clipboard"
    >
      <template #title>
        {{ $t('Clipboard') }}
        <span
          :data-test="`close-clipboard-tab`"
          class="close-tab"
          role="link"
          @click.stop="closeClipboard"
        >
          <i class="fas fa-times" />
        </span>
      </template>
      <template #default>
        <div class="h-100 w-100" data-test="tab-content">
          <slot :current-page="clipboardPageIndex" />
        </div>
      </template>
    </b-tab>
    <template #tabs-end>
      <div
        v-if="tabsListOverflow"
        class="tabs-sticky overflow-visible"
      >
        <div
          role="link"
          class="nav-scroll nav-scroll-right"
          data-test="scroll-right"
          @click="scrollTabsRight"
        >
          <i class="fas fa-chevron-right" />
        </div>
      </div>
    </template>
    <template #empty>
      <p class="text-center m-5 text-secondary" data-test="tab-content">
        {{ $t("There are no open pages.") }}<br />
        {{ $t("Open a new page above using the button") }}
        <i :class="buttonIcon" />
      </p>
    </template>
  </b-tabs>
</template>

<script>
const SCROLL_STEP = 200;

export default {
  props: {
    /**
     * The configuration of all the pages
     */
    pages: {
      type: Array,
      required: true
    },
    /**
     * The array of initial opened pages indexes
     */
    initialOpenedPages: {
      type: Array,
      default: () => [0]
    },
    /**
     * Icon to open a new tab, displayed when there are no pages opened.
     */
    buttonIcon: {
      type: String,
      default: () => "fa fa-file"
    },
    /**
     * Is multi page mode enabled
     */
    isMultiPage: {
      type: Boolean,
      default: true
    },
    /**
     * Show clipboard tab
     */
    showClipboard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tabsListOverflow: false,
      showLeftScroll: true,
      showRightScroll: true,
      updates: 0,
      activeTab: 0,
      localOpenedPages: this.initialOpenedPages
    };
  },
  computed: {
    clipboardPageIndex() {
      return this.pages.length;
    },
    validLocalOpenedPages() {
      return this.localOpenedPages.filter((page) => this.pages[page]);
    }
  },
  watch: {
    openedPages: {
      handler(newVal) {
        this.localOpenedPages = newVal;
      },
      deep: true
    },
    pages: {
      handler() {
        this.localOpenedPages = this.localOpenedPages.filter(
          (page) => this.pages[page]
        );
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // check resize of tabs list
      window.addEventListener("resize", this.checkTabsOverflow);
      // listen to scroll event
      const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
      tablist.addEventListener("scroll", this.checkScrollPosition);

      Promise.resolve().then(() => {
        this.checkTabsOverflow();
        this.checkScrollPosition();
      });
    });

  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkTabsOverflow);
  },
  updated() {
    this.checkTabsOverflow();
  },
  methods: {
    openClipboard() {
      if (this.$refs.clipboard) {
        this.$refs.clipboard.activate();
      }
    },
    closeClipboard() {
      this.$emit('close-clipboard');
    },
    clipboard() {
      this.$emit('clear-clipboard');
    },
    tabOpened() {
      const pageIndex = this.localOpenedPages[this.activeTab];
      const isInClipboard = this.activeTab  === this.$refs.tabs.tabs.length - 1;
      if (isInClipboard) {
        this.$emit("tab-opened", this.clipboardPageIndex);
      } else {
        this.$emit("tab-opened", pageIndex);
      }
    },
    pageNumber(index) {
      return index + 1;
    },
    checkScrollPosition() {
      const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
      this.showLeftScroll = tablist.scrollLeft > 0;
      this.showRightScroll =
        tablist.scrollWidth - tablist.clientWidth > tablist.scrollLeft;
    },
    scrollTabsLeft() {
      const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
      tablist.scrollLeft -= SCROLL_STEP;
    },
    scrollTabsRight() {
      const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
      tablist.scrollLeft += SCROLL_STEP;
    },
    tabsUpdated() {
      this.updates++;
    },
    waitUpdates(n, timeout, visualThreshold = 80) {
      return new Promise((resolve) => {
        const start = Date.now();
        const interval = setInterval(() => {
          if (this.updates >= n || Date.now() - start > timeout) {
            clearInterval(interval);
            resolve();
          }
        }, visualThreshold);
      });
    },
    closeTab(tabIndex) {
      const pageIndex = this.localOpenedPages[tabIndex];
      this.localOpenedPages.splice(tabIndex, 1);
      this.$emit("tab-closed", this.pages[pageIndex], this.localOpenedPages);
    },
    updateTabsReferences(pageDelete) {
      this.localOpenedPages = this.localOpenedPages.map((page) =>
        page > pageDelete ? page - 1 : page
      );
    },
    async openPageByIndex(index) {
      if (index === -1) {
        return;
      }
      const n = this.localOpenedPages.indexOf(index * 1);
      if (n === -1) {
        this.localOpenedPages.push(index);
        await this.waitUpdates(this.updates + 2, 1000);
        this.activeTab = this.localOpenedPages.length - 1;
      } else {
        this.activeTab = n;
      }
    },
    closePageByIndex(index) {
      const n = this.localOpenedPages.indexOf(index);
      if (n !== -1) {
        this.localOpenedPages.splice(n, 1);
      }
    },
    checkTabsOverflow() {
      const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
      this.tabsListOverflow = tablist.scrollWidth > tablist.clientWidth;
    }
  }
};
</script>
