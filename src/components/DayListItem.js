import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

// returns a component to show each day
export default function DayListItem(props) {
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": props.selected,
    "day-list__item--full": !props.spots,
  });

  // formatting for the spots remaining
  const formatSpots = () => {
    if (props.spots === 0) {
      return "no spots remaining";
    } else if (props.spots === 1) {
      return `${props.spots} spot remaining`;
    } else {
      return `${props.spots} spots remaining`;
    }
  };

  return (
    <li className={dayClass} data-testid="day" onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
