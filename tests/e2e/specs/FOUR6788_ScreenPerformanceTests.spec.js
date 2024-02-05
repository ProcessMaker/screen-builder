describe("FOUR-6788 screen performance", () => {
  // @todo Improve the boot-time of the stand alone app (general and within cypress)
  const avgBootTime = 16000;
  const minimumPerformanceScore = 12;
  const accessibility = 50;

  // This test includes a Loop with 6 iterations, multi-column, select lists, rich texts and text areas
  it("Verify FOUR-6788 screen performance: select list, rich text", () => {
    const maximumScreenRenderTime = 6000;

    cy.loadFromJson("FOUR-6788_screen_performance.json");
    cy.visit("/?scenario=RenderScreen");
    const customThresholds = {
      performance: minimumPerformanceScore,
      accessibility,
      interactive: avgBootTime + maximumScreenRenderTime
    };

    const desktopConfig = {
      formFactor: "desktop",
      screenEmulation: { disabled: true }
    };

    cy.lighthouse(customThresholds, desktopConfig);
  });

  // This test includes a Loop with 6 iterations, multi-column, select lists, rich texts,
  // text areas, input texts, validations rules, visibility rules and a submit button
  it("Verify FOUR-6788 screen performance: input text, validations, visibility rules", () => {
    const maximumScreenRenderTime = 6000;

    cy.loadFromJson("FOUR-6788_screen_performance_2.json");
    cy.visit("/?scenario=RenderScreen2");
    const customThresholds = {
      performance: minimumPerformanceScore,
      accessibility,
      interactive: avgBootTime + maximumScreenRenderTime
    };

    const desktopConfig = {
      formFactor: "desktop",
      screenEmulation: { disabled: true }
    };

    cy.lighthouse(customThresholds, desktopConfig);
  });
});
