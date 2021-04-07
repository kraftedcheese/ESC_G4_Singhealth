import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function ChecklistResult() {
  const { setValues, data } = useData();
  const classes = useStyles(useTheme);
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm();

  const DisplayData = Object.keys(data.audit).map(category => (
    <div>
      <h3>{category}</h3>
      <p>Weighted Category Score: {Math.round(data.audit[category].catScore)}</p>
      {(Object.keys(data.audit[category].issues).length > 0) && <h4>Known issues:</h4>}
      {Object.entries(data.audit[category].issues)
        .map(([issue, items]) => (
          <div>
            <p>{issue}</p>
          </div>
        ))}
    </div>
  ));

  const handleComplete = (e) => {
    e.preventDefault();
    axios
      .post("")
  }

  return data === null ? (
    <div>you messed up</div>
  ) : (
    <div>
      <h1>Results</h1>
      {DisplayData}
      <h3>Total Score: {Math.round(data.score)}</h3>
      <h1>{(data.score > 95) ? "PASSED!" : "FAILED" }</h1>
      <Button color="primary" variant="contained" className={classes.formControl}>Complete Audit</Button>
    </div>
  );
}
