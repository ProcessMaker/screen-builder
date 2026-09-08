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
});
