<template>
  <b-tabs
    ref="tabs"
    v-model="activeTab"
    class="h-100 w-100 flat-tabs"
    content-class="h-tab"
    lazy
    @changed="tabsUpdated"
    @input="tabOpened"
  >
    <template #tabs-start>
      <div>
        <slot name="tabs-start" />
        <div class="tabs-sticky d-flex flex-row tabs-start">
          <div
            v-show="tabsListOverflow && showLeftScroll"
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
      </div>
    </template>
    <b-tab
      v-for="(index, n) in localOpenedPages"
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
          v-if="localOpenedPages.length > 1"
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
    <template #tabs-end>
      <div
        v-show="tabsListOverflow && showRightScroll"
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
  watch: {
    openedPages: {
      handler(newVal) {
        this.localOpenedPages = newVal;
      },
      deep: true
    }
  },
  mounted() {
    // check resize of tabs list
    window.addEventListener("resize", this.checkTabsOverflow);
    setTimeout(() => {
      this.checkTabsOverflow();
      this.checkScrollPosition();
    }, 0);
    // listen to scroll event
    const tablist = this.$refs.tabs.$el.querySelector(".nav-tabs");
    tablist.addEventListener("scroll", () => this.checkScrollPosition());
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkTabsOverflow);
  },
  updated() {
    this.checkTabsOverflow();
  },
  methods: {
    tabOpened() {
      const pageIndex = this.localOpenedPages[this.activeTab];
      this.$emit("tab-opened", pageIndex);
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
    closeTab(pageId) {
      this.localOpenedPages.splice(this.localOpenedPages.indexOf(pageId), 1);
      this.$emit("tab-closed", this.pages[pageId], this.localOpenedPages);
    },
    updateTabsReferences(pageDelete) {
      this.localOpenedPages = this.localOpenedPages.map((page) => page > pageDelete ? page - 1 : page);
    },
    async openPageByIndex(index) {
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

<style>
/* Setup some colors */
:root {
  --tabs-blue: #1572c2;
  --tabs-light: #c3c9cf;
  --tabs-grey: #6a7888;
  --tabs-border: #cdddee;
  --tabs-scroll-bg: #ebeef2;
  --tabs-white: #ffffff;
}
/* Override Bootstrap default tab styles */
.nav-tabs {
  border-bottom: 1px solid var(--tabs-border) !important;
  flex-wrap: nowrap !important;
  overflow: hidden !important;
}
/* Style for individual tabs */
.nav-tabs .nav-item.show .nav-link,
.nav-tabs .nav-link.active {
  border: none;
  box-shadow: inset 0 -3px 0 0 var(--tabs-blue) !important; /* This sets the blue bottom border for the active tab */
  background-color: var(
    --tabs-white
  ); /* This sets the background color for the active tab */
  border-radius: 0 !important; /* This removes the border-radius */
  color: var(--tabs-blue) !important;
  position: relative;
}

/* Style for non-active tabs */
.nav-tabs .nav-link {
  border: 1px solid var(--tabs-border) !important;
  color: var(--tabs-grey); /* This sets the text color for the inactive tabs */
  border-radius: 0 !important; /* This ensures no border radius for a flat design */
  padding: 0.5rem 1rem;
  margin-right: -1px;
  text-wrap: nowrap !important;
  flex-wrap: nowrap !important;
}

/* Style for the hover effect */
.nav-tabs .nav-link:hover {
  border: none;
  background-color: var(
    --tabs-white
  ); /* This changes the background color when hovering */
}

/* Adding the 'x' button to the tab */
.nav-tabs .nav-link .close-tab {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  color: var(--tabs-light);
  margin-left: 0.5rem;
  display: inline !important;
}

/* Style adjustments for the 'x' button */
.nav-tabs .nav-link .close-tab:hover {
  color: var(--tabs-grey);
  cursor: pointer;
}
.nav-tabs .nav-scroll {
  position: absolute;
  top: calc(50% - 0.75rem);
  width: 1.5rem;
  height: 1.5rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tabs-scroll-bg);
  color: var(--tabs-grey);
  cursor: pointer;
  border: 1px solid var(--tabs-border);
  border-radius: 100%;
  z-index: 1;
}
.nav-tabs .nav-scroll-right {
  right: 0;
}
.nav-tabs .nav-scroll-left {
  left: 0;
}
.nav-tabs .tabs-sticky {
  position: sticky;
  -webkit-position: sticky;
  left: 0;
  right: 0;
  z-index: 2;
}
.nav-tabs .tabs-start {
  background-color: var(--tabs-white);
}
/* add margin right to the last li element to hide safely the right scroll button */
.nav-tabs .nav-item:last-of-type {
  margin-right: 2rem;
}
.flat-tabs .h-tab {
  height: calc(100% - 42px) !important;
}
</style>
