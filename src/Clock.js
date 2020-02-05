import React from "react";

import Typography from "@material-ui/core/Typography";
import { Button, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import leadingZero from "./functions";

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
  },
  running: {
    backgroundColor: theme.palette.success.main
  },
  paused: {
    backgroundColor: theme.palette.warning.light
  },
  ended: {
    background: theme.palette.error.main
  }
}));

function ClockFace(props) {
  const classes = useStyles();
  const timeRemaining = props.timeRemaining;
  const minutes = leadingZero(toMinutes(timeRemaining));
  const seconds = leadingZero(toSeconds(timeRemaining));
  return (
    <Paper className={props.status ? classes.running : classes.paused}>
      <h3 className='digital'>
        {minutes}:{seconds}
      </h3>
    </Paper>
  );
}

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: props.timeRemaining,
      matchEnded: props.matchEnded,
      running: false,
      started: false,
      waiting: true
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

  beginRound() {
    console.log("begin");

    if (this.props.countDown) {
      console.log("countdown", this.state.running);
      clearInterval(this.timer);
      this.setState({
        timeRemaining: this.props.timeRemaining
        // started: true,
      });
      setTimeout(() => {
        this.start();
      }, 2000);
    } else {
      console.log("no countdown");
      this.start();
    }
  }
  start() {
    if (!this.state.running && !this.props.matchEnded) {
      // if (!this.state.timeRemaining) {
      //   this.setState({ timeRemaining: this.props.timeRemaining });
      // }
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
      this.stop();
      if (!this.props.matchEnded) {
        this.setState({ timeRemaining: this.props.timeRemaining });
      }
      this.beginRound();

      // this.start();
      return;
    }
    this.setState({
      timeRemaining: seconds - 1000
    });
  };
  render() {
    const running = this.state.running;

    return (
      <div>
        {this.props.countDown ? "waiting" : "regular"}
        <Grid container direction='row' justify='center' alignItems='center'>
          <Grid item xs={12}>
            <ClockFace
              timeRemaining={this.state.timeRemaining}
              status={this.state.running}
            />
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
              Restart Round
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

function toMinutes(milliseconds) {
  return Math.floor(milliseconds / 60000);
}
function toSeconds(milliseconds) {
  return ((milliseconds % 60000) / 1000).toFixed(0);
}
