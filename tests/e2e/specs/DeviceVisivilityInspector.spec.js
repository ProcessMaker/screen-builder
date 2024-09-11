import {
  addControl,
  addControlInsideLoop,
  previewScreen,
  previewScreenWebMobile,
  addControlInsideTable,
  goToDesigner
} from "../support/utils.js";
import { nodeControls } from "../support/constants.js";

describe("Device Visiblility Inspector", () => {
  it("Verify if an input has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a checkbox has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormCheckbox]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a datePicker has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormDatePicker]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FileDownload has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-6");
    cy.get("[data-cy=controls-FileDownload]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FileUpload has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-6");
    cy.get("[data-cy=controls-FileUpload]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormImage has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormImage]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormLoop has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormLoop]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormMultiColumn has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormMultiColumn]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormNestedScreen has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormNestedScreen]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormButton has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormButton]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormRecordList has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormRecordList]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormHtmlViewer has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.get("[data-cy=controls-FormHtmlViewer]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormSelectList has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormSelectList]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify if a FormTextArea has device visiblility settings", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormTextArea]").drag(
      "[data-cy=screen-drop-zone]",
      { position: "bottom" }
    );
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Enabled device visiblility", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        expect(control.children("input")).to.have.length(1);
        // get label
        expect(control.children("label")).to.have.length(1);
        // get Window reference from element
        const win = control.children("label")[0].ownerDocument.defaultView;
        // use getComputedStyle to read the pseudo selector
        const before = win.getComputedStyle(
          control.children("label")[0],
          "before"
        );
        // read the value of the `content` CSS property
        const contentValue = before.getPropertyValue("background-color");
        // the returned value will have double quotes around it, but this is correct
        expect(contentValue).to.eq("rgb(0, 123, 255)");
        // if have a label
        expect(control.children("label")).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Disabled device visiblility", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        // forced click over the control
        control.children("input").trigger("click");
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
    cy.wait(200);
    cy.get("[data-cy=inspector-deviceVisibility]")
      .children()
      .children(".custom-control")
      .each((control) => {
        // GET INPUT
        expect(control.children("input")).to.have.length(1);
        // get label
        expect(control.children("label")).to.have.length(1);
        // get Window reference from element
        const win = control.children("label")[0].ownerDocument.defaultView;
        // use getComputedStyle to read the pseudo selector
        const before = win.getComputedStyle(
          control.children("label")[0],
          "before"
        );
        // read the value of the `content` CSS property
        const contentValue = before.getPropertyValue("background-color");
        // the returned value will have double quotes around it, but this is correct
        expect(contentValue).to.eq("rgb(255, 255, 255)");
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it("Verify Device Visibility of controls inside a loop", () => {
    cy.visit("/");
    // Step 1: Add Loop
    addControl("Loop");
    cy.openAcordeon("collapse-2");

    // Step 2: Add Line input inside the loop
    addControlInsideLoop(1, nodeControls.formInput);
    cy.get("[data-cy=accordion-Advanced]").click();

    // Step 3: Verify that Device Visibility is visible
    cy.get("[data-cy=inspector-deviceVisibility]").should("be.visible");

    // Step 4: Disable for Show for desktop
    cy.get(
      '[data-cy="inspector-deviceVisibility"]>* div:nth-child(2) > label'
    ).click();

    // Step 5: Press Preview button
    previewScreen();

    // Step 6: Verify that line input is not visible in Web
    previewScreenWebMobile("desktop");
    cy.get("body").then(($body) => {
      const lineinputControlls = $body.find('[name="form_input_1"]').length;
      for (let i = 0; i < lineinputControlls; i++) {
        cy.get('[name="form_input_1"]').eq(i).should("not.be.visible");
      }
    });

    // Step 7: Verify that line input is visible in Mobile
    previewScreenWebMobile("mobile");
  });

  it("Verify Device Visibility of controls inside a Record List", () => {
    cy.visit("/");

    // Step 1: Upload the screen Record List
    const filePath = "recordListDeviceVisibility.json";
    cy.loadFromJson(filePath, 0);

    // Step 2: Press Preview button
    previewScreen();

    // Step 3: Verify that line input is not visible in record list
    previewScreenWebMobile("desktop");
    cy.get('[data-cy="add-row"]').click();
    cy.get('[data-cy="modal-add"]>* footer>button:nth-child(1)').should(
      "be.visible"
    );
    cy.get('[data-cy="screen-field-a"]').first().should("be.visible");
    cy.get('[data-cy="screen-field-b"]').first().should("not.be.visible");

    // Step 4: Close the modal
    cy.get('[data-cy="modal-add"]>* button[aria-label="Close"]').click();

    // Step 5: Verify that line input is visible in record list
    previewScreenWebMobile("mobile");
    cy.get('[data-cy="add-row"]').click();
    cy.get('[data-cy="modal-add"]>* footer>button:nth-child(1)').should(
      "be.visible"
    );
    cy.get('[data-cy="screen-field-a"]').first().should("not.be.visible");
    cy.get('[data-cy="screen-field-b"]').first().should("be.visible");
  });

  it("Verify Device Visibility of controls inside a table", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.openAcordeon("collapse-2");
    // Step 1: Add Loop
    addControl("Multicolumn / Table");

    // Step 2: Add Line input inside the loop
    addControlInsideTable(1, nodeControls.formTextArea);
    cy.get("[data-cy=accordion-Advanced]").click();

    // Step 3: Verify that Device Visibility is visible
    cy.get("[data-cy=inspector-deviceVisibility]").should("be.visible");

    // Step 4: Disable for Show for desktop
    cy.get(
      '[data-cy="inspector-deviceVisibility"]>* div:nth-child(2) > label'
    ).click();

    // Step 5: Press Preview button
    previewScreen();

    // Step 6: Verify that line input is not visible in Web
    previewScreenWebMobile("desktop");
    cy.get('[data-cy="screen-field-form_text_area_1"]').should(
      "not.be.visible"
    );

    // Step 7: Verify that line input is visible in Mobile
    previewScreenWebMobile("mobile");
    cy.get('[data-cy="screen-field-form_text_area_1"]').should("be.visible");
  });

  it("Verify Device Visibility of controls inside a table mobile", () => {
    cy.visit("/");
    cy.openAcordeon("collapse-3");
    cy.openAcordeon("collapse-2");
    // Step 1: Add Table
    addControl("Multicolumn / Table");

    // Step 2: Add Line input inside the loop
    addControlInsideTable(1, nodeControls.formTextArea);
    cy.get("[data-cy=accordion-Advanced]").click();

    // Step 3: Verify that Device Visibility is visible
    cy.get("[data-cy=inspector-deviceVisibility]").should("be.visible");

    // Step 4: Disable for Show for desktop
    cy.get(
      '[data-cy="inspector-deviceVisibility"]>* div:nth-child(3) > label'
    ).click();

    // Step 5: Press Preview button
    previewScreen();

    // Step 6: Verify that line input is not visible in Web
    previewScreenWebMobile("desktop");
    cy.get('[data-cy="screen-field-form_text_area_1"]').should("be.visible");

    // Step 7: Verify that line input is visible in Mobile
    previewScreenWebMobile("mobile");
    cy.get('[data-cy="screen-field-form_text_area_1"]').should(
      "not.be.visible"
    );
  });

  it("Verify Device Visibility of a control and Visibility Rule", () => {
    cy.visit("/");
    // Step 1: Add line input control
    addControl("Line Input");

    // Step 2: Configure the line Input
    cy.get('[data-cy="accordion-Advanced"]').click();
    cy.get('[data-cy="inspector-conditionalHide"').type("true");

    previewScreen();

    // Step 3: Verify that line input is not visible in web
    previewScreenWebMobile("desktop");
    cy.get('[data-cy="screen-field-form_input_1"]').should("be.visible");

    // Step 4: Verify that line input is visible in mobile
    previewScreenWebMobile("mobile");
    cy.get('[data-cy="screen-field-form_input_1"]').should("be.visible");

    // Step 5: Change the configuration in line input
    goToDesigner();
    cy.get('[data-cy="inspector-conditionalHide"').clear().type("false");

    previewScreen();

    // Step 6: Verify that line input is not visible in web
    previewScreenWebMobile("desktop");
    cy.get('[data-cy="screen-field-form_input_1"]').should("not.be.visible");

    // Step 7: Verify that line input is visible in mobile
    previewScreenWebMobile("mobile");
    cy.get('[data-cy="screen-field-form_input_1"]').should("not.be.visible");
  });

  it("Verify Device Visibility with dynamic variable", () => {
    cy.visit("/");

    // Step 1: Upload the screen Record List
    const filePath = "deviceVisibilityDynamic.json";
    cy.loadFromJson(filePath, 0);

    previewScreen();

    // Step 2: Verify that all controls are visible in Web
    previewScreenWebMobile("desktop");
    cy.get('[name="visible"]+label').should("be.visible").click();
    cy.get('[data-cy="screen-field-form_checkbox_1"]')
      .click()
      .should("be.visible");
    cy.get('[data-cy="screen-field-form_date_picker_1"]').should("be.visible");
    cy.get('[data-cy="screen-field-file1"]').click().should("be.visible");
    cy.get('[data-cy="screen-field-form_input_1"]')
      .click()
      .should("be.visible");
    cy.get('[name="loop_1"]>* p').click().should("be.visible");
    cy.get('button[aria-label="Page Navigation"]').click().should("be.visible");
    cy.get('[data-cy="screen-field-form_select_list_1"]')
      .click()
      .should("be.visible");
    cy.get('[data-cy="screen-field-form_text_area_1"]')
      .click()
      .should("be.visible");
    cy.get('button[aria-label="New Submit"]').should("be.visible");

    // Step 3: Configure checkbox visibility = false
    goToDesigner();
    cy.get('[name="visible"]+label').first().click({ force: true });
    cy.get('[data-cy="accordion-Advanced"]').click();
    cy.get(
      '[data-cy="inspector-deviceVisibility"]>* div:nth-child(2) > label'
    ).click();

    previewScreen();

    // Step 6: Verify that controls are visible in mobile
    previewScreenWebMobile("mobile");
    cy.get('[name="visible"]+label').should("be.visible").click();
    cy.get('[data-cy="screen-field-form_checkbox_1"]')
      .click()
      .should("be.visible");
    cy.get('[data-cy="screen-field-form_date_picker_1"]').should("be.visible");
    cy.get('[data-cy="screen-field-file1"]').click().should("be.visible");
    cy.get('[data-cy="screen-field-form_input_1"]')
      .click()
      .should("be.visible");
    cy.get('[name="loop_1"]>* p').click().should("be.visible");
    cy.get('button[aria-label="Page Navigation"]').click().should("be.visible");
    cy.get('[data-cy="screen-field-form_select_list_1"]')
      .click()
      .should("be.visible");
    cy.get('[data-cy="screen-field-form_text_area_1"]')
      .click()
      .should("be.visible");
    cy.get('button[aria-label="New Submit"]').should("be.visible");
  });
});
