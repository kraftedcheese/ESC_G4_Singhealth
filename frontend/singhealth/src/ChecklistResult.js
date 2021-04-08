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
  media: {
    height: 200,
  },
  hr: {
    margin: theme.spacing(0, 8),
  },
  issueCategory: {
    margin: theme.spacing(4, 10, 2),
    textAlign: "left",
  },
  knownIssues: {
    margin: theme.spacing(4, 10, 2),
  },
}));

function IssueCard(props) {
  const { name, due_date, desc, image } = props;
  const classes = useStyles();

  const displayDate = (date_string) => {
    let date = new Date(date_string);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <Grid item xs={10} sm={5} md={3} className={classes.issueCard}>
      <Card className={classes.cardContainer}>
        <CardHeader title={desc} titleTypographyProps={{ variant: "body1" }} />
        {image && <CardMedia className={classes.media} image={image} />}
        <CardContent>
          <Typography gutterBottom variant="h6">
            {"Due: " + displayDate(due_date)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function ChecklistResult() {
  const { setValues, data } = useData();
  const classes = useStyles(useTheme);
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm();

  const DisplayData = Object.keys(data.audit).map((category) => (
    <Grid item container xs={12} direction="row">
      <Grid item container direction="column" xs={12}>
        <Typography className={classes.issueCategory}>
          {category} ({data.audit[category].count}/{data.audit[category].total})
        </Typography>
        <hr color="#f06d1a" className={classes.hr}></hr>
      </Grid>

      {Object.keys(data.audit[category].issues).length > 0 && (
        <Grid item xs={12}>
          <Typography variant="h6" className={classes.knownIssues}>
            Issues
          </Typography>
        </Grid>
      )}
      <Grid item container xs={12} justify="center" direction="row">
        {Object.entries(data.audit[category].issues).map(([issue, items]) => (
          <div>
            <IssueCard name={issue} {...items}></IssueCard>
          </div>
        ))}
      </Grid>
    </Grid>
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

  return (
    <Grid container direction="row">
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.issueCard}>Results</Typography>
      </Grid>
      {DisplayData}

      <Grid
        item
        container
        xs={12}
        justify="center"
        direction="row"
        className={classes.formControl}
      >
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.formControl}>
            Score: {Math.round(data.score)}/100 -{" "}
            {data.score > 95 ? "PASSED!" : "FAILED"}
          </Typography>
        </Grid>

        <Grid item>
          <Button
            color="primary"
            variant="contained"
            className={classes.formControl}
          >
            Complete Audit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
