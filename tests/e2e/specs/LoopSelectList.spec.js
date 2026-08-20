describe("Select List Cache", () => {
  const dataSourceResponse = {
    status: 200,
    response: {
      data: [
        {
          id: 1,
          created_by_id: 2,
          updated_by_id: 2,
          created_at: "2021-11-08 10:29:56",
          updated_at: "2021-11-08 10:29:56",
          data: {
            id: 1,
            name: "Bolivia"
          },
          collection_id: 3,
          title: "1",
          created_by: {
            id: 2,
            email: "admin@processmaker.com"
          },
          updated_by: {
            id: 2,
            email: "admin@processmaker.com"
          }
        },
        {
          id: 2,
          created_by_id: 2,
          updated_by_id: 2,
          created_at: "2021-11-08 10:29:56",
          updated_at: "2021-11-08 10:29:56",
          data: {
            id: 2,
            name: "United States"
          },
          collection_id: 3,
          title: "2",
          created_by: {
            id: 2,
            email: "admin@processmaker.com"
          },
          updated_by: {
            id: 2,
            email: "admin@processmaker.com"
          }
        }
      ],
      meta: {
        filter: "",
        sort_by: "",
        sort_order: "",
        count: 2,
        total_pages: 1,
        current_page: 1,
        from: 1,
        last_page: 1,
        path: "/api/1.0/collections/3/records",
        per_page: 9223372036854775807,
        to: 2,
        total: 2
      }
    }
  };

  function addHeader(win, name, value) {
    const meta = win.document.createElement("meta");
    meta.setAttribute("name", name);
    meta.setAttribute("content", value);
    win.document.head.appendChild(meta);
  }
  beforeEach(() => {
    cy.intercept(
      "GET",
      "/api/1.0/requests/data_sources/3/resources/ListAll/data**",
      JSON.stringify(dataSourceResponse)
    ).as("getDataSource");
  });

  it("Preserves a Data Connector selection across responsive breakpoints", () => {
    cy.intercept(
      "GET",
      "/api/1.0/requests/data_sources/3/resources/ListAll/data**",
      (request) => {
        request.reply({
          delay: 250,
          body: JSON.stringify(dataSourceResponse)
        });
      }
    ).as("responsiveDataSource");

    cy.visit("/", {
      onBeforeLoad(win) {
        addHeader(win, "screen-cache-enabled", "false");
        addHeader(win, "screen-cache-timeout", "3000");
      }
    });

    cy.loadFromJson("loop_select_list.json", 0);
    cy.get("#screen-builder-container").then(($builder) => {
      const loop = $builder[0].__vue__.$refs.builder.config[0].items[0];
      loop.config.settings.times = "1";
      loop.items.push({
        label: "Line Input",
        config: {
          name: "desktop_only",
          type: "text",
          label: "Desktop Only",
          validation: [],
          deviceVisibility: {
            showForDesktop: true,
            showForMobile: false
          }
        },
        component: "FormInput",
        inspector: [],
        "editor-control": "FormInput",
        "editor-component": "FormInput"
      });
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@responsiveDataSource");

    const select = '[data-cy="screen-field-country"]';
    const selectedLabel = `${select} .multiselect__single`;
    const desktopOnly = '[data-cy="screen-field-desktop_only"]';
    let originalSelect;
    const assertSelectionState = () => {
      cy.get(selectedLabel).should("contain", "Bolivia");
      cy.get(select).click();
      cy.get(select).contains("United States").should("exist");
      cy.get("body").type("{esc}");
      cy.get("#screen-builder-container").then(($builder) => {
        expect($builder[0].__vue__.previewData.loop_1[0].country).to.equal("1");
      });
    };

    cy.get(select).selectOption("Bolivia");
    assertSelectionState();
    cy.get(desktopOnly).should("be.visible");
    cy.get(select).then(($select) => {
      originalSelect = $select[0];
    });

    cy.get("[data-cy=device-screen-mobile-button]").click();
    cy.get(select).should(($select) => {
      expect($select[0]).to.equal(originalSelect);
    });
    assertSelectionState();
    cy.get(desktopOnly).should("not.be.visible");

    cy.get("[data-cy=device-screen-desktop-button]").click();
    cy.get(select).should(($select) => {
      expect($select[0]).to.equal(originalSelect);
    });
    assertSelectionState();
    cy.get(desktopOnly).should("be.visible");
    cy.get("@responsiveDataSource.all").should("have.length", 1);
  });

  it("None Cached - Verify number of service calls for loop that contains a multiselect list", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // add meta headers
        addHeader(win, "screen-cache-enabled", "false");
        addHeader(win, "screen-cache-timeout", "3000");
      }
    });

    cy.loadFromJson("loop_select_list.json", 0);
    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@getDataSource");
    cy.wait("@getDataSource");
    cy.wait("@getDataSource");
    cy.wait("@getDataSource");
    cy.wait("@getDataSource");
    cy.get("@getDataSource.all").should("have.length", 5);
  });

  it("Cached - Verify number of service calls for loop that contains a multiselect list", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // add meta headers
        addHeader(win, "screen-cache-enabled", "true");
        addHeader(win, "screen-cache-timeout", "3000");
      }
    });

    cy.loadFromJson("loop_select_list.json", 0);
    cy.wait(5000);
    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@getDataSource");
    cy.get("@getDataSource.all").should("have.length", 1);
    // testing cacheTimeout
    cy.wait(5000);
    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@getDataSource");
    cy.get("@getDataSource.all").should("have.length", 2);
  });
});
