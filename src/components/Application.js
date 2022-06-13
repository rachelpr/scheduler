import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

// returns main app component
export default function Application(props) {
  // state for day, days, appointments, and interviewers
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();
 
  // gets intereviewers for certain day
  const interviewers = getInterviewersForDay(state,state.day)
  
  //gets appointments for certain day
  const appointments = getAppointmentsForDay(state,state.day).map(appointment=>{
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        //{...appointment}
        time={appointment.time}
        interview={getInterview(state, appointment.interview)}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  }
);

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
      <section className="schedule">{appointments}
      <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
