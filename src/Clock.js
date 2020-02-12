import React from "react";

import Typography from "@material-ui/core/Typography";
import { Box, Button, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import leadingZero from "./functions";

import "./Clock.scss";

const useStyles = makeStyles(theme => ({
  clockFace: {
    padding: theme.spacing(2)
  },
  running: {
    backgroundColor: theme.palette.success.main
  },
  resting: {
    backgroundColor: theme.palette.warning.light,
    span: {}
  },
  ending: {
    background: theme.palette.error.main
  },
  "@keyframes flash": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.1 },
    "100%": { opacity: 1 }
  },
  paused: {
    animation: "$flash 2s linear infinite"
  }
}));

function ClockFace(props) {
  const classes = useStyles();
  const minutes = leadingZero(toMinutes(props.timeRemaining));
  const seconds = leadingZero(toSeconds(props.timeRemaining));
  const status = props.status;
  console.log(props);
  return (
    <Paper className={status ? classes[status] : ""}>
      <h3 className='digital'>
        <span className={props.paused ? classes.paused : ""}>
          {minutes}:{seconds}
        </span>
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
      warning: false,
      waiting: false
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleResetAll = this.handleResetAll.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
    clearInterval(this.timer);
  }
  handleKeyPress(event) {
    if (event.keyCode === 32 && !this.props.matchEnded && !this.state.waiting) {
      this.handleToggle();
    }
  }
  handleResetAll() {
    clearInterval(this.timer);
    this.setState({
      timeRemaining: this.props.timeRemaining,
      started: false,
      running: false
    });
    this.props.lockSettings(true);
  }
  handleToggle() {
    const running = this.state.running;
    const started = this.state.started;
    if (!started) {
      this.setState({
        started: true,
        timeRemaining: this.props.timeRemaining
      });
      this.props.lockSettings(false);
    }
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
    if (this.props.countDown) {
      clearInterval(this.timer);
      this.setState({
        timeRemaining: this.props.timeRemaining,
        warning: false,
        running: false,
        waiting: true
      });
      setTimeout(() => {
        this.setState({ waiting: false });
        this.start();
      }, 2000);
    } else {
      this.start();
    }
  }
  start() {
    if (!this.state.running && !this.props.matchEnded) {
      this.setState({
        running: true,
        warning: false
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
    if (seconds === 2000) {
      this.setState({
        warning: true
      });
    }
    if (seconds <= 0) {
      this.props.incrementRound();
      this.stop();
      if (!this.props.matchEnded) {
        this.setState({ timeRemaining: this.props.timeRemaining });
        this.beginRound();
      }
      return;
    }
    this.setState({
      timeRemaining: seconds - 1000
    });
  };

  getStatus() {
    if (this.state.warning && this.props.countDown) {
      return "ending";
    }
    if (this.state.started) {
      if (!this.props.countDown) {
        return "resting";
      } else if (this.state.running) return "running";
    } else {
      return "";
    }
  }
  render() {
    const running = this.state.running;
    const timeRemaining = this.state.started
      ? this.state.timeRemaining
      : this.props.timeRemaining;
    const status = this.getStatus();
    console.log(this.state);

    return (
      <div>
        <ClockFace
          timeRemaining={timeRemaining}
          status={status}
          paused={
            !this.state.running && this.state.started && !this.props.matchEnded
          }
        />
        <Grid
          container
          direction='row'
          justify='space-between'
          alignItems='center'>
          <Grid item xs={3}>
            <Button
              variant='contained'
              color='primary'
              disabled={this.props.matchEnded || this.state.waiting}
              onClick={this.handleToggle}>
              {running ? "Pause" : "Start"}
            </Button>
          </Grid>
          <Grid item xs={3}>
            {!this.state.started ? null : (
              <Button
                variant='contained'
                onClick={this.handleResetAll}
                disabled={this.state.waiting}>
                Restart all
              </Button>
            )}
          </Grid>
          {/* <Grid item xs={4}>
            {!this.state.started ? null : (
              <Button
                variant='contained'
                onClick={this.handleReset}
                disabled={this.state.waiting}>
                Restart Round
              </Button>
            )}
          </Grid> */}
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
