import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { Badge, CardActionArea, GridList } from "@material-ui/core";
import { useHistory } from "react-router";
import Loading from "./Loading";
import useToken from "./useToken";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "93vh",
    backgroundColor: "e9e9e9",
  },
  paper: {
    margin: theme.spacing(7, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.dark,
  },
  button: {
    margin: theme.spacing(2, 4),
    padding: theme.spacing(2,4),
    borderRadius: "50px",
  },
  roundcard: {
    borderRadius: "100px 100px 0px 0px",
    minHeight: "-webkit-fill-available",
  },
  typography: {
    margin: theme.spacing(4, 10, 2),
    textAlign: "left",
  },
  hr: {
    margin: theme.spacing(0, 8),
  },
  ascgrid: {
    margin: theme.spacing(2, 0),
  },
  gridList: {
    padding: theme.spacing(4, 8),
  },
  card: {
    textAlign: "left",
    borderRadius: 15,
    borderColor: theme.palette.primary.main,
    width: "200px",
  },
}));

function AuditScreenCard(props) {
  const classes = useStyles();
  const history = useHistory();

  function cardClick(store) {
    //alert(store);
    localStorage.setItem("storeToDisplay", store.tenant_name);
    localStorage.setItem("audit_id", store.audit_id);
    history.push("/issues");
    //get card.store then display that in the next page header
  }

  return (
    <Grid item xs={12} sm={5} md={3} className={classes.ascgrid}>
      <Badge badgeContent={props.notifs} color="primary">
        <Card className={classes.card} variant="outlined"  data-test="audit">
          <CardActionArea onClick={() => cardClick(props)}>
            <CardHeader
              avatar={
                <Avatar aria-label="coffeebean" className={classes.avatar}>
                  C
                </Avatar>
              }
              title={props.tenant_name}
              // subheader={"Due Date: " + props.date}
              subheader={"Score: " + props.score}
            />
            <CardContent>
              <p>{"Audit ID (to be passed to child): " + props.audit_id}</p>
              <p>{"Auditor: " + props.staff_id}</p>
              <p>{"Created: " + new Date(props.time)}</p>
            </CardContent>
          </CardActionArea>
        </Card>
      </Badge>
    </Grid>
  );
}

// const audits=[
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Watsons",
//     notifs: 10,
//     score: 97,
//   },
//   {
//     tenant_name: "Starbucks",
//     notifs: 1,
//     score: 96,
//   },
//   {
//     tenant_name: "NTUC",
//     notifs: 19,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },

//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
//   {
//     tenant_name: "Coffee Bean",
//     notifs: 10,
//     score: 96,
//   },
// ]

export default function Home() {
  const history = useHistory();
  const classes = useStyles(useTheme);
  const { token } = useToken();
  const [audits, setAudits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllAudits();
  }, [setAudits]);

  async function getAllAudits() {
    var audits;
    var tenants;

    await axios
      .all([
        axios.get("http://singhealthdb.herokuapp.com/api/audit", {
          params: { secret_token: token },
        }),
        axios.get("http://singhealthdb.herokuapp.com/api/tenant", {
          params: { secret_token: token },
        }),
      ])
      .then(
        axios.spread((res1, res2) => {
          audits = Object.values(res1.data);
          tenants = Object.values(res2.data);
          //loops through audits, finds tenant, then sets audit tenant name to tenant
          for (var i = 0; i < audits.length; i++){
            let tenant = tenants.find(x => x.tenant_id === audits[i].tenant_id);
            audits[i].tenant_name = tenant.name;
          }
          console.log("Home is printing audits");
          console.log(audits);
          setAudits(audits);
          setLoading(false);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12}>
        {/*this is for the buttons */}
        <Button
          variant="contained"
          color="primary"
          data-test="new_audit"
          className={classes.button}
          startIcon={<AddIcon />}
          onClick={() => history.push("/newaudit")}
        >
          New Audit
        </Button>
        <Button
          variant="contained"
          color="primary"
          data-test="past_audit"
          className={classes.button}
          startIcon={<VisibilityIcon />}
        >
          Past Audits
        </Button>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        component={Paper}
        className={classes.roundcard}
        elevation={3}
      >
        <Typography className={classes.typography}>Open Audits</Typography>
        <hr color="#f06d1a" className={classes.hr}></hr>
        <Grid container className={classes.gridList}>
          {audits.map((audit) => (
            <AuditScreenCard
              {...audit}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
