import { get } from 'lodash';

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
        value = this.convertUTCToLocal(value, config)
      }
      if (header.format === "date") {
        config = ProcessMaker.user.datetime_format.replace(/[\sHh:msaAzZ]/g, "");
        value = this.convertUTCToLocal(value, config)
      }
      return value;
    },
    convertUTCToLocal(value, config) {
      if (value) {
        if (moment(value).isValid()) {
          return window.moment(value)
            .format(config);
        }
        return value;
      }
      return "-";
    },
  }
};
