import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

// returns component for the appointment
export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // setup for mode/transitoin/back hook
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

    // confirms the booking
  function confirm() {
    transition(CONFIRM);
  }

  // transitions to edit if the form is being edited
  const editForm = () => {
    transition(EDIT);
  };

  // saves the appointment
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING, true);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  }

  // deletes the appointment
  function deleteInterview(event) {
    transition(DELETE, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => transition(ERROR_DELETE, true));
  }
  return (
    <article className="appointment" data-testid="appointment">
      <header>
        <Header time={props.time} />
        {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
        {mode === SHOW && (
          <Show
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={confirm}
            onEdit={editForm}
          />
        )}
        {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => back()}
          />
        )}
        {mode === SAVING && <Status message="Saving" />}
        {mode === DELETE && <Status message="Deleting" />}
        {mode === CONFIRM && (
          <Confirm
            message="Are you sure you want to delete this?"
            onCancel={() => back()}
            onConfirm={deleteInterview}
          />
        )}
        {mode === ERROR_DELETE && (
          <Error
            message="Could not cancel appointment"
            onClose={() => back()}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error
            message="Could not update appointment"
            onClose={() => back()}
          />
        )}
        {mode === EDIT && (
          <Form
            student={props.interview.student}
            interviewer={props.interview.interviewer.id}
            interviewers={props.interviewers}
            onSave={save}
            onCancel={() => back()}
          />
        )}
      </header>
    </article>
  );
}
