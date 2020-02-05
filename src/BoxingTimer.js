import React from "react";

import { Box, Container, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogActions } from "@material-ui/core/";
import "./BoxingTimer.scss";

import Clock from "./Clock";
import Combos from "./Combos";
import RoundSettings from "./RoundSettings";

const useStyles = makeStyles(theme => ({
  // root: {
  //   margin: theme.spacing(6, 0, 3),
  // },
  // lightBulb: {
  //   verticalAlign: 'middle',
  //   marginRight: theme.spacing(1),
  // },
  complete: {
    filled: {
      // background: theme.palette.primary
    }
  }
}));

function renderProgress(i, complete) {
  return <li key={i} className={complete ? "filled" : ""}></li>;
}
function Round(props) {
  const classes = useStyles();
  let progress = [];
  for (let i = 0; i < props.numberOfRounds; i++) {
    progress.push(renderProgress(i, i <= props.roundsCompleted));
  }

  return (
    <div>
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
      numberOfRounds: 5,
      roundsCompleted: 0,
      restRound: false,
      matchEnded: false,
      minutes: 0,
      seconds: 8,
      restSeconds: 4,
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
      this.setState({
        restRound: !restRound
      });
    } else {
      this.setState({ matchEnded: true, canEdit: true });
    }
  }

  lockSettings(event) {
    console.log("lock");
    this.setState({ canEdit: false });
  }
  changeSettings(event) {
    Object.entries(event).map(([key, value]) => {
      console.log(key, value);
      this.setState({
        [key]: value
      });
    });
    this.setState({ roundsCompleted: 0, matchEnded: false });
  }

  render() {
    const numberOfRounds = this.state.numberOfRounds;
    const seconds = this.state.seconds;
    const minutes = this.state.minutes;
    const restRound = this.state.restRound;
    const roundsCompleted = this.state.roundsCompleted;
    const timeRemaining = this.state.restRound
      ? toMilliseconds(0, this.state.restSeconds)
      : toMilliseconds(minutes, seconds);
    return (
      <div>
        <RoundSettings
          numberOfRounds={numberOfRounds}
          minutes={minutes}
          seconds={seconds}
          edit={this.state.canEdit}
          updateSettings={this.changeSettings}
        />
        {this.state.restRound ? "Resting" : "Go"}
        <Round
          numberOfRounds={numberOfRounds}
          roundsCompleted={roundsCompleted}
          restRound={this.state.restRound}
        />
        <Clock
          matchEnded={this.state.matchEnded}
          timeRemaining={timeRemaining}
          countDown={!restRound}
          lockSettings={this.lockSettings}
          incrementRound={() => this.incrementRound()}
        />
        <Combos />
      </div>
    );
  }
}

function toMilliseconds(minutes, seconds) {
  return minutes * 60000 + seconds * 1000;
}
