describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    // Visits the root of our web server
    cy.visit("/");
    cy.contains("Monday");
  });
  // ---- Test 1 ----
  xit("should book an interview", () => {
    // Clicks on the "Add" button in the second appointment
    cy.get("[alt=Add]").first().click();
    // Enters their name
    cy.get("input").type("Lydia Miller-Jones");
    // Chooses an interviewer
    cy.get("[alt='Sylvia Palmer']").click();
    // Clicks the save button
    cy.contains("Save").click();
    // Sees the booked appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });
  // ---- Test 2 ----
  xit("should edit an interview", () => {
    // Clicks the edit button for the existing appointment
    cy.get("[alt=Edit]").click({ force: true });
    // Changes the name and interviewer
    cy.get("[alt='Tori Malcolm']").click();
    cy.get('[type="text"]').clear().type("Lydia Miller-Jones");
    // Clicks the save button
    cy.contains("Save").click();
    // Sees the edit to the appointment
    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Tori Malcolm");
  });
  // ---- Test 3 ----
  it("should cancel an interview", () => {
    // Clicks the delete button for the existing appointment
    cy.get("[alt=Delete").click({ force: true });
    // Clicks the confirm button
    cy.contains("Confirm").click();
    // Check for deleting
    cy.contains("Deleting").should("exist");
    // Check deleting indicator doesn't exist
    cy.contains("Deleting").should("not.exist");
    // Sees that the appointment slot is empty
    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
