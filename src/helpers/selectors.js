//Various helper functions for interviews and appointments

// find the correct day based on day provided using filter
export function getAppointmentsForDay(state, day) {
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

// gets and interview object and returns it
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

// gets the interviewers for the day and returns an array of interviewer objects
export function getInterviewersForDay(state, day) {
  // find the correct day based on day provided using filter
  const filteredDay = state.days.filter((apptDay) => apptDay.name === day)[0];

  if (!filteredDay) {
    return [];
  }
  let filterInterviewer = filteredDay.interviewers;

  // get interviewers array and push to interviewerAry
  let interviewerAry = [];
  for (let interviewerID of filterInterviewer) {
    if (state.interviewers[interviewerID])
      interviewerAry.push(state.interviewers[interviewerID]);
  }
  return interviewerAry;
}
