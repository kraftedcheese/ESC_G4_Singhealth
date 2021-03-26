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
} from "react-router-dom";
import ChecklistResult from "./ChecklistResult";
import useToken from "./useToken";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
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
  tenancyEndDate: new Date(),
};

export default function NewAudit() {
  const classes = useStyles(useTheme);
  const { path, url } = useRouteMatch();
  const { setValues, data } = useData();
  const [currentTenant, setCurrentTenant] = useState(initialFValues);
  const [name, setName] = useState("");
  const [fnb, setFnb] = useState("Not yet an");
  const [loading, setLoading] = useState(true);
  const { token } = useToken();
  const [records, setRecords] = useState(null);

  const handleChange = (e) => {
    console.log("handled change");
    setCurrentTenant(getTenant(e.target.value));
  };

  const getTenant = (name) => {
    return records.find((tenant) => tenant.name === name);
  };

  useEffect(() => {
    console.log("useeffect is called");
    setName(currentTenant.name);
    setFnb(currentTenant.fnb);
  }, [currentTenant]);

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
    <div style={{ position: "absolute", top: "50%", left: "50%" }}>
      <CircularProgress color="secondary" />
    </div>
  ) : (
    <Frame title="New Audit">
      <Switch>
        <Route exact path={path}>
          {/* tenant selector:might wanna make this part of the checklist component */}
          <Grid container spacing={1} align="center" direction="column">
            <Grid
              item
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <FormControl className={classes.formControl}>
                <InputLabel>Store</InputLabel>
                <Select value={name} onChange={handleChange}>
                  {records.map((x) => (
                    <MenuItem key={x.tenant_id} value={x.name}>
                      {x.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Grid item xs={1}></Grid>
              <Grid justify="center">{(fnb===1) ? "F&B" : "Non F&B"} audit</Grid>
            </Grid>
            <Grid item container direction="column">
              <Checklist></Checklist>
            </Grid>
          </Grid>
        </Route>

        <Route path={`${path}/result`}>
          <ChecklistResult></ChecklistResult>
        </Route>
      </Switch>
    </Frame>
  );
  // </DataProvider>
}
