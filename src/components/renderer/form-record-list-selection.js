/**
 * Pure helpers for FormRecordList collection radio/checkbox selection.
 * Kept outside the Vue SFC so unit tests can exercise production logic
 * without mounting the heavy FormRecordList component tree.
 */

export function isSingleFieldSelectionMode(source) {
  return (
    source?.dataSelectionOptions === "single-field" ||
    (source?.dataSelectionOptions == null && !!source?.singleField)
  );
}

/**
 * Resolve the configured singleField value from a collection row.
 * Rows are remapped from collection field names (content) to column keys,
 * so singleField may not match Object.keys(row) directly.
 */
export function getSingleFieldValue(selectedItem, source, fields) {
  const field = source?.singleField;
  if (!field || !selectedItem || typeof selectedItem !== "object") {
    return undefined;
  }

  if (Object.hasOwn(selectedItem, field)) {
    return selectedItem[field];
  }

  const optionsList = fields?.optionsList || [];
  const byContent = optionsList.find((opt) => opt.content === field);
  if (byContent && Object.hasOwn(selectedItem, byContent.key)) {
    return selectedItem[byContent.key];
  }

  const byKey = optionsList.find((opt) => opt.key === field);
  if (byKey && Object.hasOwn(selectedItem, byKey.key)) {
    return selectedItem[byKey.key];
  }

  const lower = String(field).toLowerCase();
  const matchedKey = Object.keys(selectedItem).find(
    (key) => String(key).toLowerCase() === lower
  );
  return matchedKey ? selectedItem[matchedKey] : undefined;
}

export function rowMatchesSingleFieldValue(row, value, source, fields) {
  return getSingleFieldValue(row, source, fields) === value;
}

/**
 * Convert a b-table page-relative cell index into a global row index.
 * @change already provides a page-relative index; do not pass a global
 * index here or the page offset will be applied twice.
 */
export function toGlobalRowIndex(pageRelativeIndex, currentPage, perPage) {
  return (currentPage - 1) * perPage + pageRelativeIndex;
}

/**
 * Build the value emitted for a radio selection.
 * Returns undefined for missing single-field values (caller should not emit).
 */
export function buildRadioSelectionValue(
  selectedItem,
  pageRelativeIndex,
  currentPage,
  perPage,
  source,
  fields
) {
  if (isSingleFieldSelectionMode(source) && source?.singleField) {
    return getSingleFieldValue(selectedItem, source, fields);
  }

  return {
    ...selectedItem,
    selectedRowIndex: toGlobalRowIndex(
      pageRelativeIndex,
      currentPage,
      perPage
    )
  };
}

export function getCollectionRowKey(item) {
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

export function findSingleRecordRadioMatch(value, rows) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const valueKey = getCollectionRowKey(value);
  if (valueKey) {
    const byContent = rows.find(
      (row) => getCollectionRowKey(row) === valueKey
    );
    if (byContent) {
      return byContent;
    }
  }

  const idx = value.selectedRowIndex;
  if (idx != null && idx >= 0 && idx < rows.length) {
    return rows[idx];
  }
  return null;
}

export function findRadioSelectionMatch(value, rows, source, fields) {
  if (value == null || value === "" || !Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  if (isSingleFieldSelectionMode(source) && source?.singleField) {
    return (
      rows.find((row) =>
        rowMatchesSingleFieldValue(row, value, source, fields)
      ) || null
    );
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return findSingleRecordRadioMatch(value, rows);
  }

  return null;
}

/**
 * Remap collection API rows from field content names to column keys,
 * always preserving the configured singleField under its original name.
 */
export function remapCollectionRowData(dataObject, optionsList, singleField) {
  const sourceData = dataObject || {};
  const newDataObject = {};

  Object.keys(sourceData).forEach((dataKey) => {
    const matchingOption = (optionsList || []).find(
      (option) => option.content === dataKey
    );
    if (matchingOption) {
      newDataObject[matchingOption.key] = sourceData[dataKey];
    }
  });

  if (singleField && Object.hasOwn(sourceData, singleField)) {
    newDataObject[singleField] = sourceData[singleField];
  }

  return newDataObject;
}
