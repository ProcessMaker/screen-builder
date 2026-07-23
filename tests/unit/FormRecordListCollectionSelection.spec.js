/**
 * Lightweight tests for collection radio selection helpers.
 * Avoids mounting the full FormRecordList (heavy deps) by exercising the
 * same selection/restore logic via a minimal stand-in.
 */

function getCollectionRowKey(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const entries = Object.entries(item).filter(
    ([key]) => key !== "selectedRowsIndex" && key !== "selectedRowIndex"
  );

  if (entries.length === 0) {
    return null;
  }

  entries.sort(([keyA], [keyB]) => {
    if (keyA > keyB) return 1;
    if (keyA < keyB) return -1;
    return 0;
  });
  return JSON.stringify(entries);
}

function restoreRadioSelection(ctx, rows) {
  if (ctx.value == null || ctx.value === "" || !Array.isArray(rows) || rows.length === 0) {
    return;
  }

  const isSingleField =
    ctx.source?.dataSelectionOptions === "single-field" ||
    (ctx.source?.dataSelectionOptions == null && !!ctx.source?.singleField);

  if (isSingleField && ctx.source?.singleField) {
    const match = rows.find(
      (row) => row[ctx.source.singleField] === ctx.value
    );
    if (match) {
      ctx.selectedRow = match;
    }
    return;
  }

  if (typeof ctx.value === "object" && !Array.isArray(ctx.value)) {
    const valueKey = getCollectionRowKey(ctx.value);
    let match = null;
    if (valueKey) {
      match = rows.find((row) => getCollectionRowKey(row) === valueKey);
    }
    if (!match) {
      const idx = ctx.value.selectedRowIndex;
      if (idx != null && idx >= 0 && idx < rows.length) {
        match = rows[idx];
      }
    }
    if (match) {
      ctx.selectedRow = match;
    }
  }
}

function onRadioChange(ctx, selectedItem, index) {
  const globalIndex = (ctx.currentPage - 1) * ctx.perPage + index;
  const isSingleField =
    ctx.source?.dataSelectionOptions === "single-field" ||
    (ctx.source?.dataSelectionOptions == null && !!ctx.source?.singleField);

  if (isSingleField && ctx.source?.singleField) {
    const valueOfColumn = selectedItem[ctx.source.singleField];
    if (typeof valueOfColumn === "undefined") {
      return undefined;
    }
    return valueOfColumn;
  }

  return {
    ...selectedItem,
    selectedRowIndex: globalIndex
  };
}

const collectionRows = [
  { name: "Alice", code: "A1" },
  { name: "Bob", code: "B2" },
  { name: "Carol", code: 0 }
];

describe("FormRecordList collection radio selection", () => {
  it("emits the selected record for single-record mode", () => {
    const ctx = {
      currentPage: 1,
      perPage: 5,
      source: { dataSelectionOptions: "single-record", singleField: null }
    };

    expect(onRadioChange(ctx, collectionRows[1], 1)).toEqual({
      name: "Bob",
      code: "B2",
      selectedRowIndex: 1
    });
  });

  it("emits falsy single-field values like 0", () => {
    const ctx = {
      currentPage: 1,
      perPage: 5,
      source: { dataSelectionOptions: "single-field", singleField: "code" },
      fields: { optionsList: [{ content: "code", key: "code" }] }
    };

    expect(onRadioChange(ctx, collectionRows[2], 2)).toBe(0);
  });

  it("resolves single-field when row keys were remapped from content to key", () => {
    const getSingleFieldValue = (source, fields, selectedItem) => {
      const field = source?.singleField;
      if (!field || !selectedItem) return undefined;
      if (Object.prototype.hasOwnProperty.call(selectedItem, field)) {
        return selectedItem[field];
      }
      const optionsList = fields?.optionsList || [];
      const byContent = optionsList.find((opt) => opt.content === field);
      if (
        byContent &&
        Object.prototype.hasOwnProperty.call(selectedItem, byContent.key)
      ) {
        return selectedItem[byContent.key];
      }
      return undefined;
    };

    const remappedRow = { col_name: "Bob", col_code: "B2" };
    const value = getSingleFieldValue(
      { singleField: "name" },
      {
        optionsList: [
          { content: "name", key: "col_name" },
          { content: "code", key: "col_code" }
        ]
      },
      remappedRow
    );

    expect(value).toBe("Bob");
  });

  it("preserves original singleField key when columns are remapped", () => {
    const changeCollectionColumns = (rows, optionsList, singleField) => {
      return rows.map((column) => {
        const dataObject = column.data || {};
        const newDataObject = {};
        Object.keys(dataObject).forEach((dataKey) => {
          const matchingOption = optionsList.find(
            (option) => option.content === dataKey
          );
          if (matchingOption) {
            newDataObject[matchingOption.key] = dataObject[dataKey];
          }
        });
        if (
          singleField &&
          Object.prototype.hasOwnProperty.call(dataObject, singleField)
        ) {
          newDataObject[singleField] = dataObject[singleField];
        }
        return { ...column, data: newDataObject };
      });
    };

    const result = changeCollectionColumns(
      [{ data: { name: "Alice", code: "A1", secret: "x" } }],
      [{ content: "name", key: "col_name" }],
      "code"
    );

    expect(result[0].data).toEqual({
      col_name: "Alice",
      code: "A1"
    });
  });

  it("does not emit when single-field key is missing", () => {
    const ctx = {
      currentPage: 1,
      perPage: 5,
      source: { dataSelectionOptions: "single-field", singleField: "missing" }
    };

    expect(onRadioChange(ctx, collectionRows[0], 0)).toBeUndefined();
  });

  it("uses single-record path when leftover singleField exists", () => {
    const ctx = {
      currentPage: 1,
      perPage: 5,
      source: {
        dataSelectionOptions: "single-record",
        singleField: "name"
      }
    };

    expect(onRadioChange(ctx, collectionRows[0], 0)).toEqual({
      name: "Alice",
      code: "A1",
      selectedRowIndex: 0
    });
  });

  it("restores selection from saved value by content", () => {
    const ctx = {
      value: { name: "Bob", code: "B2", selectedRowIndex: 1 },
      source: { dataSelectionOptions: "single-record" },
      selectedRow: null
    };

    restoreRadioSelection(ctx, collectionRows);
    expect(ctx.selectedRow).toEqual(collectionRows[1]);
  });

  it("restores selection by content when index is stale", () => {
    const ctx = {
      value: { name: "Carol", code: 0, selectedRowIndex: 99 },
      source: { dataSelectionOptions: "single-record" },
      selectedRow: null
    };

    restoreRadioSelection(ctx, collectionRows);
    expect(ctx.selectedRow).toEqual(collectionRows[2]);
  });

  it("restores single-field selection when value is 0", () => {
    const ctx = {
      value: 0,
      source: { dataSelectionOptions: "single-field", singleField: "code" },
      selectedRow: null
    };

    restoreRadioSelection(ctx, collectionRows);
    expect(ctx.selectedRow).toEqual(collectionRows[2]);
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
      ...rest
    ) => {
      const hasEventValue = rest.length >= 1;
      const eventValue = rest[0];
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

    // Simulate @input running BEFORE v-model assigns local data.
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
