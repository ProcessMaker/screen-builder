const collectionId = 88;
const fieldNames = [
  "case_number",
  "claimant_name",
  "status",
  "department",
  "submitted_at",
  "assigned_to",
  "priority",
  "amount",
  "currency",
  "country",
  "region",
  "category",
  "description"
];

const recordData = {
  id: 501,
  ...Object.fromEntries(
    fieldNames.map((field, index) => [field, `${field}-${index + 1}`])
  )
};
const secondRecordData = {
  id: 502,
  ...Object.fromEntries(
    fieldNames.map((field, index) => [field, `${field}-${index + 101}`])
  )
};

function findRecordList(config) {
  const pending = [...config];

  while (pending.length) {
    const item = pending.shift();

    if (item?.component === "FormRecordList") {
      return item;
    }

    if (Array.isArray(item?.items)) {
      pending.push(...item.items.flat(Infinity));
    }
  }

  return null;
}

function configureCollectionRecordList() {
  cy.openAcordeon("collapse-3");
  cy.openAcordeon("collapse-2");
  cy.get("[data-cy=controls-FormRecordList]").drag(
    "[data-cy=screen-drop-zone]",
    { position: "bottom" }
  );
  cy.get("[data-cy=screen-element-container]").click();
  cy.get("[data-cy=accordion-Configuration]").click();
  cy.get("[data-cy=inspector-collection-data-source]").select("Collection");
  cy.get("[data-cy=inspector-collection]").select("Synthetic Claims");
  cy.wait(["@collectionFields", "@collectionRecords"]);
}

describe("Collection record list columns", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/1.0/collections*", {
      data: [
        {
          id: collectionId,
          name: "Synthetic Claims",
          read_screen_id: null,
          create_screen_id: null
        }
      ]
    });
    cy.intercept("GET", `/api/1.0/collections/${collectionId}/columns*`, {
      data: fieldNames.map((field) => ({
        label: field,
        field: `data.${field}`
      }))
    }).as("collectionFields");
    cy.intercept("GET", `/api/1.0/collections/${collectionId}/records*`, {
      data: [
        { id: recordData.id, data: recordData },
        { id: secondRecordData.id, data: secondRecordData }
      ],
      meta: { total: 2 }
    }).as("collectionRecords");
    cy.visit("/");
  });

  it("offers schema fields and id, then generates flat All columns", () => {
    configureCollectionRecordList();

    cy.get('button:contains("Columns")').click();
    cy.get(".col-2 > .fas").click();
    cy.get("[data-cy=inspector-collection-columns]")
      .find('option[value="case_number"]')
      .should("have.text", "case_number");
    cy.get("[data-cy=inspector-collection-columns]")
      .find('option[value="id"]')
      .should("have.text", "id");
    cy.get("[data-cy=inspector-collection-columns]")
      .find('option[value^="data."]')
      .should("not.exist");

    cy.get("[data-cy=inspector-collection-columns]").select("case_number");
    cy.get("[data-cy=inspector-collection-columns]")
      .closest(".card")
      .find(".card-footer .btn-secondary")
      .click();
    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);

      expect(recordList.config.fields.optionsList).to.deep.equal([
        { content: "case_number", key: "case_number", label: "" }
      ]);
    });

    cy.get(".col-2 > .fas").click();
    cy.get("[data-cy=inspector-collection-columns]").select("all");
    cy.get("[data-cy=inspector-collection-columns]")
      .closest(".card")
      .find(".card-footer .btn-secondary")
      .click();

    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);
      const options = recordList.config.fields.optionsList;

      expect(options).to.have.length(fieldNames.length + 1);
      expect(options).to.deep.include({
        content: "case_number",
        key: "case_number"
      });
      expect(options).to.deep.include({ content: "id", key: "id" });
      options.forEach((option) => {
        expect(option.content).not.to.match(/^data\./);
        expect(option.key).not.to.match(/^data\./);
      });
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@collectionRecords");
    cy.get('[data-cy="table"] thead').should("contain.text", "case_number");
    cy.get('[data-cy="table"] thead').should("contain.text", "id");
    cy.get('[data-cy="table"] tbody').should(
      "contain.text",
      recordData.case_number
    );
    cy.get('[data-cy="table"] tbody').should("contain.text", recordData.id);
  });

  it("renders legacy data-prefixed column configuration without rewriting it", () => {
    configureCollectionRecordList();

    const legacyOptions = [
      { content: "data.case_number", key: "data.case_number" },
      { content: "data.id", key: "data.id" }
    ];

    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);

      recordList.config.fields.optionsList = legacyOptions;
      recordList.config.fields.jsonData = JSON.stringify(legacyOptions);
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@collectionRecords");
    cy.get('[data-cy="table"] thead').should("contain.text", "case_number");
    cy.get('[data-cy="table"] tbody').should(
      "contain.text",
      recordData.case_number
    );
    cy.get('[data-cy="table"] tbody').should("contain.text", recordData.id);

    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);

      expect(recordList.config.fields.optionsList).to.deep.equal(legacyOptions);
    });
  });

  it("restores and emits legacy data-prefixed single-field selections", () => {
    configureCollectionRecordList();

    const legacySingleField = "data.case_number";
    const legacyOptions = [
      { content: legacySingleField, key: legacySingleField }
    ];

    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);

      recordList.config.name = "claim_selection";
      recordList.config.source.dataSelectionOptions = "single-field";
      recordList.config.source.singleField = legacySingleField;
      recordList.config.fields.optionsList = legacyOptions;
      recordList.config.fields.jsonData = JSON.stringify(legacyOptions);
      root.previewInput = JSON.stringify({
        claim_selection: recordData.case_number
      });
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.wait("@collectionRecords");
    cy.get('[data-cy="table"] tbody input[type="radio"]')
      .should("have.length", 2)
      .eq(0)
      .should("be.checked");

    cy.get('[data-cy="table"] tbody input[type="radio"]')
      .eq(1)
      .check({ force: true });

    cy.get("#screen-builder-container").then((container) => {
      const [{ __vue__: root }] = container;
      const { builder } = root.$refs;
      const recordList = findRecordList(builder.config);

      expect(root.previewData.claim_selection).to.equal(
        secondRecordData.case_number
      );
      expect(recordList.config.source.singleField).to.equal(legacySingleField);
    });
  });
});
