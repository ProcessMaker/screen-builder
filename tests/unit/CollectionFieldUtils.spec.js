import {
  getCollectionFieldOptions,
  mapCollectionRecordData,
  normalizeCollectionFieldPath
} from "../../src/collectionFieldUtils";

describe("collection field utilities", () => {
  describe("normalizeCollectionFieldPath", () => {
    it("removes only the leading data prefix", () => {
      expect(normalizeCollectionFieldPath("data.case_number")).toBe(
        "case_number"
      );
      expect(normalizeCollectionFieldPath("data.data.case_number")).toBe(
        "data.case_number"
      );
      expect(normalizeCollectionFieldPath("metadata.data.case_number")).toBe(
        "metadata.data.case_number"
      );
    });

    it("preserves non-string values", () => {
      expect(normalizeCollectionFieldPath(null)).toBeNull();
      expect(normalizeCollectionFieldPath(undefined)).toBeUndefined();
      expect(normalizeCollectionFieldPath(42)).toBe(42);
    });
  });

  describe("getCollectionFieldOptions", () => {
    it("uses normalized schema fields, removes duplicates, and adds id", () => {
      const result = getCollectionFieldOptions({
        fields: [
          { text: "Case Number", value: "data.case_number" },
          { text: "Duplicate Case Number", value: "case_number" },
          { text: "Status", value: "data.status" },
          null
        ],
        dataRecordList: [
          { data: { populated_record_only: "must not be included" } }
        ]
      });

      expect(result).toEqual([
        { text: "Case Number", value: "case_number" },
        { text: "Status", value: "status" },
        { text: "id", value: "id" }
      ]);
    });

    it("does not duplicate id when it is present in the schema", () => {
      expect(
        getCollectionFieldOptions({
          fields: [{ text: "Collection Record ID", value: "data.id" }]
        })
      ).toEqual([{ text: "Collection Record ID", value: "id" }]);
    });

    it("falls back to the first record when the schema is unavailable", () => {
      expect(
        getCollectionFieldOptions({
          fields: [],
          dataRecordList: [
            { data: { case_number: "C-100", status: "open" } },
            { data: { second_record_only: "must not be included" } }
          ]
        })
      ).toEqual([
        { text: "case_number", value: "case_number" },
        { text: "status", value: "status" },
        { text: "id", value: "id" }
      ]);
    });

    it("offers id for an empty collection", () => {
      expect(getCollectionFieldOptions()).toEqual([
        { text: "id", value: "id" }
      ]);
    });
  });

  describe("mapCollectionRecordData", () => {
    it("maps legacy prefixed options to flat keys without changing the input", () => {
      const data = { id: 501, case_number: "C-100", status: "open" };

      expect(
        mapCollectionRecordData(data, [
          { content: "data.case_number", key: "data.case_number" },
          { content: "data.id", key: "data.id" }
        ])
      ).toEqual({ case_number: "C-100", id: 501 });
      expect(data).toEqual({ id: 501, case_number: "C-100", status: "open" });
    });

    it("uses the key as a source fallback and keeps aliases", () => {
      expect(
        mapCollectionRecordData({ case_number: "C-100" }, [
          { key: "data.case_number" }
        ])
      ).toEqual({ case_number: "C-100" });

      expect(
        mapCollectionRecordData({ case_number: "C-100" }, [
          { content: "data.case_number", key: "claim" }
        ])
      ).toEqual({ claim: "C-100" });
    });

    it("preserves record data while columns are not ready", () => {
      const data = { id: 501, case_number: "C-100" };
      const result = mapCollectionRecordData(data, []);

      expect(result).toEqual(data);
      expect(result).not.toBe(data);
    });
  });
});
