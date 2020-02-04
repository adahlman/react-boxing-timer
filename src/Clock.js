import React from "react";

import Typography from "@material-ui/core/Typography";
import { Button, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import "./Clock.scss";

const useStyles = makeStyles(theme => ({
  // root: {
  //   margin: theme.spacing(6, 0, 3),
  // },
  // lightBulb: {
  //   verticalAlign: 'middle',
  //   marginRight: theme.spacing(1),
  // },
  clockFace: {
    padding: theme.spacing(2)
  }
}));

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: null,
      matchEnded: props.matchEnded,
      seconds: props.timeRemaining,
      running: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleToggle() {
    const running = this.state.running;
    if (!this.props.matchEnded) {
      running ? this.stop() : this.start();
    }
  }

  handleReset() {
    this.stop();
    if (!this.props.matchEnded) {
      this.setState({ timeRemaining: this.props.timeRemaining });
      this.start();
    }
  }

  start() {
    if (!this.state.running) {
      if (!this.state.timeRemaining) {
        this.setState({ timeRemaining: this.props.timeRemaining });
      }
      this.setState({
        running: true
      });
      this.timer = setInterval(this.tick, 1000);
    }
  }
  stop() {
    this.setState({ running: false });
    clearInterval(this.timer);
  }
  tick = () => {
    let seconds = this.state.timeRemaining;
    if (seconds <= 0) {
      this.props.incrementRound();
      this.handleReset();
      return;
    }
    this.setState({
      timeRemaining: seconds - 1000
    });
  };
  renderClock(minutes, seconds) {}
  render() {
    const timeRemaining = this.state.timeRemaining
      ? this.state.timeRemaining
      : this.props.timeRemaining;
    const minutes = leadingZero(toMinutes(timeRemaining));
    const seconds = leadingZero(toSeconds(timeRemaining));
    const running = this.state.running;

    return (
      <div>
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12}>
            <Paper>
              <h3 className='digital'>
                {minutes}:{seconds}
              </h3>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant='contained'
              color='primary'
              disabled={this.props.matchEnded}
              onClick={this.handleToggle}>
              {running ? "Pause" : "Start"}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant='contained' onClick={this.handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function leadingZero(number) {
  return number < 10 ? "0" + number : number;
}

function toMinutes(milliseconds) {
  return Math.floor(milliseconds / 60000);
}
function toSeconds(milliseconds) {
  return ((milliseconds % 60000) / 1000).toFixed(0);
}
