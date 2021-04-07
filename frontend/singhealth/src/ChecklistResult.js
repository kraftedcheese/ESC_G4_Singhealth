import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  issueCard: {
    margin: theme.spacing(4, 4),
  },
  cardContainer: {
    width: "300px",
  },
  media:{
    height:200,
  },
}));

function IssueCard(props) {
  const {name, due_date, desc, image} = props;
  const classes = useStyles();

  const displayDate = (date_string) => {
    let date = new Date(date_string);
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear();
    return(`${dd}/${mm}/${yyyy}`);
  }

  return (
    <Grid item xs={10} sm={5} md={3} className={classes.issueCard}>
      <Card className={classes.cardContainer}>
        <CardHeader title={name}/>
        <CardMedia
          className={classes.media}
          image={image}
        />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {"Due: " + displayDate(due_date)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {desc}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function ChecklistResult() {
  const { setValues, data } = useData();
  const history = useHistory();
  const classes = useStyles();
  const { register, handleSubmit, setValue, errors } = useForm();

  const DisplayData = Object.keys(data.audit).map((category) => (
    <div>
      <h3>{category}</h3>
      <p>
        Weighted Category Score: {Math.round(data.audit[category].catScore)}
      </p>
      {Object.keys(data.audit[category].issues).length > 0 && (
        <h4>Known issues:</h4>
      )}
      {Object.entries(data.audit[category].issues).map(([issue, items]) => (
        <div>
          <IssueCard name={issue} {...items} ></IssueCard>
        </div>
      ))}
    </div>
  ));

  // const handleComplete = (e) => {
  //   e.preventDefault();

    

  //   axios.post("http://singhealthdb.herokuapp.com/api/audit", {
  //     params: { secret_token: token },
  //   })
  //   .then((response) => {
  //     console.log("success", response);
  //     history.push("/home");
  //   })
  //   .catch((error) => {
  //     alert(error);
  //   });
  // };

  return data === null ? (
    <div>you messed up</div>
  ) : (
    <div>
      <h1>Results</h1>
      {DisplayData}
      <h3>Total Score: {Math.round(data.score)}</h3>
      <h1>{data.score > 95 ? "PASSED!" : "FAILED"}</h1>
      <Button
        color="primary"
        variant="contained"
        className={classes.formControl}
      >
        Complete Audit
      </Button>
    </div>
  );
}
