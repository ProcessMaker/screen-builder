jest.mock("../../src/DataProvider", () => ({
  __esModule: true,
  default: {
    getScreen: jest.fn()
  }
}));

import ValidationsFactory, {
  collectFieldNames,
  collectRecordListFormPages
} from "../../src/ValidationsFactory";

function ruleContext() {
  return {
    getRootScreen() {
      return {
        addReferenceToParents: (data) => data
      };
    },
    getDataAccordingToFieldLevel(data) {
      return data;
    },
    $root: {
      $children: [{ $refs: { renderer: { definition: { isMobile: false } } } }]
    }
  };
}

describe("Record List form-page validation on parent submit", () => {
  const definition = {
    config: [
      {
        name: "screen check",
        items: [
          {
            component: "FormCheckbox",
            config: {
              name: "root_checkbox_1",
              validation: [{ value: "required", content: "Required" }]
            }
          },
          {
            component: "FormCheckbox",
            config: {
              name: "root_checkbox_2",
              validation: [{ value: "required", content: "Required" }]
            }
          },
          {
            component: "FormRecordList",
            config: {
              name: "form_record_list_1",
              form: "1",
              editable: true
            }
          }
        ]
      },
      {
        name: "RLCheck",
        items: [
          {
            component: "FormCheckbox",
            config: {
              name: "rl_checkbox_1",
              validation: [{ value: "required", content: "Required" }]
            }
          },
          {
            component: "FormCheckbox",
            config: {
              name: "rl_checkbox_2",
              validation: [{ value: "required", content: "Required" }]
            }
          }
        ]
      }
    ]
  };

  it("collects record list form pages and field names", () => {
    expect(collectRecordListFormPages(definition.config[0].items).has("1")).toBe(true);
    const names = collectFieldNames(definition.config[1].items);
    expect(names.has("rl_checkbox_1")).toBe(true);
    expect(names.has("rl_checkbox_2")).toBe(true);
  });

  it("always namespaces record-form fields away from root checkbox names", async () => {
    const validations = {};
    await ValidationsFactory(definition, {
      screen: definition,
      firstPage: 0,
      data: {}
    }).addValidations(validations);

    expect(Object.keys(validations).sort()).toEqual([
      "form_record_list_1__rl_checkbox_1",
      "form_record_list_1__rl_checkbox_2",
      "root_checkbox_1",
      "root_checkbox_2"
    ]);
    expect(validations.rl_checkbox_1).toBeUndefined();
    expect(validations.rl_checkbox_2).toBeUndefined();
  });

  it("fails namespaced rules when the record list is empty", async () => {
    const validations = {};
    await ValidationsFactory(definition, {
      screen: definition,
      firstPage: 0,
      data: { form_record_list_1: [] }
    }).addValidations(validations);

    const ctx = ruleContext();
    const data = { form_record_list_1: [] };
    expect(
      validations.form_record_list_1__rl_checkbox_1.required.call(ctx, undefined, data)
    ).toBe(false);
    expect(
      validations.form_record_list_1__rl_checkbox_2.required.call(ctx, undefined, data)
    ).toBe(false);
  });

  it("passes when rows have required checkboxes selected", async () => {
    const validations = {};
    await ValidationsFactory(definition, {
      screen: definition,
      firstPage: 0,
      data: {
        form_record_list_1: [{ rl_checkbox_1: true, rl_checkbox_2: true }]
      }
    }).addValidations(validations);

    const ctx = ruleContext();
    const data = {
      form_record_list_1: [{ rl_checkbox_1: true, rl_checkbox_2: true }]
    };
    expect(
      validations.form_record_list_1__rl_checkbox_1.required.call(ctx, undefined, data)
    ).toBe(true);
    expect(
      validations.form_record_list_1__rl_checkbox_2.required.call(ctx, undefined, data)
    ).toBe(true);
  });

  it("ignores PageNavigate on the Record Form page (no ghost root rules)", async () => {
    // Mirrors screens where RLcheck has "back to page 0" navigation: following
    // that link while building rowRules used to namespace root checkboxes under
    // form_record_list_1__* and inflate the submit error count (e.g. 10 vs 6).
    const withPageNavigate = {
      config: [
        {
          name: "screen check",
          items: [
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_1",
                validation: [{ value: "required", content: "Required" }]
              }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_2",
                validation: [{ value: "required", content: "Required" }]
              }
            },
            {
              component: "FormLoop",
              config: {
                name: "loop_1",
                settings: { add: true, type: "new", times: "1", varname: "loop_1" }
              },
              items: [
                {
                  component: "FormCheckbox",
                  config: {
                    name: "form_checkbox_3",
                    validation: [{ value: "required", content: "Required" }]
                  }
                },
                {
                  component: "FormCheckbox",
                  config: {
                    name: "form_checkbox_4",
                    validation: [{ value: "required", content: "Required" }]
                  }
                }
              ]
            },
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            },
            {
              component: "FormButton",
              config: { event: "pageNavigate", eventData: "1", label: "Page Navigation" }
            }
          ]
        },
        {
          name: "RLcheck",
          items: [
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_5",
                validation: [{ value: "required", content: "Required" }]
              }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_6",
                validation: [{ value: "required", content: "Required" }]
              }
            },
            {
              component: "FormButton",
              config: { event: "pageNavigate", eventData: "0", label: "Page Navigation" }
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(withPageNavigate, {
      screen: withPageNavigate,
      firstPage: 0,
      data: {}
    }).addValidations(validations);

    const keys = Object.keys(validations).sort();
    expect(keys).toEqual([
      "form_checkbox_1",
      "form_checkbox_2",
      "form_record_list_1__form_checkbox_5",
      "form_record_list_1__form_checkbox_6",
      "loop_1"
    ]);
    // Ghost keys from following PageNavigate back to page 0 must not appear.
    expect(validations.form_record_list_1__form_checkbox_1).toBeUndefined();
    expect(validations.form_record_list_1__form_checkbox_2).toBeUndefined();
    expect(validations.form_record_list_1__form_record_list_1__form_checkbox_5).toBeUndefined();
    expect(validations.form_record_list_1__form_record_list_1__form_checkbox_6).toBeUndefined();
    expect(validations.loop_1.$each.form_checkbox_3).toBeDefined();
    expect(validations.loop_1.$each.form_checkbox_4).toBeDefined();
  });

  it("keeps required rules for inputs inside Loop > MultiColumn (no false parent-hide)", async () => {
    // Regression for Loop.spec "Verify validation with multicolumn":
    // forwarding insideLoop through MultiColumn made parentVisibilityRule walk to
    // missing `_parent` on $each rows, skip required, and allow invalid submit.
    const screen = {
      config: [
        {
          name: "page1",
          items: [
            {
              component: "FormLoop",
              config: {
                name: "loop_1",
                settings: { type: "existing", varname: "loop_1" }
              },
              items: [
                {
                  component: "FormMultiColumn",
                  config: {
                    conditionalHide: 'name != "foo"',
                    items: [[], []]
                  },
                  items: [
                    [
                      {
                        component: "FormInput",
                        config: {
                          name: "form_input_1",
                          validation: [{ value: "required", content: "Required" }]
                        }
                      }
                    ],
                    []
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data: { loop_1: [{ name: "bar" }, { name: "foo" }] }
    }).addValidations(validations);

    expect(validations.loop_1.$each.form_input_1.required).toBeDefined();

    const ctx = ruleContext();
    const rowBar = { name: "bar", form_input_1: "" };
    // Required must still run (not skipped via false parent visibility).
    expect(
      validations.loop_1.$each.form_input_1.required.call(ctx, "", rowBar)
    ).toBe(false);
  });

  it("validates conditionally visible Record Form fields per row (not first-row only)", async () => {
    // Visibility rule (show when): name == "foo".
    // First row (name: bar) hides the required field; second row shows it empty.
    // Building rules from the first row used to omit the field entirely so the
    // parent could submit with an invalid visible later row.
    const screen = {
      config: [
        {
          name: "main",
          items: [
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            }
          ]
        },
        {
          name: "Record Form",
          items: [
            {
              component: "FormInput",
              config: {
                name: "form_input_1",
                conditionalHide: 'name == "foo"',
                validation: [{ value: "required", content: "Required" }]
              }
            }
          ]
        }
      ]
    };

    const data = {
      form_record_list_1: [
        { name: "bar" },
        { name: "foo", form_input_1: "" }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data
    }).addValidations(validations);

    expect(validations.form_record_list_1__form_input_1.required).toBeDefined();

    const ctx = ruleContext();
    // Row 0 hidden → skipped; row 1 visible + empty → fails required.
    expect(
      validations.form_record_list_1__form_input_1.required.call(ctx, undefined, data)
    ).toBe(false);

    const validData = {
      form_record_list_1: [
        { name: "bar" },
        { name: "foo", form_input_1: "ok" }
      ]
    };
    expect(
      validations.form_record_list_1__form_input_1.required.call(
        ctx,
        undefined,
        validData
      )
    ).toBe(true);
  });

  it("requires visible Record Form checkbox after toggle (RLCheck form_checkbox_5/6)", async () => {
    // Mirrors RLcheck: checkbox_6 is required only when checkbox_5 is true.
    // Rules must exist even when built with checkbox_5 false (modal open state /
    // empty seed), and must pass once checkbox_6 is true on the row.
    const screen = {
      config: [
        {
          name: "screen check",
          items: [
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            }
          ]
        },
        {
          name: "RLcheck",
          items: [
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_5",
                validation: [],
                initiallyChecked: false
              }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_6",
                conditionalHide: "form_checkbox_5 == true",
                validation: [{ value: "required", content: "Required" }],
                initiallyChecked: false
              }
            }
          ]
        }
      ]
    };

    // Build with no rows / checkbox_5 false — same as modal mount seed.
    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data: { form_record_list_1: [] }
    }).addValidations(validations);

    expect(validations.form_record_list_1__form_checkbox_6.required).toBeDefined();
    // Toggle control itself is not required (empty validation config).
    expect(
      validations.form_record_list_1__form_checkbox_5 &&
        validations.form_record_list_1__form_checkbox_5.required
    ).toBeUndefined();

    const ctx = ruleContext();

    // Hidden when checkbox_5 is false → do not block submit for that row.
    const hiddenRow = {
      form_record_list_1: [{ form_checkbox_5: false, form_checkbox_6: false }]
    };
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(
        ctx,
        undefined,
        hiddenRow
      )
    ).toBe(true);

    // Shown + unchecked → block submit.
    const visibleEmpty = {
      form_record_list_1: [{ form_checkbox_5: true, form_checkbox_6: false }]
    };
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(
        ctx,
        undefined,
        visibleEmpty
      )
    ).toBe(false);

    // Shown + checked → allow submit.
    const visibleChecked = {
      form_record_list_1: [{ form_checkbox_5: true, form_checkbox_6: true }]
    };
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(
        ctx,
        undefined,
        visibleChecked
      )
    ).toBe(true);
  });

  it("registers conditionally required checkbox even when seed has toggle false (modal mount)", async () => {
    // Always-mounted / first paint of the Record Form modal seeds checkbox_5 as
    // false. Build-time isVisible() used to drop checkbox_6 entirely so Ok/Save
    // could succeed without selecting it once it became visible.
    const screen = {
      config: [
        {
          name: "main",
          items: [
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            }
          ]
        },
        {
          name: "RLcheck",
          items: [
            {
              component: "FormCheckbox",
              config: { name: "form_checkbox_5", validation: [] }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_6",
                conditionalHide: "form_checkbox_5 == true",
                validation: [{ value: "required", content: "Required" }]
              }
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data: {
        form_record_list_1: [{ form_checkbox_5: false, form_checkbox_6: false }]
      }
    }).addValidations(validations);

    expect(validations.form_record_list_1__form_checkbox_6.required).toBeDefined();

    const ctx = ruleContext();
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(ctx, undefined, {
        form_record_list_1: [{ form_checkbox_5: true, form_checkbox_6: false }]
      })
    ).toBe(false);
  });

  it("passes parent submit when mixed rows hide or satisfy the conditional checkbox", async () => {
    const screen = {
      config: [
        {
          name: "main",
          items: [
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            }
          ]
        },
        {
          name: "RLcheck",
          items: [
            {
              component: "FormCheckbox",
              config: { name: "form_checkbox_5", validation: [] }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "form_checkbox_6",
                conditionalHide: "form_checkbox_5 == true",
                validation: [{ value: "required", content: "Required" }]
              }
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data: {}
    }).addValidations(validations);

    const ctx = ruleContext();

    // Row 0: toggle off (hidden required). Row 1: toggle on + checked.
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(ctx, undefined, {
        form_record_list_1: [
          { form_checkbox_5: false, form_checkbox_6: false },
          { form_checkbox_5: true, form_checkbox_6: true }
        ]
      })
    ).toBe(true);

    // Same mix but row 1 leaves required unchecked → fail.
    expect(
      validations.form_record_list_1__form_checkbox_6.required.call(ctx, undefined, {
        form_record_list_1: [
          { form_checkbox_5: false, form_checkbox_6: false },
          { form_checkbox_5: true, form_checkbox_6: false }
        ]
      })
    ).toBe(false);
  });

  it("applies Record Form MultiColumn visibility per row for nested required fields", async () => {
    const screen = {
      config: [
        {
          name: "main",
          items: [
            {
              component: "FormRecordList",
              config: {
                name: "form_record_list_1",
                form: "1",
                editable: true
              }
            }
          ]
        },
        {
          name: "Record Form",
          items: [
            {
              component: "FormMultiColumn",
              config: {
                conditionalHide: "show_extra == true",
                items: [[], []]
              },
              items: [
                [
                  {
                    component: "FormCheckbox",
                    config: {
                      name: "extra_required",
                      validation: [{ value: "required", content: "Required" }]
                    }
                  }
                ],
                []
              ]
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      // Build while the column would be hidden — rule must still be registered.
      data: { form_record_list_1: [{ show_extra: false }] }
    }).addValidations(validations);

    expect(validations.form_record_list_1__extra_required.required).toBeDefined();

    const ctx = ruleContext();
    expect(
      validations.form_record_list_1__extra_required.required.call(ctx, undefined, {
        form_record_list_1: [{ show_extra: false, extra_required: false }]
      })
    ).toBe(true);
    expect(
      validations.form_record_list_1__extra_required.required.call(ctx, undefined, {
        form_record_list_1: [{ show_extra: true, extra_required: false }]
      })
    ).toBe(false);
    expect(
      validations.form_record_list_1__extra_required.required.call(ctx, undefined, {
        form_record_list_1: [{ show_extra: true, extra_required: true }]
      })
    ).toBe(true);
  });

  it("still registers root required fields that start hidden by Visibility Rule", async () => {
    // Same build-time deferral applies outside Record List (e.g. preview modal
    // of a normal page): rules must exist so toggling the gate cannot bypass Ok.
    const screen = {
      config: [
        {
          name: "page1",
          items: [
            {
              component: "FormCheckbox",
              config: { name: "gate", validation: [] }
            },
            {
              component: "FormCheckbox",
              config: {
                name: "gated_required",
                conditionalHide: "gate == true",
                validation: [{ value: "required", content: "Required" }]
              }
            }
          ]
        }
      ]
    };

    const validations = {};
    await ValidationsFactory(screen, {
      screen,
      firstPage: 0,
      data: { gate: false, gated_required: false }
    }).addValidations(validations);

    expect(validations.gated_required.required).toBeDefined();

    const ctx = ruleContext();
    expect(validations.gated_required.required.call(ctx, false, { gate: false })).toBe(
      true
    );
    expect(validations.gated_required.required.call(ctx, false, { gate: true })).toBe(
      false
    );
    expect(validations.gated_required.required.call(ctx, true, { gate: true })).toBe(
      true
    );
  });
});
