import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import TaskBar from "./TaskBar";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#f06d1a",
  },
  title: {
    position: "absolute",
    top: "100px",
  },
  roundcard: {
    borderRadius: "100px 100px 0px 0px",
    position: "absolute",
    top: "200px",
    minHeight: "100%",
    flexBasis: "auto",
    alignSelf: "flex-end",
  },
}));

//changes the background color, not sure why react doesn't allow you to using css
document.body.style.backgroundColor = "#f06d1a";

export default function Frame(props) {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <TaskBar />
      <Grid container component="main">
        <Grid container alignItems="center" justify="center" item>
          <Typography
            component="h1"
            variant="h2"
            color="secondary"
            className={classes.title}
          >
            {props.title}
          </Typography>
        </Grid>
        <Grid
          container
          justify="center"
          component={Paper}
          className={classes.roundcard}
          elevation={3}
        >
          {props.children}
        </Grid>
      </Grid>
    </div>
  );
}
