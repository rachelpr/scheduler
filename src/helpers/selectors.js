export function getAppointmentsForDay(state, day) {
  // find the correct day based on day provided using filter
  const filteredDay = state.days.filter((apptDay) => apptDay.name === day)[0];

  if (!filteredDay) {
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

//console.log(getAppointmentsForDay());

export function getInterview(state, interview) {
  let interviewObj = {};
  if (interview === null) {
    return null;
  } else {
    interviewObj.student = interview.student;
    interviewObj.interviewer = state.interviewers[interview.interviewer];
  }
  return interviewObj;
}

//console.log(getInterview());

export function getInterviewersForDay(state, day) {
  // find the correct day based on day provided using filter
  const filteredDay = state.days.filter((apptDay) => apptDay.name === day)[0];
  //console.log(filteredDay);

  if (!filteredDay) {
    return [];
  }
  let filterInterviewer = filteredDay.interviewers;
  //console.log(filterInterviewer);
  
  // get interviewers array and push to interviewerAry
  let interviewerAry = [];
  for (let interviewerID of filterInterviewer) {
    if (state.interviewers[interviewerID])
      interviewerAry.push(state.interviewers[interviewerID]);
  }
  //console.log(interviewerAry);
  return interviewerAry;
}
