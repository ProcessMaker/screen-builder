function leastSquares(valuesX, valuesY) {
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let count = 0;

  /*
   * We'll use those variables for faster read/write access.
   */
  let x = 0;
  let y = 0;
  const valuesLength = valuesX.length;

  if (valuesLength !== valuesY.length) {
    throw new Error(
      "The parameters values_x and values_y need to have same size!"
    );
  }

  /*
   * Nothing to do.
   */
  if (valuesLength === 0) {
    return [[], []];
  }

  /*
   * Calculate the sum for each of the parts necessary.
   */
  for (let v = 0; v < valuesLength; v += 1) {
    x = valuesX[v];
    y = valuesY[v];
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
    count++;
  }

  /*
   * Calculate m and b for the formula:
   * y = m * x + b
   */
  const m = (count * sumXY - sumX * sumY) / (count * sumXX - sumX * sumX);
  const b = (sumY - m * sumX) / count;

  /*
   * We will make the x and y result line now
   */
  const resultValuesX = [];
  const resultValuesY = [];

  for (let v = 0; v < valuesLength; v += 1) {
    x = valuesX[v];
    y = x * m + b;
    resultValuesX.push(x);
    resultValuesY.push(y);
  }

  return {
    resultValuesX,
    resultValuesY,
    m,
    b
  };
}
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
    cy.server();
    cy.visit("/");
    cy.route(
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
    cy.route(
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

  it("Metrics to get typing speed", () => {
    cy.loadFromJson("RAOS_1.0.0_-_People_2.json", 7);

    // set initial data to test the screen
    cy.setPreviewDataInput(initialData);

    // Wait Designer to load before continuing to Preview
    cy.wait(5000);

    cy.get("[data-cy=mode-preview]").click();
    // Wait Designer to load before continuing to type text in a field
    cy.wait(5000);
    // set init screen test data
    let logText;
    let measure;
    let t0;
    let t1;
    let valuesX = [];
    let valuesY = [];
    const delayValue = 50;
    const textArray = [
      "1234567890",
      "12345678901234567890",
      "123456789012345678901234567890",
      "1234567890123456789012345678901234567890",
      "12345678901234567890123456789012345678901234567890"
    ];
    cy.wrap(textArray)
      .each((item, i, array) => {
        cy.get("[data-cy=preview-content] [name='middleName']")
          .eq(0)
          .then((element) => {
            t0 = new Date().getTime();
            return element;
          })
          .type(item, {
            delay: delayValue
          })
          .then((element) => {
            t1 = new Date().getTime();
            measure = t1 - t0;
            valuesX.push(item.length);
            valuesY.push(measure);

            logText =
              "(Delay: " +
              delayValue +
              ", Characters Number: " +
              item.length +
              ") =>  Total Time: " +
              measure +
              "ms \n";
            cy.log(logText).then(() => {
              return element;
            });
            cy.writeFile("tests/e2e/metrics/results.txt", logText, {
              flag: "a+"
            }).then(() => {
              return element;
            });
          });
      })
      .then((array) => {
        const result = leastSquares(valuesX, valuesY);
        logText = "Time per Character: " + result.m + "ms \n";
        cy.writeFile("tests/e2e/metrics/results.txt", logText, {
          flag: "a+"
        }).then(() => {
          return array;
        });
      });
  });
});
