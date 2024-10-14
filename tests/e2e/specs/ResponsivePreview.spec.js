describe("Responsive Preview test", () => {
  const modeEditorSelector = "[data-cy=mode-editor]";
  const modePreviewSelector = "[data-cy=mode-preview]";
  const desktopButtonSelector = "[data-cy=device-screen-desktop-button]";
  const mobileButtonSelector = "[data-cy=device-screen-mobile-button]";
  const screenRendererSelector = "[data-cy=screen-renderer-container]";
  const screenDropZoneSelector = "[data-cy=screen-drop-zone]";
  const screenContainerSelector = "[data-cy=screen-element-container]";
  const controlInputSelector = "[data-cy=controls-FormInput]";

  beforeEach(() => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get(controlInputSelector).drag(screenDropZoneSelector, {
      position: "bottom"
    });
    cy.get("[data-cy=controls-FormSelectList]").drag(screenContainerSelector, {
      position: "bottom"
    });
  });

  it("should render the mode editor and mode preview buttons", () => {
    // Mode buttons
    cy.get(modeEditorSelector)
      .should("be.visible")
      .and("have.class", "btn-secondary");
    cy.get(modePreviewSelector)
      .should("be.visible")
      .and("not.have.class", "btn-secondary");
    // Device buttons
    cy.get(desktopButtonSelector).should("not.be.visible");
    cy.get(mobileButtonSelector).should("not.be.visible");
  });
  it("Buttons should have title attributes", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Device buttons
    cy.get(desktopButtonSelector)
      .should("be.visible")
      .should("have.attr", "title");
    cy.get(mobileButtonSelector)
      .should("be.visible")
      .should("have.attr", "title");
  });
  it("should render the device screen buttons when clicking on mode preview", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Device buttons
    cy.get(desktopButtonSelector)
      .should("be.visible")
      .and("have.class", "btn-secondary");
    cy.get(mobileButtonSelector)
      .should("be.visible")
      .and("not.have.class", "btn-secondary");
  });

  it("should render the screen renderer as a the desktop device by default when clicking on mode preview", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Screen container
    cy.get(screenRendererSelector).then(($el) => {
      expect($el).to.be.visible;
      expect($el).to.have.class("container-desktop");

      const width = $el.width();
      expect(width).to.be.greaterThan(480);
    });
  });

  it("should render the screen renderer as a mobile device when clicking on the mobile button", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Mobile button
    cy.get(mobileButtonSelector).click();
    // Screen container
    cy.get(screenRendererSelector)
      .should("be.visible")
      .and("have.class", "container-mobile")
      .and("have.css", "width", "480px");
  });

  it("should render the screen renderer as a desktop device when clicking on the desktop button after clicking on the mobile button", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Mobile button
    cy.get(mobileButtonSelector).click();
    // Desktop button
    cy.get(desktopButtonSelector).click();
    // Screen container
    cy.get(screenRendererSelector)
      .should("be.visible")
      .and("have.class", "container-desktop");
  });

  it("should render the screen renderer as a mobile device when clicking on the mobile button after clicking on the mode editor", () => {
    // Preview button
    cy.get(modePreviewSelector).click();
    // Mobile button
    cy.get(mobileButtonSelector).click();
    cy.wait(500);
    // Editor button
    cy.get(modeEditorSelector).click();
    // Mobile button
    cy.get(mobileButtonSelector).should("not.be.visible");
    cy.wait(500);

    // Preview button
    cy.get(modePreviewSelector).click();
    // Desktop button
    cy.get(desktopButtonSelector)
      .should("be.visible")
      .and("not.have.class", "btn-secondary");
    // Mobile button
    cy.get(mobileButtonSelector)
      .should("be.visible")
      .and("have.class", "btn-secondary");

    // Screen container
    cy.get(screenRendererSelector)
      .should("be.visible")
      .and("have.class", "container-mobile")
      .and("have.css", "width", "480px");
  });

  it("should render the input control in desktop preview", () => {
    const variableNames = [];

    cy.get(screenContainerSelector).each(($el) => {
      cy.wrap($el).click();

      cy.get('[data-cy="inspector-name"]').then(($input) => {
        variableNames.push($input.val());
      });
    });

    cy.get(modePreviewSelector).click();

    cy.wrap(variableNames).then((names) => {
      expect(names.length).to.be.greaterThan(0);

      names.forEach((name) => {
        cy.get(`[data-cy="screen-field-${name}"]`).should("be.visible");
      });
    });
  });

  it("should render the input control in mobile preview", () => {
    const variableNames = [];

    cy.get(screenContainerSelector).each(($el) => {
      cy.wrap($el).click();

      cy.get('[data-cy="inspector-name"]').then(($input) => {
        variableNames.push($input.val());
      });
    });

    cy.get(modePreviewSelector).click();
    cy.get(mobileButtonSelector).click();

    cy.wrap(variableNames).then((names) => {
      expect(names.length).to.be.greaterThan(0);

      names.forEach((name) => {
        cy.get(`[data-cy="screen-field-${name}"]`).should("be.visible");
      });
    });
  });
});
