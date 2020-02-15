import React from "react";
import "./BoxingTimer.scss";

export default function Round(props) {
  const progress = [...Array(props.numberOfRounds)].map((e, i) => (
    <li className={i <= props.roundsCompleted ? "filled" : ""} key={i}></li>
  ));
  return (
    <div className={props.restRound ? "resting" : ""}>
      <h1>Round {props.roundsCompleted + 1}</h1>
      <ul className={`roundTracker ${props.restRound ? "resting" : ""}`}>
        {progress}
      </ul>
    </div>
  );
}
