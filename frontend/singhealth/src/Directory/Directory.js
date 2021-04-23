import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { getContrastRatio, makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import SearchBar from "./SearchBar";
import DirectoryCard from "./DirectoryCard";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as tenantService from "./tenantService";
import DirectoryForm from "./DirectoryForm";
import Popup from "./Popup";
import Frame from "../Common/Frame";
import useToken from "../Common/useToken";
import axios from "axios";
import Loading from "../Common/Loading";

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
  const [original, setOriginal] = useState(null);
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllTenants();
  }, [setRecords]);

  useEffect(() => {
    if (!loading) {
      setRecords(
        original.filter((rec) => {
          return rec.name.toLowerCase().includes(search.toLowerCase());
        })
      );
    }
  }, [search]);

  async function getAllTenants() {
    var tenants;

    await axios
      .get("http://singhealthdb.herokuapp.com/api/tenant", {
        params: { secret_token: token },
      })
      .then((response) => {
        tenants = Object.values(response.data);
        for (var i = 0; i < tenants.length; i++) {
          if (tenants[i].fnb === 1) tenants[i].fnb = "true";
          else tenants[i].fnb = "false";
        }
        console.log("got some tenants");
        console.log(tenants);

        setRecords(tenants);
        setOriginal(tenants);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function deleteTenant(tenant) {
    setLoading(true);

    console.log("deleting tenant");
    console.log(tenant);
    console.log(tenant.email);

    await axios
      .get(
        `http://singhealthdb.herokuapp.com/api/audit/tenant_id/${tenant.tenant_id}`,
        {
          params: { secret_token: token },
        }
      )
      .then((response) => {
        var audits = Object.values(response.data);
        axios
          .all(
            audits.map((audit) => [
              axios.delete(
                `http://singhealthdb.herokuapp.com/api/audit/${audit.audit_id}`,
                { params: { secret_token: token } }
              ),
            ])
          )
          .then((response) => {
            console.log(response);
            deleteSingleTenant(tenant, token);
          })
          .catch((error) => {
              alert(error);
          });
      })
      .catch((error) => {
        if (error.response.data.message === "request with params not found") {
          deleteSingleTenant(tenant, token);
        } 
        else alert(error);
      });
  }

  async function deleteSingleTenant(tenant, token) {
    axios
      .all([
        axios.delete(
          "http://singhealthdb.herokuapp.com/api/tenant/tenant_id_param",
          {
            params: {
              secret_token: token,
              tenant_id: tenant.tenant_id,
            },
          }
        ),
        axios({
          method: "delete",
          url: "http://singhealthdb.herokuapp.com/auth/tenant_delete",
          headers: {},
          data: {
            email: tenant.email, // This is the body part
          },
        }),
      ])
      .then(
        axios.spread((res1, res2) => {
          console.log("response from data database");
          console.log(res1);
          console.log("response from auth database");
          console.log(res2);
          //if 400 for data, delete from auth.
          //if 400 for auth, delete from data.
          //keep retrying for both??
          getAllTenants();
        })
      )
      .catch((error) => {
        console.log(error);
        getAllTenants();
      });
  }

  async function updateTenant(data, resetForm) {
    setLoading(true);

    console.log("updating tenant");

    convertForDatabase(data);
    console.log(data);
    console.log(typeof data.contract_date);

    await axios
      .put(
        `http://singhealthdb.herokuapp.com/api/tenant/${data.tenant_id}?`,
        data,
        {
          params: { secret_token: token },
        }
      )
      .then((response) => {
        console.log("response from data database");
        console.log(response);
        getAllTenants();
        resetForm();
        setRecordForEdit(null);
      })
      .catch((error) => {
        console.log(error);
        getAllTenants();
        alert(error.message);
      });
  }

  async function insertTenant(data, resetForm) {
    setLoading(true);

    console.log("inserting tenant");

    convertForDatabase(data);
    console.log(data);
    console.log(typeof data.contract_date);

    await axios
      .all([
        axios.post("http://singhealthdb.herokuapp.com/api/tenant", data, {
          params: { secret_token: token },
        }),
        axios.post("http://singhealthdb.herokuapp.com/auth/tenant_signup", {
          email: data.email,
          password: data.password,
        }),
      ])
      .then(
        axios.spread((res1, res2) => {
          console.log("response from data database");
          console.log(res1);
          console.log("response from auth database");
          console.log(res2);
          //if 400 for data, delete from auth.
          //if 400 for auth, delete from data.
          getAllTenants();
          resetForm();
          setRecordForEdit(null);
        })
      )
      .catch((error) => {
        console.log(error);
        getAllTenants();
        alert(error.message);
      });
  }

  const convertForDatabase = (data) => {
    try {
      let contract_date = parseInt(data.contract_date.getTime()).toFixed(0);
      data.contract_date = contract_date;
    } catch (error) {
      console.log("Date not converted");
    }

    try {
      let fnb = data.fnb;
      if (fnb === "true") data.fnb = true;
      else if (fnb === "false") data.fnb = false;
    } catch (error) {
      console.log("F&B not converted");
    }
  };

  return loading ? (
    <Loading />
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
            <SearchBar onChange={(e) => setSearch(e.target.value)} />
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
            {records
              .map((item) => {
                return {
                  ...item,
                  addOrEdit: updateTenant,
                  delete: deleteTenant,
                };
              })
              .map((store) => (
                <React.Fragment key={store.id}>
                  <Grid item xs={12} sm={6} md={4}>
                    <DirectoryCard {...store} />
                  </Grid>
                </React.Fragment>
              ))}
          </Grid>
        </Grid>

        <Fab
          color="primary"
          className={classes.fab}
          data-test="add"
          aria-label="add"
        >
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
          <DirectoryForm
            recordForEdit={recordForEdit}
            addOrEdit={insertTenant}
            setOpenPopup={setOpenPopup}
            isAdd={true}
          />
        </Popup>
      </div>
    </Frame>
  );
}
