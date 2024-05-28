import { get } from "lodash";

export default {
  data() {
    return {
      page: 1,
      perPage: 10,
      css: {
        tableClass: "table table-hover table-responsive-lg text-break mb-0",
        loadingClass: "loading",
        detailRowClass: "vuetable-detail-row",
        handleIcon: "grey sidebar icon",
        sortableIcon: "fas fa-sort",
        ascendingIcon: "fas fa-sort-up",
        descendingIcon: "fas fa-sort-down",
        ascendingClass: "ascending",
        descendingClass: "descending",
        renderIcon(classes) {
          return `<i class="${classes.join(" ")}"></i>`;
        }
      }
    };
  },
  methods: {
    dataManager(sortOrder) {
      if (sortOrder[0].sortField !== undefined) {
        this.orderBy = sortOrder[0].sortField;
      } else {
        this.orderBy = sortOrder[0].field;
      }
      this.orderDirection = sortOrder[0].direction;
      this.fetch();
    },
    getNestedPropertyValue(obj, header) {
      return this.format(get(obj, header.field), header);
    },
    format(value, header) {
      let config = "";
      if (header.format === "datetime") {
        config = ProcessMaker.user.datetime_format;
        value = this.convertUTCToLocal(value, config);
      }
      if (header.format === "date") {
        config = ProcessMaker.user.datetime_format.replace(
          /[\sHh:msaAzZ]/g,
          ""
        );
        value = this.convertUTCToLocal(value, config);
      }
      return value;
    },
    convertUTCToLocal(value, config) {
      if (value) {
        if (moment(value).isValid()) {
          return window.moment(value).format(config);
        }
        return value;
      }
      return "-";
    },
    containsHTML(text) {
      const doc = new DOMParser().parseFromString(text, "text/html");
      return Array.from(doc.body.childNodes).some(
        (node) => node.nodeType === Node.ELEMENT_NODE
      );
    },
    isComponent(content) {
      if (content && typeof content === "object") {
        return content.component && typeof content.props === "object";
      }
      return false;
    },
    sanitize(html) {
      return this.removeScripts(html);
    },
    removeScripts(input) {
      const doc = new DOMParser().parseFromString(input, "text/html");

      const scripts = doc.querySelectorAll("script");
      scripts.forEach((script) => {
        script.remove();
      });

      const styles = doc.querySelectorAll("style");
      styles.forEach((style) => {
        style.remove();
      });

      return doc.body.innerHTML;
    },
    changePage(page) {
      this.page = page;
      this.fetch();
    },
    changePerPage(value) {
      this.perPage = value;
      this.fetch();
    },
    formatAvatar(user) {
      return {
        component: "AvatarImage",
        props: {
          size: "25",
          "input-data": user,
          "hide-name": false,
          "name-clickable": true
        }
      };
    },
    formatCategory(categories) {
      return categories.map((item) => item.name).join(", ");
    },
    checkIfTooltipIsNeeded(e, v) {
      if (e.target.offsetWidth >= e.target.scrollWidth) {
        e.preventDefault();
      }
    }
  }
};
