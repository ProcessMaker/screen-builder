describe("Custom CSS", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  function openCustomCssEditor() {
    cy.get("[data-cy=topbar-css]").click();
    cy.get("#custom-css").should("be.visible");
    cy.get("[data-cy=monaco-editor]").scrollIntoView().should("be.visible");
  }

  function assertCustomCss(value) {
    cy.get("[data-cy=monaco-editor]").should(($editor) => {
      const { __vue__: vue } = $editor[0];
      const { editor } = vue;
      if (!editor) {
        throw new Error("Monaco editor is not ready");
      }
      expect(editor.getValue()).to.equal(value);
    });
  }

  function setCustomCss(value) {
    cy.get("[data-cy=monaco-editor]").then(($editor) => {
      const { __vue__: vue } = $editor[0];
      const { editor } = vue;
      editor.setValue(value);
    });
    assertCustomCss(value);
  }

  it("Shows Modal", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
  });

  it("Closes Modal", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
    cy.get("#custom-css___BV_modal_header_ > .close").click();
    cy.get("#custom-css").should("not.exist");
  });

  it("Does Not Save Custom CSS", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
    setCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
    cy.get("[data-cy=cancel-button]").click();
    cy.get("#custom-css").should("not.exist");
    openCustomCssEditor();
    assertCustomCss("");
  });

  it("Saves Custom CSS", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
    setCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
    assertCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
    cy.get("[data-cy=save-button]").click();
    cy.get("#custom-css").should("not.exist");
    openCustomCssEditor();
    assertCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
  });

  it("Does not add styling to element in design mode", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
    setCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
    cy.get("[data-cy=save-button]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get(".page").should("contain.html", '<div selector="new_input_css">');
    cy.get("[data-cy=mode-editor]").click();
    cy.get("[data-cy=editor-content]").should(
      "not.contain.class",
      "custom-css-scope"
    );
  });

  it("Adds styling to element in preview mode", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    openCustomCssEditor();
    setCustomCss(
      "div[selector='new_input_css'] {background-color:red;padding:10px;}"
    );
    cy.get("[data-cy=save-button]").click();
    cy.get("[data-cy=mode-preview]").click();
    cy.get(".page").should("contain.html", '<div selector="new_input_css">');
  });
});
