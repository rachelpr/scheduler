import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function useApplicationData() {
  // combined state for day, days, appointments, interviewers
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });

  // books an interview
  const bookInterview = function (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.put(`${apptsEndpoint}${id}`, { interview }).then(() => {
      // getting the new days array to be updated
      // passing a snapshot of state/appointments
      const updatedDays = getUpdatedDaysArray({
        ...state,
        appointments,
      });
      setState({
        ...state,
        appointments,
        days: [...updatedDays],
      });
    });
  };

  const getUpdatedDaysArray = function (newState) {
    //search for the day in state
    const foundDay = newState.days.find((day) => day.name === newState.day);
    // update the foundDay.spots with the spots remaining
    foundDay.spots = countSpots(newState);
    // getting the index of the day in newState
    const foundDayIndex = newState.days.findIndex(
      (day) => day.name === newState.day
    );
    // create a copy of the days array
    const daysCopy = [...newState.days];
    //update foundDay in daysCopy
    daysCopy[foundDayIndex] = foundDay;
    // setting the newState with the updated copy of the days array
    return daysCopy;
  };

  // cancels/deletes an interview
  const cancelInterview = function (id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.delete(`${apptsEndpoint}${id}`).then(() => {
      const updatedDays = getUpdatedDaysArray({
        ...state,
        appointments,
      });
      setState({
        ...state,
        appointments,
        days: [...updatedDays],
      });
    });
  };

  // counts the number of spots
  const countSpots = function (newState) {
    let spotsFree = 0;
    //use getAppointmentsForDay to get the appointments array
    //loop through appointments array (in day)
    for (let appointment of getAppointmentsForDay(newState, newState.day)) {
      //check if the interview has a null value
      if (appointment.interview === null) {
        spotsFree += 1;
      }
    }
    return spotsFree;
  };

  // various API endpoints
  const daysEndpoint = "/api/days/";
  const apptsEndpoint = "/api/appointments/";
  const interviewersEndpoint = "/api/interviewers/";

  useEffect(() => {
    // after component renders get all the data from api endpoints
    Promise.all([
      axios.get(daysEndpoint),
      axios.get(apptsEndpoint),
      axios.get(interviewersEndpoint),
    ])
      .then(([days, appointments, interviewers]) => {
        setState((prev) => ({
          ...prev,
          days: days.data,
          appointments: appointments.data,
          interviewers: interviewers.data,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { state, setDay, bookInterview, cancelInterview, countSpots };
}
