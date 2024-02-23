describe("select list mustache", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.intercept(
      "POST",
      "/api/1.0/requests/data_sources/3",
      JSON.stringify({
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
      })
    ).as("executeScript");
    // Bolivia Cities
    const BoliviaCities = [
      {
        id: 1,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 1,
          name: "La Paz"
        },
        collection_id: 4,
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
          name: "Santa Cruz"
        },
        collection_id: 4,
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
    ];
    // US Cities
    const USCities = [
      {
        id: 3,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 3,
          name: "Las Vegas"
        },
        collection_id: 4,
        title: "1",
        created_by: {
          id: 1,
          email: "admin@processmaker.com"
        },
        updated_by: {
          id: 1,
          email: "admin@processmaker.com"
        }
      },
      {
        id: 4,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 4,
          name: "Asheville"
        },
        collection_id: 4,
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
    ];
    let cities = [];
    cy.intercept("POST", "/api/1.0/requests/data_sources/4", (req) => {
      switch (req.body.config.outboundConfig[0].value) {
        case "data.country_id=1":
          cities = BoliviaCities;
          break;
        case "data.country_id=2":
          cities = USCities;
          break;
        default:
          cities = [];
      }
      const response = {
        data: cities,
        meta: {
          filter: "",
          sort_by: "",
          sort_order: "",
          count: cities.length,
          total_pages: 1,
          current_page: 1,
          from: 1,
          last_page: 1,
          path: "/api/1.0/collections/4/records",
          per_page: 9223372036854775807,
          to: cities.length,
          total: cities.length
        }
      };
      req.reply({
        headers: {
          "X-Cypress-Response": `"response":${JSON.stringify(response)}}`
        },
        statusCode: 200,
        body: { response }
      });
    });

    // La Paz addresses
    const LaPazAddresses = [
      {
        id: 1,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 1,
          name: "My address in La Paz 1"
        },
        collection_id: 5,
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
          name: "My address in La Paz 2"
        },
        collection_id: 5,
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
    ];

    // Santa Cruz addresses
    const SantaCruzAddresses = [
      {
        id: 1,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 1,
          name: "My address in Santa Cruz 1"
        },
        collection_id: 5,
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
          name: "My address in Santa Cruz 2"
        },
        collection_id: 5,
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
    ];

    // LasVegas addresses
    const LasVegasAddresses = [
      {
        id: 3,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 3,
          name: "My address in Las Vegas 1"
        },
        collection_id: 5,
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
        id: 4,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 4,
          name: "My address in Las Vegas 2"
        },
        collection_id: 5,
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
    ];

    // Asheville addresses
    const AshevilleAddresses = [
      {
        id: 5,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 5,
          name: "My address in Asheville 1"
        },
        collection_id: 5,
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
        id: 6,
        created_by_id: 2,
        updated_by_id: 2,
        created_at: "2021-11-08 10:29:56",
        updated_at: "2021-11-08 10:29:56",
        data: {
          id: 6,
          name: "My address in Asheville 2"
        },
        collection_id: 5,
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
    ];

    let addresses = [];
    cy.intercept("POST", "/api/1.0/requests/data_sources/5", (req) => {
      switch (req.body.config.outboundConfig[0].value) {
        case "data.city_id=1":
          addresses = LaPazAddresses;
          break;
        case "data.city_id=2":
          addresses = SantaCruzAddresses;
          break;
        case "data.city_id=3":
          addresses = LasVegasAddresses;
          break;
        case "data.city_id=4":
          addresses = AshevilleAddresses;
          break;
        default:
          addresses = [];
      }
      const response = {
        data: addresses,
        meta: {
          filter: "",
          sort_by: "",
          sort_order: "",
          count: addresses.length,
          total_pages: 1,
          current_page: 1,
          from: 1,
          last_page: 1,
          path: "/api/1.0/collections/5/records",
          per_page: 9223372036854775807,
          to: addresses.length,
          total: addresses.length
        }
      };
      req.reply({
        headers: {
          "X-Cypress-Response": `"response":${JSON.stringify(response)}}`
        },
        statusCode: 200,
        body: { response }
      });
    });
  });

  it("Verify Load values in multiselect list mustache + collection", () => {
    cy.loadFromJson("select_list_dependent.json", 0);
    cy.get("[data-cy=mode-preview]").click();

    // Country should be empty
    cy.get('[data-cy="screen-field-country"] .multiselect__placeholder').should(
      "be.visible"
    );
    // City should be empty
    cy.get('[data-cy="screen-field-city"] .multiselect__placeholder').should(
      "be.visible"
    );

    cy.get('[data-cy="screen-field-country"]').selectOption("Bolivia");
    cy.get('[data-cy="screen-field-city"]').selectOption("La Paz");
    cy.get('[data-cy="screen-field-address"]').selectOption(
      "My address in La Paz 1"
    );
    cy.get('[data-cy="screen-field-country"]').selectOption("United States");
    // Once selected a different country city should be cleaned
    cy.get('[data-cy="screen-field-city"] .multiselect__placeholder').should(
      "be.visible"
    );
    cy.get('[data-cy="screen-field-address"] .multiselect__placeholder').should(
      "be.visible"
    );
    cy.get('[data-cy="screen-field-city"]').selectOption("Asheville");
    cy.get('[data-cy="screen-field-address"]').selectOption(
      "My address in Asheville 2"
    );

    cy.assertPreviewData({
      country: "2",
      city: "4",
      address: "6"
    });
  });
});
