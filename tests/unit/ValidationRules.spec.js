import {
  required,
  requiredIf,
  requiredUnless
} from "../../src/mixins/ValidationRules";

const validationContext = {
  getDataAccordingToFieldLevel(data) {
    return data;
  },
  getRootScreen() {
    return {
      addReferenceToParents(data) {
        return data;
      }
    };
  }
};

const activeValidators = [
  ["required", (value) => required(value)],
  [
    "requiredIf",
    (value) =>
      requiredIf("trigger", "true", "field").call(validationContext, value, {
        trigger: true
      })
  ],
  [
    "requiredUnless",
    (value) =>
      requiredUnless("trigger", "true", "field").call(
        validationContext,
        value,
        { trigger: false }
      )
  ]
];

describe.each(activeValidators)("%s", (name, validate) => {
  it.each([
    ["an empty string", ""],
    ["spaces", "   "],
    ["tabs and newlines", "\t\n"],
    ["null", null],
    ["undefined", undefined],
    ["false", false],
    ["an empty array", []]
  ])("rejects %s", (description, value) => {
    expect(validate(value)).toBe(false);
  });

  it.each([
    ["visible text with surrounding spaces", "  value  "],
    ["zero", 0],
    ["a non-empty array", ["value"]]
  ])("accepts %s", (description, value) => {
    expect(validate(value)).toBe(true);
  });
});

describe("inactive conditional required rules", () => {
  it("does not require a value when requiredIf does not match", () => {
    const validate = requiredIf("trigger", "true", "field");

    expect(validate.call(validationContext, "   ", { trigger: false })).toBe(
      true
    );
  });

  it("does not require a value when requiredUnless matches", () => {
    const validate = requiredUnless("trigger", "true", "field");

    expect(validate.call(validationContext, "   ", { trigger: true })).toBe(
      true
    );
  });
});
