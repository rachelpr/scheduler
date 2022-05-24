import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

export default function Application(props) {
  // const appointments = {
  //   "1": {
  //     id: 1,
  //     time: "12pm",
  //   },
  //   "2": {
  //     id: 2,
  //     time: "1pm",
  //     interview: {
  //       student: "Lydia Miller-Jones",
  //       interviewer:{
  //         id: 3,
  //         name: "Sylvia Palmer",
  //         avatar: "https://i.imgur.com/LpaY82x.png",
  //       }
  //     }
  //   },
  //   "3": {
  //     id: 3,
  //     time: "2pm",
  //   },
  //   "4": {
  //     id: 4,
  //     time: "3pm",
  //     interview: {
  //       student: "Archie Andrews",
  //       interviewer:{
  //         id: 4,
  //         name: "Cohana Roy",
  //         avatar: "https://i.imgur.com/FK8V841.jpg",
  //       }
  //     }
  //   },
  //   "5": {
  //     id: 5,
  //     time: "4pm",
  //   }
  // };
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState({ ...state, day });
  //const setDays = (days) => setState((prev) => ({ ...prev, days }));
  const dailyAppointments = getAppointmentsForDay(state,state.day);
  const daysEndpoint = "http://localhost:8001/api/days";
  const apptsEndpoint = "http://localhost:8001/api/appointments";
  const interviewersEndpoint = "http://localhost:8001/api/interviewers";

  useEffect(() => {
    Promise.all([
      axios.get(daysEndpoint),
      axios.get(apptsEndpoint),
      axios.get(interviewersEndpoint),
    ]).then(([days, appointments, interviewers]) => {
      console.log(days.data);
      console.log(appointments.data);
      console.log(interviewers.data);
      setState((prev) => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      }));
    });
    //setDays(response.data);
  }, []);

  const appointmentList = dailyAppointments.map((appointment) => {
      return <Appointment key={appointment.id} {...appointment} />;
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
      <section className="schedule">{appointmentList}</section>
    </main>
  );
}
