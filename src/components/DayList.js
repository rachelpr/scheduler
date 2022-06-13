import React from "react";
import DayListItem from "./DayListItem";

// returns a component to show the list of days
export default function DayList(props) {
  const daysList = props.days.map((day) => {
    return (
      <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.value}
        setDay={props.onChange}
      />
    );
  });
  return <ul>{daysList}</ul>;
}
