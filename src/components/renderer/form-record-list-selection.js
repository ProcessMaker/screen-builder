/**
 * Pure helpers for FormRecordList collection radio/checkbox selection.
 * Kept outside the Vue SFC so unit tests can exercise production logic
 * without mounting the heavy FormRecordList component tree.
 */

import {
  mapCollectionRecordData,
  normalizeCollectionFieldPath
} from "../../collectionFieldUtils";

export function isSingleFieldSelectionMode(source) {
  return (
    source?.dataSelectionOptions === "single-field" ||
    (source?.dataSelectionOptions == null && !!source?.singleField)
  );
}

function uniqueFieldKeys(...keys) {
  return keys.filter(
    (key, index, arr) => key != null && key !== "" && arr.indexOf(key) === index
  );
}

/**
 * Resolve the configured singleField value from a collection row.
 * Rows are remapped from collection field names (content) to column keys,
 * so singleField may not match Object.keys(row) directly.
 * Supports legacy `data.` prefixed field paths via collectionFieldUtils.
 */
export function getSingleFieldValue(selectedItem, source, fields) {
  const rawField = source?.singleField;
  const normalizedField = normalizeCollectionFieldPath(rawField);
  if (!normalizedField || !selectedItem || typeof selectedItem !== "object") {
    return undefined;
  }

  for (const key of uniqueFieldKeys(normalizedField, rawField)) {
    if (Object.hasOwn(selectedItem, key)) {
      return selectedItem[key];
    }
  }

  const optionsList = fields?.optionsList || [];
  const byContent = optionsList.find(
    (opt) =>
      normalizeCollectionFieldPath(opt.content) === normalizedField ||
      opt.content === rawField
  );
  if (byContent) {
    for (const key of uniqueFieldKeys(
      normalizeCollectionFieldPath(byContent.key),
      byContent.key
    )) {
      if (Object.hasOwn(selectedItem, key)) {
        return selectedItem[key];
      }
    }
  }

  const byKey = optionsList.find(
    (opt) =>
      normalizeCollectionFieldPath(opt.key) === normalizedField ||
      opt.key === rawField
  );
  if (byKey) {
    for (const key of uniqueFieldKeys(
      normalizeCollectionFieldPath(byKey.key),
      byKey.key
    )) {
      if (Object.hasOwn(selectedItem, key)) {
        return selectedItem[key];
      }
    }
  }

  const lower = String(normalizedField).toLowerCase();
  const matchedKey = Object.keys(selectedItem).find(
    (key) =>
      String(normalizeCollectionFieldPath(key)).toLowerCase() === lower
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
 * Remap collection API rows from field content names to column keys using
 * collectionFieldUtils, always preserving the configured singleField.
 */
export function remapCollectionRowData(dataObject, optionsList, singleField) {
  const sourceData = dataObject || {};
  const mapped = mapCollectionRecordData(sourceData, optionsList || []);

  if (!singleField) {
    return mapped;
  }

  const normalizedField = normalizeCollectionFieldPath(singleField);
  const directSourceKey = uniqueFieldKeys(
    singleField,
    normalizedField,
    `data.${normalizedField}`
  ).find((candidate) => Object.hasOwn(sourceData, candidate));

  if (directSourceKey) {
    mapped[normalizedField] = sourceData[directSourceKey];
    return mapped;
  }

  const matchedKey = Object.keys(sourceData).find(
    (key) => normalizeCollectionFieldPath(key) === normalizedField
  );
  if (matchedKey) {
    mapped[normalizedField] = sourceData[matchedKey];
  }

  return mapped;
}
