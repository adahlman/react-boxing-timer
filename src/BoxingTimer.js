import React from "react";

import "./BoxingTimer.scss";

import Clock from "./Clock";
import Combos from "./Combos";
import RoundSettings from "./RoundSettings";

function Round(props) {
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
export default class BoxingTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRounds: 3,
      roundsCompleted: 0,
      restRound: false,
      matchEnded: false,
      minutes: 0,
      seconds: 20,
      restSeconds: 4,
      combos: false, // not implemented yet
      canEdit: true
    };
    this.changeSettings = this.changeSettings.bind(this);
    this.lockSettings = this.lockSettings.bind(this);
  }

  incrementRound() {
    const roundsCompleted = this.state.roundsCompleted;
    const restRound = this.state.restRound;
    if (roundsCompleted < this.state.numberOfRounds - 1) {
      if (restRound) {
        this.setState({ roundsCompleted: roundsCompleted + 1 });
      }
      this.setState({ restRound: !restRound });
    } else {
      this.setState({ matchEnded: true, canEdit: true });
    }
  }

  lockSettings(event) {
    this.setState({ canEdit: event });
    if (event) {
      this.setState({
        roundsCompleted: 0,
        restRound: false,
        matchEnded: false
      });
    }
  }
  changeSettings(event) {
    Object.entries(event).map(([key, value]) => {
      this.setState({ [key]: value });
    });
    this.setState({ roundsCompleted: 0, matchEnded: false });
  }

  render() {
    const numberOfRounds = this.state.numberOfRounds;
    const seconds = this.state.seconds;
    const minutes = this.state.minutes;
    const restRound = this.state.restRound;
    const roundsCompleted = this.state.roundsCompleted;
    const timeRemaining = restRound
      ? toMilliseconds(this.state.restSeconds)
      : toMilliseconds(seconds, minutes);
    return (
      <div>
        <RoundSettings
          numberOfRounds={numberOfRounds}
          minutes={minutes}
          seconds={seconds}
          edit={this.state.canEdit}
          combos={this.state.combos}
          updateSettings={this.changeSettings}
        />
        <Round
          numberOfRounds={numberOfRounds}
          roundsCompleted={roundsCompleted}
          restRound={restRound}
        />
        <Clock
          matchEnded={this.state.matchEnded}
          timeRemaining={timeRemaining}
          countDown={!restRound}
          lockSettings={this.lockSettings}
          incrementRound={() => this.incrementRound()}
        />

        {/* TODO: Implement combo generator */}
        {/* {!this.state.combos ? null : (
          <Combos
            running={
              !restRound && !this.state.matchEnded && !this.state.canEdit
            }
          />
        )} */}
      </div>
    );
  }
}

function toMilliseconds(seconds, minutes = 0) {
  return minutes * 60000 + seconds * 1000;
}
