import React from "react";
import leadingZero from "./utils";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import "./Clock.scss";

const useStyles = makeStyles(theme => ({
  clockFace: {
    padding: theme.spacing(2)
  },
  running: {
    backgroundColor: theme.palette.success.main
  },
  resting: {
    backgroundColor: theme.palette.warning.light
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

export default function ClockFace(props) {
  const classes = useStyles();
  const minutes = leadingZero(toMinutes(props.timeRemaining));
  const seconds = leadingZero(toSeconds(props.timeRemaining));
  const status = props.status;
  return (
    <Box m={1}>
      <Paper className={status ? classes[status] : ""}>
        <Typography align='center' className='digital' variant='h2'>
          <span className={props.paused ? classes.paused : ""}>
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
