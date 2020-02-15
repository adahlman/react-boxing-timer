import React from "react";

import "./BoxingTimer.scss";

import Clock from "./Clock";
import Combos from "./Combos";
import Round from "./Round";
import RoundSettings from "./RoundSettings";

import { RunCodeEnum as RunStatus } from "./constants/enums";

export default class BoxingTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        numberOfRounds: 3,
        minutes: 0,
        seconds: 13,
        combos: false, // not implemented yet
      },
      restRound: false,
      restSeconds: 3,
      roundsCompleted: 0,
      runStatus: RunStatus.NotStarted,
    };
    this.changeSettings = this.changeSettings.bind(this);
    this.runStatusChange = this.runStatusChange.bind(this);
  }

  incrementRound() {
    const roundsCompleted = this.state.roundsCompleted;
    const restRound = this.state.restRound;
    if (roundsCompleted < this.state.settings.numberOfRounds - 1) {
      if (restRound) {
        this.setState({ roundsCompleted: roundsCompleted + 1 });
      }
      this.setState({ restRound: !restRound });
    } else {
      this.setState({
        runStatus: RunStatus.Ended,
      });
    }
  }

  restartAll() {
    if (this.state.runStatus === RunStatus.NotStarted) {
      this.setState({
        restRound: false,
        roundsCompleted: 0,
      });
    }
  }
  changeSettings(event) {
    this.setState({
      roundsCompleted: 0,
      runStatus: RunStatus.NotStarted,
      settings: event,
    });
  }
  runStatusChange(event) {
    this.setState({ runStatus: event }, this.restartAll);
  }

  render() {
    const settings = this.state.settings;
    const restRound = this.state.restRound;
    const roundsCompleted = this.state.roundsCompleted;
    const runStatus = this.state.runStatus;
    const canEdit =
      runStatus === RunStatus.NotStarted || runStatus === RunStatus.Ended;
    const timeRemaining = restRound
      ? toMilliseconds(this.state.restSeconds)
      : toMilliseconds(settings.seconds, settings.minutes);
    return (
      <div>
        <RoundSettings
          settings={settings}
          edit={canEdit}
          updateSettings={this.changeSettings}
        />
        <Round
          numberOfRounds={settings.numberOfRounds}
          roundsCompleted={roundsCompleted}
          restRound={restRound}
        />
        <Clock
          timeRemaining={timeRemaining}
          countDown={!restRound}
          runStatus={this.state.runStatus}
          incrementRound={() => this.incrementRound()}
          runStatusChange={this.runStatusChange}
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
