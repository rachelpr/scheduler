export function getAppointmentsForDay(state, day) {
  
  // find the correct day based on day provided using filter
  const filteredDay = state.days.filter(apptDay => apptDay.name === day)[0];

  if (!filteredDay){
    return [];
  }

  // get appointments array and push to appointmentsAry
  let appointmentsAry = [];
  for (let apptID of filteredDay.appointments) {
    if (state.appointments[apptID])
      appointmentsAry.push(state.appointments[apptID]);
  }
  return appointmentsAry;
}

