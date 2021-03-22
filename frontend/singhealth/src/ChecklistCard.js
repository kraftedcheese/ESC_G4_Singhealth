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

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const AddDetails = () => {
  return (
    <Grid container direction="column">
      <TextField label="Add a Description"/>
      <UploadPhoto label="Upload photo"/>
    </Grid>
  )
}

export default function ChecklistCard(props) {
  const classes = useStyles();
  const { desc } = props;
  const [point, setPoint] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const handleClickOK = () => {
    if ((point == null || point == 0)) setPoint(1);
  };

  const handleClickNotOK = () => {
    if ((point == null || point == 1)) setPoint(0);
  };

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
            <Button variant="contained" onClick={handleClickOK} disableElevation size="small" color={(point==null) ? "secondary" : point ? "primary" : "secondary"}>
              Ok
            </Button>
            <Button variant="contained" onClick={handleClickNotOK} disableElevation size="small" color={(point==null) ? "secondary" : point ? "secondary" : "primary"}>
              Not Ok
            </Button>
          </Grid>
        </Grid>
        {showMore && <AddDetails />}
      </CardContent>
      {/* <CardActions>
        
      </CardActions> */}
    </Card>
  );
}
