describe("Form Image", () => {
  it("Upload image to show", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormImage]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.uploadFile(
      "[data-cy=inspector-image] input[type=file]",
      "avatar.jpeg",
      "image/jpeg"
    );
    cy.get("[data-cy=accordion-Design]").click();
    cy.get("[data-cy=inspector-height]").clear().type("80");
    cy.get("[data-cy=inspector-width]").clear().type("100");
    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] img").should("have.attr", "src");
    cy.get("[data-cy=preview-content] img").should("have.attr", "height", "80");
    cy.get("[data-cy=preview-content] img").should("have.attr", "width", "100");
  });

  it("Image by variable", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormImage]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=inspector-renderImage]").click();
    cy.get("[data-cy=inspector-variableName]").clear().type("image");
    cy.get("[data-cy=accordion-Design]").click();
    cy.get("[data-cy=inspector-height]").clear().type("80");
    cy.get("[data-cy=inspector-width]").clear().type("100");

    cy.setPreviewDataInput({
      image: "https://homepages.cae.wisc.edu/~ece533/images/cat.png"
    });

    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] img").should("have.attr", "src");
    cy.get("[data-cy=preview-content] img").should("have.attr", "height", "80");
    cy.get("[data-cy=preview-content] img").should("have.attr", "width", "100");
  });

  it("Image by variable and load signature", () => {
    cy.visit("/");
    cy.loadFromJson("screen_parent_signature.json", 0);

    const image =
      "data:image/png;base64,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";

    cy.setPreviewDataInput({ signature: image });

    cy.get("[data-cy=mode-preview]").click();
    cy.get("[data-cy=preview-content] img").should("have.attr", "src");

    cy.assertPreviewData({
      signature: image,
      loop: [{}],
      recordlist: null
    });
  });
});
