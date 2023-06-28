describe('Device Visiblility Inspector', () => {
  it('Verify if an input has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a checkbox has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormCheckbox]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a datePicker has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormDatePicker]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FileDownload has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FileDownload]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FileUpload has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FileUpload]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormImage has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormImage]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormLoop has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormLoop]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormMultiColumn has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormMultiColumn]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormNestedScreen has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormNestedScreen]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormButton has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormButton]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormRecordList has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormRecordList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormHtmlViewer has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormHtmlViewer]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormSelectList has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormSelectList]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Verify if a FormTextArea has device visiblility settings', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormTextArea]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Enabled device visiblility', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        expect(control.children('input')).to.have.length(1);
        // get label
        expect(control.children('label')).to.have.length(1);
        // get Window reference from element
        const win = control.children('label')[0].ownerDocument.defaultView;
        // use getComputedStyle to read the pseudo selector
        console.log(control.children('label')[0]);
        const before = win.getComputedStyle(control.children('label')[0], 'before');
        // read the value of the `content` CSS property
        const contentValue = before.getPropertyValue('background-color');
        // the returned value will have double quotes around it, but this is correct
        expect(contentValue).to.eq('rgb(0, 123, 255)');
        // if have a label
        expect(control.children('label')).to.have.length(1);
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
  it('Disabled device visiblility', () => {
    cy.visit('/');
    cy.get('[data-cy=controls-FormInput]').drag('[data-cy=screen-drop-zone]', 'bottom');
    cy.get('[data-cy=screen-element-container]').click();
    cy.get('[data-cy=accordion-Advanced]').click();
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        // forced click over the control
        control.children('input').trigger("click");
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
    cy.wait(200);
    cy.get('[data-cy=inspector-deviceVisibility]').children().children('.custom-control')
      .each((control) => {
        //GET INPUT
        expect(control.children('input')).to.have.length(1);
        // get label
        expect(control.children('label')).to.have.length(1);
        // get Window reference from element
        const win = control.children('label')[0].ownerDocument.defaultView;
        // use getComputedStyle to read the pseudo selector
        console.log(control.children('label')[0]);
        const before = win.getComputedStyle(control.children('label')[0], 'before');
        // read the value of the `content` CSS property
        const contentValue = before.getPropertyValue('background-color');
        // the returned value will have double quotes around it, but this is correct
        debugger;
        expect(contentValue).to.eq('rgb(255, 255, 255)');
      })
      .then(($lis) => {
        expect($lis).to.have.length(2); // true
      });
  });
});