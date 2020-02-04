import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select
} from "@material-ui/core/";
import leadingZero from "./functions";

export default class RoundSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRounds: props.numberOfRounds,
      minutes: props.minutes,
      seconds: props.seconds,
      open: false
    };
    this.handleOpenDialog = this.handleOpenDialog.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOpenDialog() {
    this.setState({ open: true });
  }
  handleCloseDialog() {
    this.setState({ open: false });
  }
  handleInputChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.value
    });
  }
  handleSubmit(event) {
    this.props.updateSettings(this.state);
    this.handleCloseDialog();
    // event.preventDefault();
  }
  renderSelect(scale) {
    let element = [];
    for (let i = 0; i <= scale; i++) {
      element.push(
        <MenuItem value={i} key={i.toString()}>
          {leadingZero(i)}
        </MenuItem>
      );
    }
    return element;
  }
  render() {
    const open = this.state.open;
    const numberOfRounds = this.state.numberOfRounds;
    const seconds = this.state.seconds;
    const minutes = this.state.minutes;
    const numberOfRoundOptions = this.renderSelect(10);
    const minutesOptions = this.renderSelect(15);
    const secondsOptions = this.renderSelect(59);
    return (
      <div>
        <Button variant='contained' onClick={this.handleOpenDialog}>
          Open Settings
        </Button>
        <Dialog open={open} onClose={this.handleCloseDialog}>
          <DialogTitle>Round Settings</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <FormControl>
                <FormLabel component='legend'>Number of Rounds</FormLabel>
                <Select
                  name='numberOfRounds'
                  value={numberOfRounds}
                  onChange={this.handleInputChange}>
                  {numberOfRoundOptions}
                </Select>
              </FormControl>
              <br />
              <FormLabel component='legend'>Round Length:</FormLabel>
              <FormControl>
                <Select
                  name='minutes'
                  value={minutes}
                  onChange={this.handleInputChange}>
                  {minutesOptions}
                </Select>
              </FormControl>
              :
              <FormControl>
                <Select
                  name='seconds'
                  value={seconds}
                  onChange={this.handleInputChange}>
                  {secondsOptions}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={this.handleSubmit}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
