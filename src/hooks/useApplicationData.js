import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  const bookInterview = function (id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    //console.log(appointment)
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //console.log(interview)
    return axios.put(`${apptsEndpoint}${id}`, { interview }).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  };

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
      setState({
        ...state,
        appointments,
      });
    });
  };

  // various API endpoints
  const daysEndpoint = "/api/days/";
  const apptsEndpoint = "/api/appointments/";
  const interviewersEndpoint = "/api/interviewers/";

  useEffect(() => {
    Promise.all([
      axios.get(daysEndpoint),
      axios.get(apptsEndpoint),
      axios.get(interviewersEndpoint),
    ]).then(([days, appointments, interviewers]) => {
      // console.log(days.data);
      // console.log(appointments.data);
      // console.log(interviewers.data);
      setState((prev) => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      }));
    });
    //setDays(response.data);
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
}
