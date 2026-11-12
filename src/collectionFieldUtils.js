const COLLECTION_DATA_PREFIX = "data.";

export function normalizeCollectionFieldPath(fieldPath) {
  if (typeof fieldPath !== "string") {
    return fieldPath;
  }

  return fieldPath.startsWith(COLLECTION_DATA_PREFIX)
    ? fieldPath.slice(COLLECTION_DATA_PREFIX.length)
    : fieldPath;
}

export function getCollectionFieldOptions(collection = {}) {
  const options = [];
  const values = new Set();

  const addOption = ({ text, value }) => {
    const normalizedValue = normalizeCollectionFieldPath(value);

    if (!normalizedValue || values.has(normalizedValue)) {
      return;
    }

    values.add(normalizedValue);
    options.push({
      text: text || normalizedValue,
      value: normalizedValue
    });
  };

  if (Array.isArray(collection?.fields) && collection.fields.length > 0) {
    collection.fields.forEach((field) => {
      if (!field) {
        return;
      }

      addOption({
        text: field.text || field.value,
        value: field.value
      });
    });
  } else {
    const [firstRecord] = collection?.dataRecordList || [];

    if (firstRecord?.data) {
      Object.keys(firstRecord.data).forEach((field) => {
        addOption({ text: field, value: field });
      });
    }
  }

  addOption({ text: "id", value: "id" });

  return options;
}

export function mapCollectionRecordData(data = {}, options = []) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {};
  }

  if (!Array.isArray(options) || options.length === 0) {
    return { ...data };
  }

  const mappedData = {};

  options.forEach((option) => {
    if (!option) {
      return;
    }

    const targetKey = normalizeCollectionFieldPath(
      option.key || option.content
    );
    const sourceKey = [option.content, option.key]
      .map(normalizeCollectionFieldPath)
      .find(
        (candidate) =>
          candidate && Object.prototype.hasOwnProperty.call(data, candidate)
      );

    if (sourceKey && targetKey) {
      mappedData[targetKey] = data[sourceKey];
    }
  });

  return mappedData;
}
