import resolveCollectionMode from "../../src/components/renderer/collection-record-mode";

const readScreenId = 101;
const updateScreenId = 202;

function getScreenId(collectionMode) {
  return resolveCollectionMode(collectionMode) === "View"
    ? readScreenId
    : updateScreenId;
}

describe("FormCollectionRecordControl mode resolution", () => {
  test("preserves each configured mode when a shared dynamic record changes", () => {
    const controls = [
      { collectionMode: { modeId: "Edit" }, screenId: updateScreenId },
      { collectionMode: { modeId: "View" }, screenId: readScreenId }
    ];

    [1, 2].forEach(() => {
      controls.forEach(({ collectionMode, screenId }) => {
        expect(getScreenId(collectionMode)).toBe(screenId);
      });
    });
  });

  test("defaults to Edit when collection mode is not configured", () => {
    expect(resolveCollectionMode()).toBe("Edit");
    expect(getScreenId()).toBe(updateScreenId);
  });
});
