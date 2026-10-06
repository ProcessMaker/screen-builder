import DataProvider from "@/DataProvider";

jest.mock("axios-extensions", () => ({
  cacheAdapterEnhancer: jest.fn()
}));

describe("DataProvider data source IDs", () => {
  const params = {
    config: { endpoint: "GetRecord" },
    data: { employee_col_id: 20001 }
  };

  beforeEach(() => {
    window.ProcessMaker = {
      screen: {
        cacheEnabled: false,
        cacheTimeout: 0
      }
    };
    delete window.PM4ConfigOverrides;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test.each([
    ["data_source-7", null, "/requests/data_sources/7"],
    ["data_source-007", null, "/requests/data_sources/007"],
    ["data_source-7", 123, "/requests/123/data_sources/7"],
    [7, null, "/requests/data_sources/7"],
    ["7", null, "/requests/data_sources/7"],
    ["data_source-abc", null, "/requests/data_sources/data_source-abc"],
    [
      "data_source-7-extra",
      null,
      "/requests/data_sources/data_source-7-extra"
    ],
    ["data_source-", null, "/requests/data_sources/data_source-"],
    [
      "data_source-data_source-7",
      null,
      "/requests/data_sources/data_source-data_source-7"
    ],
    [
      "custom-data_source-7",
      null,
      "/requests/data_sources/custom-data_source-7"
    ]
  ])(
    "posts data source %p with request %p to %s",
    async (dataSourceId, requestId, expectedUrl) => {
      const response = { data: { employee: "QA Employee 20001" } };
      const post = jest.spyOn(DataProvider, "post").mockResolvedValue(response);

      await expect(
        DataProvider.postDataSource(dataSourceId, requestId, params)
      ).resolves.toBe(response);

      expect(post).toHaveBeenCalledWith(expectedUrl, params, { timeout: 0 });
    }
  );

  test("preserves authentication parameters after normalizing the ID", async () => {
    window.PM4ConfigOverrides = {
      authParams: { token: "preview-token" }
    };
    const post = jest.spyOn(DataProvider, "post").mockResolvedValue({});

    await DataProvider.postDataSource("data_source-7", null, params);

    expect(post).toHaveBeenCalledWith(
      "/requests/data_sources/7?token=preview-token",
      params,
      { timeout: 0 }
    );
  });

  test.each([
    ["data_source-7", "/requests/data_sources/7"],
    [
      "data_source-data_source-7",
      "/requests/data_sources/data_source-data_source-7"
    ]
  ])(
    "passes the original ID %p through the non-cached fallback",
    async (dataSourceId, expectedUrl) => {
      const response = { data: { data: [] } };
      const postDataSource = jest.spyOn(DataProvider, "postDataSource");
      const post = jest.spyOn(DataProvider, "post").mockResolvedValue(response);

      await expect(
        DataProvider.getDataSource(dataSourceId, params, "request-nonce")
      ).resolves.toEqual([response, "request-nonce"]);

      expect(postDataSource).toHaveBeenCalledWith(dataSourceId, null, params);
      expect(post).toHaveBeenCalledWith(expectedUrl, params, { timeout: 0 });
    }
  );

  test.each([
    ["data_source-7", "/requests/data_sources/7/resources/GetRecord/data"],
    [
      "data_source-007",
      "/requests/data_sources/007/resources/GetRecord/data"
    ],
    [
      "data_source-abc",
      "/requests/data_sources/data_source-abc/resources/GetRecord/data"
    ],
    [
      "data_source-data_source-7",
      "/requests/data_sources/data_source-data_source-7/resources/GetRecord/data"
    ],
    [7, "/requests/data_sources/7/resources/GetRecord/data"]
  ])(
    "uses data source %p consistently on the cached GET path",
    async (dataSourceId, expectedUrl) => {
      window.ProcessMaker.screen.cacheEnabled = true;
      window.ProcessMaker.screen.cacheTimeout = 300000;
      const response = { data: { data: [] } };
      const get = jest.spyOn(DataProvider, "get").mockResolvedValue(response);

      await expect(
        DataProvider.getDataSource(dataSourceId, params, "request-nonce")
      ).resolves.toEqual([response, "request-nonce"]);

      expect(get).toHaveBeenCalledWith(expectedUrl, {
        useCache: true,
        params: {
          pmds_config: JSON.stringify(params.config),
          pmds_data: JSON.stringify(params.data)
        }
      });
    }
  );
});
