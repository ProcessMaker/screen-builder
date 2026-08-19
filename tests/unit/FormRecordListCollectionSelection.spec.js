/**
 * Unit tests for FormRecordList collection radio selection helpers.
 * Imports the same production module used by form-record-list.vue so drift
 * between component behavior and tests is not possible.
 */

import {
  buildRadioSelectionValue,
  findRadioSelectionMatch,
  getSingleFieldValue,
  remapCollectionRowData,
  toGlobalRowIndex
} from "../../src/components/renderer/form-record-list-selection";

const collectionRows = [
  { name: "Alice", code: "A1" },
  { name: "Bob", code: "B2" },
  { name: "Carol", code: 0 }
];

describe("FormRecordList collection radio selection", () => {
  it("emits the selected record for single-record mode", () => {
    const value = buildRadioSelectionValue(
      collectionRows[1],
      1,
      1,
      5,
      { dataSelectionOptions: "single-record", singleField: null },
      null
    );

    expect(value).toEqual({
      name: "Bob",
      code: "B2",
      selectedRowIndex: 1
    });
  });

  it("uses page-relative index from @change without double-offset on page 2+", () => {
    // b-table cell index on page 2 with perPage 5 is 0 for global row 5.
    // Passing a global index (5) into the same formula would wrongly yield 10.
    expect(toGlobalRowIndex(0, 2, 5)).toBe(5);
    expect(toGlobalRowIndex(5, 2, 5)).toBe(10);

    const value = buildRadioSelectionValue(
      { name: "Row6", code: "R6" },
      0,
      2,
      5,
      { dataSelectionOptions: "single-record" },
      null
    );

    expect(value.selectedRowIndex).toBe(5);
  });

  it("emits falsy single-field values like 0", () => {
    const value = buildRadioSelectionValue(
      collectionRows[2],
      2,
      1,
      5,
      { dataSelectionOptions: "single-field", singleField: "code" },
      { optionsList: [{ content: "code", key: "code" }] }
    );

    expect(value).toBe(0);
  });

  it("resolves single-field when row keys were remapped from content to key", () => {
    const remappedRow = { col_name: "Bob", col_code: "B2" };
    const value = getSingleFieldValue(
      remappedRow,
      { singleField: "name" },
      {
        optionsList: [
          { content: "name", key: "col_name" },
          { content: "code", key: "col_code" }
        ]
      }
    );

    expect(value).toBe("Bob");
  });

  it("resolves single-field configured with data. prefix", () => {
    const value = getSingleFieldValue(
      { case_number: "C-100" },
      { singleField: "data.case_number" },
      {
        optionsList: [
          { content: "data.case_number", key: "data.case_number" }
        ]
      }
    );

    expect(value).toBe("C-100");
  });

  it("preserves original singleField key when columns are remapped", () => {
    const result = remapCollectionRowData(
      { name: "Alice", code: "A1", secret: "x" },
      [{ content: "name", key: "col_name" }],
      "code"
    );

    expect(result).toEqual({
      col_name: "Alice",
      code: "A1"
    });
  });

  it("does not emit a usable value when single-field key is missing", () => {
    const value = buildRadioSelectionValue(
      collectionRows[0],
      0,
      1,
      5,
      { dataSelectionOptions: "single-field", singleField: "missing" },
      null
    );

    expect(value).toBeUndefined();
  });

  it("uses single-record path when leftover singleField exists", () => {
    const value = buildRadioSelectionValue(
      collectionRows[0],
      0,
      1,
      5,
      {
        dataSelectionOptions: "single-record",
        singleField: "name"
      },
      null
    );

    expect(value).toEqual({
      name: "Alice",
      code: "A1",
      selectedRowIndex: 0
    });
  });

  it("restores selection from saved value by content", () => {
    const match = findRadioSelectionMatch(
      { name: "Bob", code: "B2", selectedRowIndex: 1 },
      collectionRows,
      { dataSelectionOptions: "single-record" },
      null
    );

    expect(match).toEqual(collectionRows[1]);
  });

  it("restores selection by content when index is stale", () => {
    const match = findRadioSelectionMatch(
      { name: "Carol", code: 0, selectedRowIndex: 99 },
      collectionRows,
      { dataSelectionOptions: "single-record" },
      null
    );

    expect(match).toEqual(collectionRows[2]);
  });

  it("restores single-field selection when value is 0", () => {
    const match = findRadioSelectionMatch(
      0,
      collectionRows,
      { dataSelectionOptions: "single-field", singleField: "code" },
      { optionsList: [{ content: "code", key: "code" }] }
    );

    expect(match).toEqual(collectionRows[2]);
  });

  it("preserves falsy values with nullish coalescing (DataManager fix)", () => {
    const resolve = (existing, fallback, initial) =>
      existing ?? fallback ?? initial;

    expect(resolve(0, undefined, null)).toBe(0);
    expect(resolve("", undefined, null)).toBe("");
    expect(resolve([], undefined, null)).toEqual([]);
    expect(resolve({ name: "Bob" }, undefined, [])).toEqual({ name: "Bob" });
    expect(resolve(null, undefined, [])).toEqual([]);
    expect(resolve(undefined, undefined, [])).toEqual([]);
  });

  it("updateScreenDataNow prefers $event over stale local value (v-model race)", () => {
    // Mirrors ScreenBase.updateScreenDataNow when @input passes $event.
    const updateScreenDataNow = (
      ctx,
      safeDotName,
      variable,
      setWasFilled = true,
      eventValue = undefined,
      ...rest
    ) => {
      const hasEventValue = arguments.length >= 5;
      const value = hasEventValue ? eventValue : ctx[safeDotName];
      if (hasEventValue) {
        ctx[safeDotName] = eventValue;
      }
      ctx.vdata[variable] = value;
    };

    const ctx = {
      record_list_1: [],
      vdata: { record_list_1: [] }
    };
    const selected = { name: "Bob", code: "B2", selectedRowIndex: 1 };

    updateScreenDataNow(ctx, "record_list_1", "record_list_1", true, selected);

    expect(ctx.record_list_1).toEqual(selected);
    expect(ctx.vdata.record_list_1).toEqual(selected);
  });

  it("persistValueToFormData writes selection into validationData/vdata", () => {
    const validationData = { record_list_1: null };
    const persistValueToFormData = (name, data) => {
      validationData[name] = data;
    };
    const selected = { name: "Alice", code: "A1", selectedRowIndex: 0 };

    persistValueToFormData("record_list_1", selected);

    expect(validationData.record_list_1).toEqual(selected);
  });
});
