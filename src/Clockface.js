import React from "react";
import { leadingZero } from "./utils";
import { RunCodeEnum as RunStatus } from "./constants/enums";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import "./Clock.scss";

const useStyles = makeStyles(theme => ({
  clockFace: {
    padding: theme.spacing(2),
  },
  running: {
    backgroundColor: theme.palette.success.main,
  },
  resting: {
    backgroundColor: theme.palette.warning.light,
  },
  ending: {
    background: theme.palette.error.main,
  },
  "@keyframes flash": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.1 },
    "100%": { opacity: 1 },
  },
  paused: {
    animation: "$flash 2s linear infinite",
  },
}));
function getStatus(props) {
  const runStatus = props.runStatus;
  if (props.warning || runStatus === RunStatus.Ended) {
    console.log(props.warning, runStatus === RunStatus.Ended);
    return "ending";
  } else if (props.restRound) {
    return "resting";
  } else if (
    !(runStatus === RunStatus.Waiting || runStatus === RunStatus.NotStarted)
  ) {
    return "running";
  } else {
    return "";
  }
}
export default function ClockFace(props) {
  const classes = useStyles();
  const minutes = leadingZero(toMinutes(props.timeRemaining));
  const seconds = leadingZero(toSeconds(props.timeRemaining));
  const statusClass = getStatus(props);
  const paused =
    props.runStatus === RunStatus.Paused ||
    props.runStatus === RunStatus.Waiting;

  return (
    <Box m={1}>
      <Paper className={statusClass ? classes[statusClass] : ""}>
        <Typography align='center' className='digital' variant='h2'>
          <span className={paused ? classes.paused : ""}>
            {minutes}:{seconds}
          </span>
        </Typography>
      </Paper>
    </Box>
  );
}

function toMinutes(milliseconds) {
  return Math.floor(milliseconds / 60000);
}
function toSeconds(milliseconds) {
  return ((milliseconds % 60000) / 1000).toFixed(0);
}
