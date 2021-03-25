import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import SearchBar from "./SearchBar";
import DirectoryCard from "./DirectoryCard";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as tenantService from "./tenantService";
import DirectoryForm from "./DirectoryForm";
import Popup from "./Popup";
import Frame from "../Frame";
import useToken from "../useToken";
import axios from "axios";
import useDidUpdateEffect from "./useDidUpdateEffect";

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

export default function Directory() {
  const { token } = useToken();
  const classes = useStyles(useTheme);
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const openInPopup = () => {
    return;
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
        console.log(tenants);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    // This is be executed when `loading` state changes
    getAllTenants();
  }, [setRecords]);

  // var DirectoryList;
  // useDidUpdateEffect(() => {
  //   console.log("updating directory list");
  //   DirectoryList = records
  //   .map((item) => {
  //     return {
  //       ...item,
  //       addOrEdit: addOrEdit,
  //     };
  //   })
  //   .map((store) => (
  //     <React.Fragment key={store.id}>
  //       <Grid item xs={12} sm={6} md={4}>
  //         <DirectoryCard {...store} />
  //       </Grid>
  //     </React.Fragment>
  //   ));
  // }, [loading]);

  // const DirectoryList =
  //   records
  //     .map((item) => {
  //       return {
  //         ...item,
  //         addOrEdit: addOrEdit,
  //       };
  //     })
  //     .map((store) => (
  //       <React.Fragment key={store.id}>
  //         <Grid item xs={12} sm={6} md={4}>
  //           <DirectoryCard {...store} />
  //         </Grid>
  //       </React.Fragment>
  //     ));

  const addOrEdit = (tenant, resetForm) => {
    if (tenant.tenant_id == 0) tenantService.insertTenant(tenant);
    else tenantService.updateTenant(tenant);
    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
    setRecords(getAllTenants());
    console.log(getAllTenants()); //shows the current tenants and their details, for debug purposes
  };

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Frame title="Directory">
      <div>
        <Grid
          container
          item
          xs={12}
          spacing={2}
          direction="column"
          alignItems="center"
        >
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item xs={10}>
            <SearchBar />
          </Grid>
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid
            container
            item
            xs={12}
            spacing={5}
            justify="center"
            alignitems="center"
          >
            {
              records
              .map((item) => {
                return {
                  ...item,
                  addOrEdit: addOrEdit,
                };
              })
              .map((store) => (
                <React.Fragment key={store.id}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DirectoryCard {...store} />
                  </Grid>
                </React.Fragment>
              ))
            }
          </Grid>
        </Grid>

        <Fab color="primary" className={classes.fab} aria-label="add">
          <AddIcon
            onClick={() => {
              setOpenPopup(true);
              setRecordForEdit(null);
            }}
          />
        </Fab>

        <Popup
          title="Add Tenant"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <DirectoryForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>
      </div>
    </Frame>
  );
}
