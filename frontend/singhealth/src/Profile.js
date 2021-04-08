import React, { useState, useEffect } from "react";
import useUser from "./useUser";
import Frame from "./Frame";
import useToken from "./useToken";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from '@material-ui/core/styles';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import MailRoundedIcon from '@material-ui/icons/MailRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

export default function Profile() {
  const { user } = useUser();
  const { getRole } = useToken();
  const classes = useStyles();

  const displayDate = (date_string) => {
    let date = new Date(date_string);
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear();
    return(`${dd}/${mm}/${yyyy}`);
  }

  const tenantCard = (props) => {
      return(
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label="storefront" 
            className={classes.avatar}
            src={props.image_logo}>
            </Avatar>
          }
          title={props.name}
          subheader={props.unit}
        />
          <CardContent>
              <Grid container spacing={2} direction='column'>
                  <Grid item>
                      <CardMedia
                      component="img"
                      alt="Add a cover image?"
                      height="100"
                      image={props.image_location}
                      title="cover"
                      />
                  </Grid>
                  <Grid item container direction='row'>
                          <Grid item xs = {1}><LocationOnRoundedIcon /></Grid>
                          <Grid item xs = {1}></Grid>
                          <Grid item xs = {10}>
                          <Typography variant="body2">{props.institution}</Typography>
                          </Grid>
                  </Grid>
                  <Grid item container direction='row'>
                          <Grid item xs = {1}><PhoneRoundedIcon /></Grid>
                          <Grid item xs = {1}></Grid>
                          <Grid item xs = {10}>
                          <Typography variant="body2">{props.phone}</Typography>
                          </Grid>
                  </Grid>
                  <Grid item container direction='row'>
                          <Grid item xs = {1}><MailRoundedIcon /></Grid>
                          <Grid item xs = {1}></Grid>
                          <Grid item xs = {10}>
                          <Typography variant="body2">{props.email}</Typography>
                          </Grid>
                  </Grid>
                  <Grid item container direction='row'>
                          <Grid item xs = {1}><DescriptionRoundedIcon /></Grid>
                          <Grid item xs = {1}></Grid>
                          <Grid item xs = {10}>
                          <Typography variant="body2">Contract expires: {displayDate(props.contract_date)}</Typography>
                          </Grid>
                  </Grid>
              </Grid>
          </CardContent>
          </Card>)
  }

  console.log(user.name);

  return (
    <Frame>
      <p>{user.name}</p>
    </Frame>
  );
}
