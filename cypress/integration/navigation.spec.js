describe("Navigation", () => {
  // ---- Test 1 ----
  it("should visit root", () => {
    cy.visit("/");
  });
  // ---- Test 2 ----
  it("should navigate to Tuesday", () => {
    cy.visit("/");
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.class", "day-list__item--selected");
  });
});
