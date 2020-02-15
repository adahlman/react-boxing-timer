import React from "react";

import Clockface from "./Clockface";
import { Button, Grid } from "@material-ui/core";
import { RunCodeEnum as RunStatus } from "./constants/enums";
import { lookup } from "./utils";

import "./Clock.scss";
const ReactDOM = require("react-dom");

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: props.timeRemaining,
      warning: false,
    };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleResetAll = this.handleResetAll.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keyup", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.handleKeyPress);
    clearInterval(this.timer);
  }

  handleKeyPress(event) {
    const runStatus = this.props.runStatus;
    if (
      event.keyCode === 32 &&
      (runStatus !== RunStatus.Ended || runStatus !== RunStatus.Waiting)
    ) {
      // han default behavior if start/stop toggle button is still selected
      if (
        document.activeElement === ReactDOM.findDOMNode(this.refs.startButton)
      ) {
        return;
      }
      this.handleToggle();
    }
  }

  handleResetAll() {
    clearInterval(this.timer);
    this.setState({
      timeRemaining: this.props.timeRemaining,
    });
    this.props.runStatusChange(RunStatus.NotStarted);
  }

  handleToggle() {
    const runStatus = this.props.runStatus;
    if (runStatus === RunStatus.NotStarted) {
      this.setState({
        timeRemaining: this.props.timeRemaining,
      });
      this.start();
      return;
    }
    if (this.props.runStatus !== RunStatus.Ended) {
      this.props.runStatus === RunStatus.Running ? this.stop() : this.start();
    }
  }

  handleReset() {
    this.stop();
    if (this.props.runStatus !== RunStatus.Ended) {
      this.setState({ timeRemaining: this.props.timeRemaining });
      this.start();
    }
  }

  beginRound() {
    if (this.props.countDown) {
      clearInterval(this.timer);
      this.setState({
        timeRemaining: this.props.timeRemaining,
      });
      this.props.runStatusChange(RunStatus.Waiting);
      setTimeout(() => {
        this.start();
      }, 2000);
    } else {
      this.start();
    }
  }
  start() {
    if (
      this.props.runStatus === RunStatus.Paused ||
      this.props.runStatus === RunStatus.NotStarted ||
      this.props.runStatus === RunStatus.Waiting
    ) {
      this.props.runStatusChange(RunStatus.Running);
      this.timer = setInterval(this.tick, 1000);
    }
  }
  stop() {
    if (this.props.runStatus !== RunStatus.Ended) {
      this.props.runStatusChange(RunStatus.Paused);
    }
    clearInterval(this.timer);
  }
  tick = () => {
    let seconds = this.state.timeRemaining;
    if (seconds <= 0) {
      this.props.incrementRound();
      this.stop();
      this.setState({
        warning: false,
      });
      if (this.props.runStatus !== RunStatus.Ended) {
        this.setState({
          timeRemaining: this.props.timeRemaining,
        });
        this.beginRound();
      }
      return;
    }
    if (seconds === 10000) {
      this.setState({
        warning: true,
      });
    }
    this.setState({
      timeRemaining: seconds - 1000,
    });
  };

  render() {
    const runStatus = this.props.runStatus;
    const timeRemaining =
      runStatus !== RunStatus.NotStarted
        ? this.state.timeRemaining
        : this.props.timeRemaining;
    // lookup(this.props.runStatus, RunStatus);

    return (
      <div>
        <Clockface
          timeRemaining={timeRemaining}
          warning={this.state.warning}
          restRound={!this.props.countDown}
          runStatus={runStatus}
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
              ref='startButton'
              disabled={
                runStatus === RunStatus.Ended || runStatus === RunStatus.Waiting
              }
              onClick={this.handleToggle}>
              {runStatus === RunStatus.Running ? "Pause" : "Start"}
            </Button>
          </Grid>
          <Grid item xs={3}>
            {runStatus === RunStatus.NotStarted ? null : (
              <Button
                variant='contained'
                onClick={this.handleResetAll}
                disabled={runStatus === RunStatus.Waiting}>
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
