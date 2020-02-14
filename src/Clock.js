import React from "react";

import Clockface from "./Clockface";
import { Button, Grid } from "@material-ui/core";
import "./Clock.scss";

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
    if (seconds === 10000) {
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

    return (
      <div>
        <Clockface
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
