import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function ChecklistResult() {
  const { setValues, data } = useData();
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm();

  const DisplayData = Object.entries(data.audit).map(([category, issues]) => (
    <div>
      <h3>{category}</h3>
      <p>Weighted Category Score: {Math.round(data.audit[category].catScore)}</p>
      <h4>Known issues:</h4>
      {Object.entries(data.audit[category])
        .filter((issue) => issue[1].ok == "false")
        .map(([issue, items]) => (
          <div>
            <p>{issue}</p>
          </div>
        ))}
    </div>
  ));

  return data === null ? (
    <div>you messed up</div>
  ) : (
    <div>
      <h1>Results</h1>
      {DisplayData}
      <h3>Total Score: {Math.round(data.score)}</h3>
      <h1>{(data.score > 95) ? "PASSED!" : "FAILED" }</h1>
    </div>
  );
}
