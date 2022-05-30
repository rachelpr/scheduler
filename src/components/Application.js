import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });

  // get appointments for a specific day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // get interviewers for a specific day
  const dailyInterviewers = getInterviewersForDay(state, state.day);

  const bookInterview = function (id, interview) {
    //console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    
    console.log(interview)
    return axios.put(`${apptsEndpoint}${id}`, { interview }).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  };

  const appointmentList = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
      />
    );
  });

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

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{appointmentList}</section>
      <Appointment key="last" time="5pm" />
    </main>
  );
}
