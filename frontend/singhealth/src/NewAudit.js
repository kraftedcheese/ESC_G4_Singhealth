import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import Frame from "./Frame";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import * as tenantService from "./Directory/tenantService";
import Checklist from "./Checklist";
import { DataProvider } from "./DataContext";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import ChecklistResult from "./ChecklistResult";
import useToken from "./useToken";
import axios from "axios";
import Loading from "./Loading";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import SwitchUI from "@material-ui/core/Switch";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  media: {
    height: 200,
  },
}));

const initialFValues = {
  tenant_id: 0,
  name: "",
  phone: "",
  email: "",
  institution: "",
  fnb: "false",
  unit: "",
  image_location: "",
  tenancyEndDate: new Date(),
};

export default function NewAudit() {
  const classes = useStyles(useTheme);
  const { path, url } = useRouteMatch();
  const { setValues, data } = useData();
  const [currentTenant, setCurrentTenant] = useState(initialFValues);
  const [name, setName] = useState("");
  const [fnb, setFnb] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [records, setRecords] = useState(null);
  const [safeMgmt, setSafeMgmt] = useState(false);
  const [type, setType] = useState("");
  const history = useHistory();

  const handleChange = (e) => {
    setCurrentTenant(getTenant(e.target.value));
  };

  const handleSwitchChange = (e) => {
    if (safeMgmt){
      setSafeMgmt(false);
      setType(currentTenant.fnb);
    }
    else{
      setSafeMgmt(true);
      setType(2);
    }
  };

  const renderType = () => {
    switch (type) {
      case 0:
        return "Non-F&B Audit";
      case 1:
        return "F&B Audit";
      case 2:
        return "Safe Management Audit";
    }
  }

  useEffect(() => {
    setSafeMgmt(false);
    setType(currentTenant.fnb);
  }, [currentTenant])

  const handleNext = (e) => {
    e.preventDefault();
    var output = {};
    output.tenant = currentTenant;
    output.type = type;
    setValues(output);
    history.push("/newaudit/checklist");
  }

  const getTenant = (name) => {
    return records.find((tenant) => tenant.name === name);
  };

  async function getAllTenants() {
    var tenants;

    await axios
      .get("http://singhealthdb.herokuapp.com/api/tenant", {
        params: { secret_token: token },
      })
      .then((response) => {
        tenants = Object.values(response.data);
        setRecords(tenants);
        setLoading(false);
        console.log("got some tenants");
        console.log(tenants);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getAllTenants();
  }, [setRecords]);

  return loading ? (
    <Loading />
  ) : (
    <Frame title="New Audit">
      <Switch>
        <Route exact path={path}>
          <Grid
            item
            container
            xs={10}
            sm={8}
            md={6}
            direction="column"
            justify="center"
          >
            <CardMedia
              className={classes.media}
              image={currentTenant.image_location}
            />
            <Grid item xs={1}></Grid>
            <FormControl className={classes.formControl}>
              <InputLabel>Store</InputLabel>
              <Select value={currentTenant.name} onChange={handleChange}>
                {records.map((x) => (
                  <MenuItem key={x.tenant_id} value={x.name}>
                    {x.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid item xs={1}></Grid>
            <Grid
              item
              container
              direction="row"
              align="center"
              justify="center"
            >
              <Typography variant="h6">
                {renderType()}
              </Typography>
              <Grid item xs={1}></Grid>
              <SwitchUI
                checked={safeMgmt}
                onChange={handleSwitchChange}
                color="primary"
              />
            </Grid>
            <Grid item xs={1}></Grid>
            <Button
              variant="contained"
              onClick={handleNext}
              color="primary"
            >
              Start Audit
            </Button>
          </Grid>
          <Grid item container xs={12} direction="column"></Grid>
        </Route>

        <Route path={`${path}/checklist/`}>
          <Checklist></Checklist>
        </Route>

        <Route path={`${path}/result`}>
          <ChecklistResult></ChecklistResult>
        </Route>
      </Switch>
    </Frame>
  );
}
