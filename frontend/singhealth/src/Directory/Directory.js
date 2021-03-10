import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import SearchBar from './SearchBar';
import DirectoryCard from './DirectoryCard';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import * as tenantService from './tenantService';
import DirectoryForm from './DirectoryForm';
import Popup from './Popup';
import Frame from '../Frame';


const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  }
}));

// const storeinfo = [
//     {tenant_id: 1,
//     name: 'Coffee Bean', 
//     unit: '03-616', 
//     phone: '6123 4567', 
//     email: 'worsethanstarbucks@coffeebean.com',
//     institution: 'SGH',
//     fnb: true,
//     tenancyEndDate: '10/10/21'},

//     {tenant_id: 2,
//     name: 'Starbucks', 
//     unit: '03-404', 
//     phone: '6888 8888', 
//     email: 'betterthancoffeebean@starbucks.com',
//     institution: 'CGH',
//     fnb: true,
//     tenancyEndDate: '06/02/22'},
// ];

export default function Directory() {
  const classes = useStyles(useTheme);
  const [records, setRecords] = useState(tenantService.getAllTenants())
  const [openPopup, setOpenPopup] = useState(false)
  const [recordForEdit, setRecordForEdit] = useState(null)

  const openInPopup = () => {
    return
  }

  const addOrEdit = (tenant, resetForm) => {
    if (tenant.tenant_id == 0)
      tenantService.insertTenant(tenant)
    else
      tenantService.updateTenant(tenant)
    resetForm()
    setRecordForEdit(null)
    setOpenPopup(false)
    setRecords(tenantService.getAllTenants())
  }

  const DirectoryList = 
    records.map(item => {
      return {
        ...item,
        addOrEdit: addOrEdit
      }
    })
    .map(store => (
      <Grid item xs={12} sm={6} md={4}>
          <DirectoryCard {...store} />
      </Grid>
    ))
      
  return (
    <Frame title="Directory">
    <div>
      <Grid container xs={12} spacing={2} direction='column' alignItems='center'>
        <Grid item ></Grid>
        <Grid item ></Grid>
        <Grid item xs={10}><SearchBar /></Grid>
        <Grid item ></Grid>
        <Grid item ></Grid>
        <Grid container xs={12} spacing={5} justify='center' alignitems='center'>
            { DirectoryList }
        </Grid> 
      </Grid>

      <Fab color="primary" className={classes.fab} aria-label="add">
        <AddIcon onClick={() => { setOpenPopup(true); setRecordForEdit(null); }} />
      </Fab>

      <Popup
          title="Add Tenant"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <DirectoryForm
              recordForEdit={recordForEdit}
              addOrEdit={addOrEdit} />
      </Popup>

    </div>
    </Frame>
  );
}