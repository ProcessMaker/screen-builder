describe('Validation Rules (Advanced test)', () => {
  beforeEach(() => {
    cy.server();
    cy.visit('/');
  });

  it('Verify all validation rules within loops', () => {
    cy.loadFromJson('FPP_PFP_CHAIRS_SCREEN.json', 0);
    cy.get('[data-cy=mode-preview]').click();
    // Open Tab 2
    cy.get('[aria-label="Part Time"]:visible:first').click();
    // Tab 2 contains the title '2. PART TIME PAGE'
    cy.get('#preview').should('contain.html', '2. PART TIME PAGE');

    // Check the data is properly loaded
    cy.assertPreviewData({
      'FPP_COLLEGE': '',
      'FPP_DEPARTMENT': '',
      // 'FPP_USER_FULL_TIME': {
      //   'FPP_TL_FULL_TIME': null,
      //   'FPP_NTL_FULL_TIME': null,
      // },
      // @todo this was overwritten to null by SelectList when list is refreshed
      // at FormSelectList.vue @ updateWatcherDependentFieldValue()
      'FPP_USER_FULL_TIME': null,
      'FPP_NAME_FULL_TIME': '',
      'FPP_RANK_FULL_TIME': '',
      'FPP_EMPLOYEE_FULL_TIME': '',
      'FPP_FULL_TIME_FRONTLOAD_UNDERLOAD': null,
      'FPP_FULL_TIME_REGULAR_LOAD': null,
      'buttonSaveFullTime': null,
      'buttonSubmit': null,
      'FPP_SUB_TOTAL_UNITS_NTL_FULL_TIME': '0',
      'FPP_SUB_TOTAL_FACULTY_TL_FULL_TIME': '0',
      'FPP_SUB_TOTAL_PREMIUM_TL_FULL_TIME': '0',
      'FPP_REQUEST_ID': '',
      // 'FPP_USER_PART_TIME': {
      //   'FPP_TL_PART_TIME': null,
      //   'FPP_NTL_PART_TIME': null,
      // },
      // @todo this was overwritten to null by SelectList when list is refreshed
      // at FormSelectList.vue @ updateWatcherDependentFieldValue()
      'FPP_USER_PART_TIME': null,
      'FPP_NAME_PART_TIME': '',
      'FPP_RANK_PART_TIME': '',
      'FPP_EMPLOYEE_PART_TIME': '',
      'FPP_GRAND_TOTAL_PART_TIME': '0',
      'FPP_PART_TIME_FRONTLOAD_UNDERLOAD': null,
      'FPP_PART_TIME_REGULAR_LOAD': null,
      'FPP_REMARKS_PART_TIME': '',
      'FPP_SUB_TOTAL_UNITS_NTL_PART_TIME': '0',
      'FPP_SUB_TOTAL_FACULTY_TL_PART_TIME': '0',
      'FPP_SUB_TOTAL_PREMIUM_TL_PART_TIME': '0',
      'subTotalPremiumTLFullTime': 0,
      'subTotalFacultyTLFullTime': 0,
      'FPP_GRAND_TOTAL_FULL_TIME': 0,
      'subTotalUnitsNTLPartTime': 0,
      'subTotalPremiumTLPartTime': 0,
      'subTotalFacultyTLPartTime': 0,
      'grandTotalPartTime': 0,
      'subTotalTeachingTLFullTime': 0,
      'subTotalUnitsNTLFullTime': 0,
      'FPP_FULL_TIME_OVERLOAD': 0,
      'FPP_FULL_TIME_PREMIUM_TOTAL': 0,
      'FPP_PART_TIME_OVERLOAD': 0,
      'FPP_PART_TIME_PREMIUM_TOTAL': 0,
    });
  });
});
