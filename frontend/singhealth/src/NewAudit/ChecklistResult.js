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
import useToken from "../Common/useToken";
import useUser from "../Common/useUser";
import ReactDOMServer from "react-dom/server";
import { ClockView } from "@material-ui/pickers";

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
  const { token } = useToken();
  const { user } = useUser();
  const classes = useStyles(useTheme);
  const history = useHistory();
  const { register, handleSubmit, setValue, errors } = useForm();

  const displayDate = (date_string) => {
    let date = new Date(date_string);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    let yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const DisplayData = Object.keys(data.audit).map((category) => (
    <React.Fragment key={category}>
      <Grid item container xs={12} direction="row">
        <Grid item container direction="column" xs={12}>
          <Typography className={classes.issueCategory}>
            {category} ({data.audit[category].count}/
            {data.audit[category].total})
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
            <React.Fragment key={issue}>
              <div>
                <IssueCard name={issue} {...items}></IssueCard>
              </div>
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    </React.Fragment>
  ));

  const convertForDatabase = (data) => {
    try {
      let contract_date = parseInt(data.contract_date.getTime()).toFixed(0);
      data.contract_date = contract_date;
    } catch (error) {
      console.log("Date not converted");
    }
  };

  //note to self: construct an axios spread array.
  const makeIssues = (audit_id) => {
    let issues = [];
    let dataArr = Object.entries(data.audit);
    for (let i = 0; i < dataArr.length; i++) {
      let catIssues = Object.entries(dataArr[i][1].issues);
      if (catIssues.length === 0) console.log("no probs here at" + i);
      else {
        issues.push(
          catIssues.map((issue) => ({
            audit_id: audit_id,
            name: issue[0],
            category: dataArr[i][0],
            description: issue[1].desc,
            due_date: parseInt(issue[1].due_date.getTime()).toFixed(0),
          }))
        );
      }
    }
    return issues.flat();
  };

  const makeMessages = (issue) => {
    let issueData = data.audit[issue.category].issues[issue.name];

    return {
      //issue_id: issue.issue_id,
      issue_id: issue.issue_id,
      staff_id: user.staff_id,
      tenant_id: data.tenant.tenant_id,
      from_staff: true,
      tag: issueData.image ? "textimage" : "textonly",
      body: issueData.desc,
      image: issueData.image,
    };
  };

  //handles the posting of audits. multi step process.
  const handleComplete = (e) => {
    e.preventDefault();

    var audit = {};
    audit.staff_id = user.staff_id;
    audit.tenant_id = data.tenant.tenant_id;
    audit.score = data.score;
    if (data.type===0) audit.type = "nonfnb";
    else if (data.type===1) audit.type = "fnb";
    else if (data.type===2) audit.type = "safe";
    if (data.score === 100) audit.all_resolved = true;

    axios
      .post("http://singhealthdb.herokuapp.com/api/audit", audit, {
        params: { secret_token: token },
      })
      .then((response) => {
        console.log("success", response);
        const audit_id = response.data.audit_id;

        let issues = makeIssues(audit_id).map((issue) => {
          return axios.post(
            "http://singhealthdb.herokuapp.com/api/issue",
            issue,
            {
              params: { secret_token: token },
            }
          );
        });

        Promise.all(issues)
          .then((res) => {
            console.log(res);
            Promise.all(
              res.map((eachRes) => {
                return axios.post(
                  "http://singhealthdb.herokuapp.com/api/message",
                  makeMessages(eachRes.data),
                  {
                    params: { secret_token: token },
                  }
                );
              })
            )
              .then((msgRes) => {
                alert("Completed submission successfully!");
                console.log(msgRes);
                history.push("../home");
              })
              .catch((error) => {
                alert(error);
              });
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleToCSV = (e) => {
    e.preventDefault();
    const { parse } = require('json2csv');

    try {
      var thing = [];
      for (var cat in data.audit) {
        for (var issue in data.audit[cat].original) {
          var items = data.audit[cat].original[issue];
          var temp = {
            'category': cat,
            'issue': issue,
            'clear': items.ok,
            'desc': items.desc,
            'due_date': displayDate(items.due_date),
            'image': items.image,
          }
          thing.push(temp);
        }
      }

      var parsed = parse(thing);
      console.log(parsed);

      var auditType;
      if (data.type===0) auditType = "Non-F&B Audit";
      else if (data.type===1) auditType = "F&B Audit";
      else if (data.type===2) auditType = "Safe Management Audit";

      var encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(parsed);
      var downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", encodedUri);
      downloadAnchorNode.setAttribute("download", auditType + " for " + data.tenant.name + ".csv");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (err) {
      console.error(err);
    }

  };

  const handleEmail = (e) => {
    e.preventDefault();

    var html = ReactDOMServer.renderToStaticMarkup(Email);

    var auditType;
    if (data.type===0) auditType = "Non-F&B Audit";
    else if (data.type===1) auditType = "F&B Audit";
    else if (data.type===2) auditType = "Safe Management Audit";

    var email = {
      to: "morontimes@gmail.com",
      subject:
        auditType + " for " + data.tenant.name + " (" + Math.round(data.score) + "/100)",
      text: "This is to notify you of a recent retail audit at your store.",
      html: html,
    };

    console.log(email);

    axios
      .post("http://singhealthdb.herokuapp.com/api/email", email, {
        params: { secret_token: token },
      })
      .then((res) => {
        console.log(res);
        alert("Email sent successfully!");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const DisplayData2 = Object.keys(data.audit).map((category) => (
    <React.Fragment key={category}>
      <Grid item container xs={12} direction="row">
        <Grid item container direction="column" xs={12}>
          <h2>
            {category} ({data.audit[category].count}/
            {data.audit[category].total})
          </h2>
          <hr color="#f06d1a" className={classes.hr}></hr>
        </Grid>

        <Grid item xs={12}>
          <h3>Issues</h3>
        </Grid>

        <Grid item container xs={12} justify="center" direction="row">
          {Object.entries(data.audit[category].original).map(
            ([issue, items]) => (
              <React.Fragment key={issue}>
                <div>
                  <h4>{issue} {(items.ok==='true') ? '✓' : 'X'}</h4>
                  {(items.ok==='false') && (
                    <div>
                      <p>Description: {items.desc}</p>
                      <p>Due: {displayDate(items.due_date)}</p>
                      {items.image && <img src={items.image}></img>}
                    </div>
                  )}
                </div>
              </React.Fragment>
            )
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  ));

  const Email = (
    <div>
      <h1>Results</h1>

      {DisplayData2}

      <h1>
        Score: {Math.round(data.score)}/100 -{" "}
        {data.score > 95 ? "PASSED" : "FAILED"}
      </h1>
    </div>
  );

  const Result = (
    <Grid container direction="row">
      <Grid item xs={12}>
        <Typography variant="h3" className={classes.issueCard}>
          Results
        </Typography>
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
            {data.score > 95 ? "PASSED" : "FAILED"}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <Grid container direction="row" justify="center">
      {Result}
      <Grid item>
        <Button
          color="primary"
          variant="contained"
          data-test="submit"
          onClick={handleComplete}
          className={classes.formControl}
        >
          Complete Audit
        </Button>

        <Button
          color="primary"
          variant="contained"
          data-test="email"
          onClick={handleEmail}
          className={classes.formControl}
        >
          Send Email
        </Button>

        <Button
          color="primary"
          variant="contained"
          data-test="download"
          onClick={handleToCSV}
          className={classes.formControl}
        >
          Download CSV
        </Button>
      </Grid>
    </Grid>
  );
}
