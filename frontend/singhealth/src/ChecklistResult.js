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

  const DisplayData = Object.entries(data).map(([category, issues]) => (
    <div>
      <h3>{category}</h3>
      <p>Category Score: {data[category].catScore}</p>
      <h4>Known issues:</h4>
      {
        Object.entries(data[category])
        .filter(issue => issue[1].ok == "false")
        .map(([issue, items]) => (
          <div>
            <p>{issue}</p>
          </div>
        ))
      }
      {/* {
          data[category].reduce( () )
      } */}
    </div>
    ))

  return (
    <div>
      <h3>Results</h3>
      {DisplayData}
      <h3>{data.score}</h3>
    </div>
  );
}
