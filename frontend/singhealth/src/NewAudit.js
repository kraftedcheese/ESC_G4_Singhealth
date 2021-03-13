import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from 'react-hook-form';
import Frame from "./Frame";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import * as tenantService from "./Directory/tenantService";
import Checklist from './Checklist';

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

const tenants = tenantService.getAllTenants();
const getTenant = (name) => {return tenants.find(tenant => tenant.name === name)}

export default function NewAudit() {
  const classes = useStyles(useTheme);
  const [currentTenant, setCurrentTenant] = useState(initialFValues);
  const [name, setName] = useState('');
  const [fnb, setFnb] = useState('Not yet an');

  const handleChange = (e) => {
    console.log("handled change");
    setCurrentTenant(getTenant(e.target.value));
  };

  useEffect(() => {
    console.log("useeffect is called")
    setName(currentTenant.name);
    setFnb(currentTenant.fnb);
  }, [currentTenant])

  return (
    <Frame title="New Audit">
      <Grid container spacing={1} align="center" direction="column">
        <Grid item container direction="row" justify="center" alignItems="center">
        <FormControl className={classes.formControl}>
        <InputLabel>Store</InputLabel>
        <Select
          value={name}
          onChange={handleChange}
        >
          {tenants.map((x) => <MenuItem key={x.tenant_id} value={x.name}>{x.name}</MenuItem>)}
        </Select>
        </FormControl>
        <Grid item xs={1}></Grid>
        <Grid justify="center">{fnb} audit</Grid>
        </Grid>
        <Grid item container direction="column">
          <Checklist></Checklist>
          <Button variant="contained" color="primary">Next</Button>
        </Grid>
      </Grid>
    </Frame>
  );
}
