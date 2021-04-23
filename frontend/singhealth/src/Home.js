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
import Loading from "./Common/Loading";
import useToken from "./Common/useToken";
import axios from "axios";
import useUser from "./Common/useUser";

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
  buttonPast: {
    margin: theme.spacing(2, 4),
    padding: theme.spacing(2, 4),
    borderRadius: "50px",
  },
  buttonOpen:{
    margin: theme.spacing(2, 4),
    padding: theme.spacing(2, 4),
    borderRadius: "50px",
    backgroundColor: theme.palette.primary.dark,
  },
  roundcard: {
    borderRadius: "100px 100px 0px 0px",
    minHeight: "-webkit-fill-available",
  },
  typography: {
    margin: theme.spacing(4, 10, 2),
    textAlign: "left",
  },
  score_passed: {
    fontSize: "0.875rem",
    color: "green",
  },
  score_failed:{
    fontSize: "0.875rem",
    color: "red",
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
  emptyTop : {
    minHeight: "150px",
  }
}));

const displayDate = (date_string) => {
  let date = new Date(date_string);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

function AuditScreenCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const [color, setColor] = React.useState();

  function cardClick(store) {
    //alert(store);
    localStorage.setItem("storeToDisplay", store.tenant_name);
    localStorage.setItem("audit_id", store.audit_id);
    history.push("/issues");
    //get card.store then display that in the next page header
  }

  function displayType(type) {
    if (type === "nonfnb") return "Non-F&B";
    else if (type === "fnb") return "F&B";
    else if (type === "safe") return "Safe Management"
  }

  return (
    <Grid item xs={12} sm={5} md={3} className={classes.ascgrid}>
      <Badge badgeContent={props.notifs} color="primary">
        <Card className={classes.card} variant="outlined" data-test="audit">
          <CardActionArea onClick={() => cardClick(props)}>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="coffeebean"
                  className={classes.avatar}
                  src={props.image_logo}
                ></Avatar>
              }
              title={props.tenant_name + " (" + props.institution + ")"}
              // subheader={"Due Date: " + props.date}
              subheader={<Typography className={props.score>=95 ? classes.score_passed : classes.score_failed}>{"Score: "  + props.score }</Typography>}
            />
            <CardContent>
              <p>{"ID: " + props.audit_id}</p>
              <p>{"Type: " + displayType(props.type)}</p>
              <p>{"Auditor: " + props.staff_id}</p>
              <p>{"Created: " + displayDate(new Date(props.time))}</p>
            </CardContent>
          </CardActionArea>
        </Card>
      </Badge>
    </Grid>
  );
}

export default function Home() {
  const history = useHistory();
  const classes = useStyles(useTheme);
  const { token, getRole } = useToken();
  const { user } = useUser();
  const [audits, setAudits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pastAudits, setPastAudits] = useState(false);
  const [showThis,setShow] = useState(0);

  useEffect(() => {
    getRole() ? getAllAudits() : getTenantAuditByID();
  }, [setAudits]);

  const handlePastAudits = () => {
    setPastAudits(!pastAudits);
    console.log(audits[0].all_resolved);
    if(pastAudits){
      setShow(0);
    }else{
      setShow(1);
    }
    
  }


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
          for (var i = 0; i < audits.length; i++) {
            let tenant = tenants.find(
              (x) => x.tenant_id === audits[i].tenant_id
            );
            audits[i].tenant_name = tenant.name;
            audits[i].image_logo = tenant.image_logo;
            audits[i].institution = tenant.institution;
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

  async function getTenantAuditByID() {
    var audits;

    await axios
      .get("http://singhealthdb.herokuapp.com/api/audit/tenant_id_param", {
        params: { secret_token: token, tenant_id: parseInt(user.tenant_id) },
      })
      .then((res) => {
        console.log(res);
        audits = Object.values(res.data);

        for (var i = 0; i < audits.length; i++) {
          audits[i].tenant_name = user.name;
          audits[i].image_logo = user.image_logo;
        }
        setAudits(audits);
        console.log(audits);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      {getRole() ?
      (<Grid item xs={12} sm={12} md={12}>
        {/*this is for the buttons */}
        <Button
          variant="contained"
          color="primary"
          data-test="new_audit"
          className={classes.buttonPast}
          startIcon={<AddIcon />}
          onClick={() => history.push("/newaudit")}
        >
          New Audit
        </Button>
        <Button
          variant="contained"
          color="primary"
          data-test="past_audit"
          className={!pastAudits ? classes.buttonPast : classes.buttonOpen}
          startIcon={<VisibilityIcon />}
          onClick={() => handlePastAudits()}
        >
          Past Audits
        </Button> 
        
      </Grid>) : (<Grid item xs={12} sm={12} md={12} >
        <Button
          variant="contained"
          color="primary"
          data-test="past_audit"
          className={!pastAudits ? classes.buttonPast : classes.buttonOpen}
          startIcon={<VisibilityIcon />}
          onClick={() => handlePastAudits()}
        >
          Past Audits
        </Button> 
        </Grid>)
      }
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        component={Paper}
        className={classes.roundcard}
        elevation={3}
      >
        <Typography className={classes.typography}>{pastAudits ? "Past Audits" : "Open Audits"}</Typography>
        <hr color="#f06d1a" className={classes.hr}></hr>
        { audits ? (
        <Grid container className={classes.gridList}>
          {audits.filter((audit) => audit.all_resolved == showThis).map((audit) => (
            <AuditScreenCard {...audit} />
          ))}
        </Grid>) : (<Typography variant="h1" className={classes.gridList}>No Open Audits</Typography>)}
      </Grid>
    </Grid>
  );
}
