const sizes = [
  [700, 800],
  [1000, 800],
  [1200, 768]
];
const backgroundColor = ["rgb(0, 0, 255)", "rgb(255, 0, 0)", "rgb(0, 128, 0)"];

describe("Media Query CSS", () => {
  before(() => {
    // run these tests as if in a desktop
    cy.visit("/");
    cy.openAcordeon("collapse-2");
    cy.get("[data-cy=controls-FormInput]").drag("[data-cy=screen-drop-zone]", {
      position: "bottom"
    });
    cy.get("[data-cy=screen-element-container]").click();
    cy.get("[data-cy=accordion-Advanced]").click();
    cy.get("[data-cy=inspector-customCssSelector]").type("new_input_css");
    cy.get("[data-cy=topbar-css]").click();
    cy.wait(500);
    // write the media query in the custom css panel
    cy.get("#custom-css").type(
      `@media (max-width: 480px) {{}{del}
      div[selector="new_input_css"] {{}{del}
        background-color: blue;
      }
    }

    @media (min-width: 481px) and (max-width: 810px) {{}{del}
      div[selector="new_input_css"] {{}{del}
        background-color: red;
      }
    }

    @media (min-width: 811px) {{}{del}
      div[selector="new_input_css"] {{}{del}
        background-color: green;
      }
    }
  `,
      { parseSpecialCharSequences: true }
    );

    cy.wait(500);
    cy.get("[data-cy=save-button]").click();
    // preview
    cy.get("[data-cy=mode-preview]").click();
  });

  sizes.forEach((size, index) => {
    // make assertions on the screen using
    // an array of different viewports
    it(`Should display screen on ${size} screen`, () => {
      if (Cypress._.isArray(size)) {
        cy.viewport(size[0], size[1]);
      } else {
        cy.viewport(size);
      }

      cy.wait(300);
      cy.get("[selector=new_input_css]")
        .should("have.css", "background-color")
        .and("eq", backgroundColor[index]);
    });
  });
});
