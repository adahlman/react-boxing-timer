import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  FormLabel,
  MenuItem,
  Select,
  Switch,
} from "@material-ui/core/";
import { leadingZero } from "./utils";

function renderSelect(scale, min = 0) {
  const range = scale - min + 1;
  const element = [...Array(range)].map((e, i) => {
    const key = min + i;
    return (
      <MenuItem value={key} key={key}>
        {leadingZero(key)}
      </MenuItem>
    );
  });
  return element;
}

function CreateSelect(props) {
  const options = renderSelect(props.max, props.min);
  return (
    <Select
      name={props.name}
      value={props.value}
      onChange={props.handleInputChange}>
      {options}
    </Select>
  );
}

export default class RoundSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfRounds: props.numberOfRounds,
      minutes: props.minutes,
      seconds: props.seconds,
      combos: props.combos,
      open: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleOpenDialog = () => {
    this.setState({ open: true });
  };
  handleCloseDialog = () => {
    this.setState({ open: false });
  };
  handleInputChange(event) {
    const target = event.target;
    this.setState({
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
  }
  handleSwitchChange = event => {
    const target = event.target;
    this.setState({
      [target.name]: target.checked,
    });
  };
  handleSubmit(event) {
    this.props.updateSettings(this.state);
    this.handleCloseDialog();
  }

  render() {
    const open = this.state.open;
    const numberOfRounds = this.state.numberOfRounds;
    const seconds = this.state.seconds;
    const minutes = this.state.minutes;
    return (
      <div>
        <Grid container justify='flex-end'>
          <Button
            variant='contained'
            onClick={this.handleOpenDialog}
            disabled={!this.props.edit}>
            Settings
          </Button>
        </Grid>

        <Dialog open={open} onClose={this.handleCloseDialog}>
          <DialogTitle>Round Settings</DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <FormControl>
                <FormLabel component='legend'>Number of Rounds</FormLabel>
                <CreateSelect
                  name='numberOfRounds'
                  value={numberOfRounds}
                  handleInputChange={this.handleInputChange}
                  max={10}
                  min={1}
                />
              </FormControl>
              <Box>
                <FormLabel component='legend'>Round Length:</FormLabel>

                <Grid container alignItems='center'>
                  <Grid item xs={3}>
                    <FormControl>
                      <CreateSelect
                        name='minutes'
                        value={minutes}
                        max={15}
                        handleInputChange={this.handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} style={{ textAlign: "center" }}>
                    <span>:</span>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl>
                      <CreateSelect
                        name='seconds'
                        value={seconds}
                        max={59}
                        handleInputChange={this.handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                {/* <FormControl>
                  <FormLabel component='legend'>Combos:</FormLabel>
                  <Switch
                    checked={this.state.combos}
                    name='combos'
                    value='combos'
                    onChange={this.handleInputChange}
                  />
                </FormControl> */}
              </Box>
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
