describe("FOUR-6721 RAOS 1.0.0 Screens", () => {
  // initial data to test the screen
  const initialData = {
    _user: {
      id: 3,
      email: "solutions+banker@processmaker.com",
      firstname: "Briana",
      lastname: "Banker",
      username: "banker",
      status: "ACTIVE",
      address: null,
      city: null,
      state: null,
      postal: null,
      country: null,
      phone: null,
      fax: null,
      cell: null,
      title: "Business Banker",
      birthdate: null,
      timezone: "America/Los_Angeles",
      datetime_format: "m/d/Y H:i",
      language: "en",
      meta: {
        employeeCode: "KKB",
        bankerCoreCode: "KKB",
        costCenterCode: "2000"
      },
      is_administrator: false,
      is_system: 0,
      expires_at: null,
      loggedin_at: "2022-07-06 12:46:37",
      active_at: "2022-07-06T12:53:00+00:00",
      created_at: "2021-06-04T17:35:55+00:00",
      updated_at: "2022-06-13T16:44:43+00:00",
      deleted_at: null,
      external_auth_id: null,
      delegation_user_id: null,
      manager_id: null,
      schedule: {
        Fri: {
          to: "16:00",
          from: "08:00",
          active: true
        },
        Mon: {
          to: "16:00",
          from: "08:00",
          active: true
        },
        Sat: {
          to: "16:00",
          from: "08:00",
          active: false
        },
        Sun: {
          to: "16:00",
          from: "08:00",
          active: false
        },
        Thu: {
          to: "16:00",
          from: "08:00",
          active: true
        },
        Tue: {
          to: "16:00",
          from: "08:00",
          active: true
        },
        Wed: {
          to: "16:00",
          from: "08:00",
          active: true
        }
      },
      force_change_password: 0,
      fullname: "Briana Banker",
      avatar: ""
    },
    event: "node_21",
    trust: [
      {
        uid: "1E88AB60-53E4-4C2A-9DE7-E0585E976B82",
        isMinor: false,
        isTrust: true,
        fullName: "RYAN O",
        isPresent: false,
        trustName: "RYAN O",
        isJointOwner: false,
        isBeneficiary: false,
        isPrimaryContact: false
      }
    ],
    banker: {
      id: 3,
      name: "Briana Banker",
      email: "solutions+banker@processmaker.com",
      bankerCoreCode: "KKB",
      costCenterCode: "2000"
    },
    branch: {
      id: 1,
      city: "Raleigh",
      phone: "(123) 847 3333",
      state: "NC",
      country: null,
      coreCode: "02",
      hostName: "Kazeem Adaramaja",
      hostEmail: "kazeem.adaramaja@processmaker.com",
      branchName: "Raleigh",
      postalCode: null,
      addressLine1: "23 West Lane",
      addressLine2: null,
      emailAddress: "solutions+raleighbranch@processmaker.com",
      isMainBranch: false,
      fisCustomerID: null,
      bizChexStrategyCode: null,
      bizChexMarketTypeCode: "DPADDA",
      customBizChexSettings: false,
      branchOperationsGroupId: 6
    },
    people: [
      {
        uid: "96D93B32-540B-41F4-A4CA-2FD1834B6999",
        email: "victor.kawedo@processmaker.com",
        person: null,
        isMinor: false,
        isTrust: false,
        lastName: "GILBERT",
        cellPhone: "2014222730",
        firstName: "GENEVIEVE",
        isPresent: true,
        signature: {
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjgAMAAAoAAWkGOTIAAAAASUVORK5CYII="
        },
        searchTaxId: "",
        isJointOwner: false,
        isBeneficiary: false,
        newOrExisting: "New",
        isPrimaryContact: true
      },
      {
        uid: "91289B19-D9B2-45CE-8543-9B42F97B3ABF",
        email: "victor.kawedo@processmaker.com",
        person: null,
        isMinor: false,
        isTrust: false,
        lastName: "LILIENTHAL",
        cellPhone: "2014222730",
        firstName: "EARL",
        isPresent: true,
        signature: {
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjgAMAAAoAAWkGOTIAAAAASUVORK5CYII="
        },
        searchTaxId: "",
        isJointOwner: true,
        isBeneficiary: false,
        newOrExisting: "New",
        isPrimaryContact: false
      },
      {
        SSN: "666991855",
        uid: "71EC8A0B-5EFA-4E91-833C-C9D4D8FE669E",
        city: "CHARLESTON",
        email: "ktomlin+joanclone2@mstreetbank.com",
        state: "WV",
        postal: "253012832",
        address: null,
        country: null,
        isMinor: true,
        isTrust: false,
        mailing: false,
        fullName: "JOAN ROSSER",
        lastName: "ROSSER",
        cellPhone: "5715777401",
        firstName: "JOAN",
        isPresent: true,
        signature: {
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFAQMAAAC3obSmAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjgAMAAAoAAWkGOTIAAAAASUVORK5CYII="
        },
        workPhone: "5715777401",
        customerId: "RAA1728",
        occupation: "CEO and Founder",
        dateOfBirth: "1990-12-12",
        searchTaxId: "666991855",
        addressSuite: null,
        employerName: "NEW ENTERTAINMENT GROUP",
        isJointOwner: false,
        isBeneficiary: false,
        newOrExisting: "Existing",
        isPrimaryContact: false
      }
    ],
    _parent: {
      config: {
        name: "Account Application",
        processId: 52,
        startEvent: "node_6",
        calledElement: "ProcessId-52"
      },
      node_id: "node_22",
      process_id: 22,
      request_id: 996
    },
    baseURL: "https://dev-intensifi-se.processmaker.net",
    contact: [
      {
        email: "",
        person: null,
        search: null,
        lastName: "",
        cellPhone: "",
        firstName: "",
        introNotes: null,
        searchName: "",
        searchTaxId: "",
        newOrExisting: null,
        searchResponse: null
      }
    ],
    _request: {
      id: 997,
      process_id: 52,
      process_collaboration_id: 439,
      user_id: 3,
      parent_request_id: 996,
      participant_id: null,
      callable_id: "ProcessId",
      status: "ACTIVE",
      name: "RAOS 1.0.0 - Account Application",
      do_not_sanitize: null,
      errors: null,
      completed_at: null,
      initiated_at: "2022-06-29T12:06:09+00:00",
      created_at: "2022-06-29T12:06:09+00:00",
      updated_at: "2022-06-29T12:06:11+00:00",
      process_version_id: 1481,
      signal_events: []
    },
    accounts: null,
    bankName: "Super Bank",
    pageTitle: "Personal Account Application",
    currentRole: "Banker",
    otherPeople: null,
    bankerChoice: "In-Person",
    pageSubTitle: "New Client Onboarding",
    trustAccount: "Yes",
    accountOwners: null,
    applicationId: 133,
    bankerStarted: true,
    beneficiaries: null,
    requestStatus: "Application Started",
    accountSigners: null,
    addOtherPeople: null,
    enableRequired: false,
    pageValidation: {
      isValid: true,
      validationMessage: ""
    },
    primaryContact: null,
    requestSummary:
      "Personal Account Opening (GENEVIEVE GILBERT |  + 2 people |  + Trust |  Banker - In-Person)",
    searchCategory: "RAOS",
    officersInvolved: [
      {
        id: 3,
        name: "Briana Banker",
        task: "Start Application",
        email: "solutions+banker@processmaker.com"
      }
    ],
    acceptedDocuments: null,
    applicationConfig: {
      UseIDAForWebLeads: true,
      accountNumberSource: "InputAccountNumber",
      UseAlloyForVerification: false,
      UseExperianforVerification: true,
      UseNeoCheckForVerification: true,
      ExistingCustomerLookupSource: "Nxtsoft",
      UseChexSystemsForVerification: true
    },
    applicationUpdated: "Application updated successfully",
    applicationUpdateError: null,
    applicationTrackerError: null
  };

  beforeEach(() => {
    cy.visit("/");
    cy.intercept(
      "POST",
      "/api/1.0/requests/data_sources/38",
      JSON.stringify({
        status: 200,
        response: {
          data: [],
          meta: {
            filter: "",
            sort_by: "",
            sort_order: "",
            count: 2,
            total_pages: 1,
            current_page: 1,
            from: 1,
            last_page: 1,
            path: "/api/1.0/collections/1/records",
            per_page: 10,
            to: 2,
            total: 2
          }
        }
      })
    ).as("DataSourceOne");
    cy.intercept(
      "POST",
      "/api/1.0/requests/data_sources/22",
      JSON.stringify({
        status: 200,
        response: {
          data: [],
          meta: {
            filter: "",
            sort_by: "",
            sort_order: "",
            count: 2,
            total_pages: 1,
            current_page: 1,
            from: 1,
            last_page: 1,
            path: "/api/1.0/collections/1/records",
            per_page: 10,
            to: 2,
            total: 2
          }
        }
      })
    ).as("DataSourceTwo");
  });

  it("Test performance of RAOS 1.0.0 People Screen render complete and start to get data sources", () => {
    cy.loadFromJson("RAOS_1.0.0_-_People_2.json", 7);

    // Wait screen configuration to load
    cy.wait("@DataSourceOne");
    cy.wait("@DataSourceTwo");
    cy.wait("@DataSourceTwo");

    // set initial data to test the screen
    cy.setPreviewDataInput(initialData);

    // Wait Designer to load before continuing to Preview
    cy.wait(2000);

    // Start performance check
    cy.window().its("performance").invoke("mark", "startPreviewScreen");
    cy.get("[data-cy=mode-preview]").click();

    // wait DataSources to load
    cy.get("@DataSourceOne");
    cy.get("@DataSourceOne");
    cy.get("@DataSourceOne");
    cy.get("@DataSourceTwo");
    cy.get("@DataSourceTwo");
    cy.get("@DataSourceTwo");
    cy.get("@DataSourceTwo");

    // Check performance measure: Screen should be rendered in less than 4 seconds
    cy.window().its("performance").invoke("mark", "endPreviewScreen");
    cy.window()
      .its("performance")
      .invoke(
        "measure",
        "previewScreen",
        "startPreviewScreen",
        "endPreviewScreen"
      )
      .its("duration")
      .should("be.lessThan", 4000);
  });

  it("Test performance of RAOS 1.0.0 People Screen render complete and wait for all data sources to load", () => {
    cy.loadFromJson("RAOS_1.0.0_-_People_2.json", 7);

    // Wait screen configuration to load
    cy.wait("@DataSourceOne");
    cy.wait("@DataSourceTwo");
    cy.wait("@DataSourceTwo");

    // set initial data to test the screen
    cy.setPreviewDataInput(initialData);

    // Wait Designer to load before continuing to Preview
    cy.wait(2000);

    // Start performance check
    cy.window().its("performance").invoke("mark", "startPreviewScreen");
    cy.get("[data-cy=mode-preview]").click();

    // wait DataSources to load
    cy.wait("@DataSourceOne");
    cy.wait("@DataSourceOne");
    cy.wait("@DataSourceOne");
    cy.wait("@DataSourceTwo");
    cy.wait("@DataSourceTwo");
    cy.wait("@DataSourceTwo");
    cy.wait("@DataSourceTwo");

    // Check performance measure: Screen should get all the data sources in less than 10 seconds
    cy.window().its("performance").invoke("mark", "endPreviewScreen");
    cy.window()
      .its("performance")
      .invoke(
        "measure",
        "previewScreen",
        "startPreviewScreen",
        "endPreviewScreen"
      )
      .its("duration")
      .should("be.lessThan", 10000);
  });
});
