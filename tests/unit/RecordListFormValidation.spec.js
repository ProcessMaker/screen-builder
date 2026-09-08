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
});
