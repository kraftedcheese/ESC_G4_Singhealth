import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import UploadPhoto from "./Directory/UploadPhoto";
import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";
import {  RadioGroup,  FormControlLabel,  Radio } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const AddDetails = (props) => {
  const register = props;
  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        <TextField name="desc" label="Add a Description" required={true} ref={register}/>
      </Grid>
      <Grid item>
        <UploadPhoto name="image" label="Upload photo" />
      </Grid>
    </Grid>
  )
}

const defaultValues = {
  ok: "",
  image: "",
  desc: "",
}

export default function ChecklistCard(props) {
  const classes = useStyles();
  const { name, desc, register, setValue } = props;
  // const control = useForm({ defaultValues });
  const [point, setPoint] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const handleClickOK = () => {
    if ((point == null || point == 0)) setPoint(1);
    setValue(`${name}.ok`, 'true')
  };

  const handleClickNotOK = () => {
    if ((point == null || point == 1)) setPoint(0);
    setValue(`${name}.ok`, 'false')
  };

  const setImageURL = (e) => {
    console.log(e.target.value);
    register(`${name}.image`, '');
    setValue(`${name}.image`, e.target.value);
  }

  useEffect(() => {
    if (point==0) setShowMore(true);
    else setShowMore(false);
  }, [point])

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="row">
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <Typography variant="body2" component="p" align="left">
              {desc}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            {/* <Controller
                as={
                  <RadioGroup >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Ok"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="Not Ok"
                    />
                  </RadioGroup>
                }
                name="RadioGroup"
              /> */}
            <Button 
              variant="contained" 
              ref={register} 
              name={`${name}.ok`} 
              value="" 
              onClick={handleClickOK} 
              disableElevation 
              size="small" 
              color={(point==null) ? "secondary" : point ? "primary" : "secondary"}>
              Ok
            </Button>
            <Button 
              variant="contained" 
              ref={register} 
              name={`${name}.ok`} 
              value="" 
              onClick={handleClickNotOK} 
              disableElevation 
              size="small" 
              color={(point==null) ? "secondary" : point ? "secondary" : "primary"}>
              Not Ok
            </Button>
          </Grid>
        </Grid>
        {showMore && (
          <Grid container spacing={1} direction="column">
          <Grid item>
            <TextField name={`${name}.desc`} label="Add a Description" required={true} inputRef={register}/>
          </Grid>
          <Grid item>
            <UploadPhoto name="image" label="Upload photo" onChange={setImageURL}/>
          </Grid>
        </Grid>
        )}
      </CardContent>
      {/* <CardActions>
        
      </CardActions> */}
    </Card>
  );
}
