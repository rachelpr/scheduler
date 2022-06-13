import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  queryByAltText,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  // ---- Test 1 ----
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });
  // ---- Test 2 ----
  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });
  // ---- Test 3 ----
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Delete" button on the first empty appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));
    // 4. Click the "Confirm" button to confirm the delete.
    expect(
      getByText(appointment, "Are you sure you want to delete this?")
    ).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 5. Wait for delete to be performed
    await waitForElement(() => getByAltText(appointment, "Add"));
    // 6. Check the appointment slot is clear
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  // ---- Test 4 ----
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 4. Change the interviewer name.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 5. Wait for save button to be clicked
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Wait for Saving to be in the document
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Wait for save to be complete.
    // 8. Show updated appointment
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 9. Check appointment spots hasn't changed
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  // ---- Test 5 ----
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Edit button is clicked
    fireEvent.click(queryByAltText(appointment, "Edit"));
    // 4. Click a different interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // 5. Save button is clicked
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check status "saving" is showed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Wait for saving to be done
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    // 8. Show error that appointment couldn't be saved
    expect(
      getByText(appointment, /Could not update appointment/i)
    ).toBeInTheDocument();
    // 7. Use the close button to back out of the error
    fireEvent.click(getByAltText(appointment, "Close"));
  });
  // ---- Test 6 ----
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    // 3. Click the delete button
    fireEvent.click(queryByAltText(appointment, "Delete"));
    // 4. Should see message  "Are you sure you want to delete?"
    expect(
      getByText(appointment, "Are you sure you want to delete this?")
    ).toBeInTheDocument();
    // 5. Confirm deletion and see deleting status
    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    // 6. See the error message - saying can't cancel the appointment
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
    expect(
      getByText(appointment, /Could not cancel appointment/i)
    ).toBeInTheDocument();
    // 7. Use the close button to back out of the error
    fireEvent.click(getByAltText(appointment, "Close"));
  });
});
