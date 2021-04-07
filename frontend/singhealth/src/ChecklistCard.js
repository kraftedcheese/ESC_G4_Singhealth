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
import DatePicker from "./Directory/DatePicker";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  media: {
    height: 300,
  },
  moreGrid: {
    margin: '10px'
  },
  text: {
    marginBottom: '50px'
  }
});

export default function ChecklistCard(props) {
  const classes = useStyles();
  const { name, desc, register, setValue, getValues, doRender } = props;
  const [point, setPoint] = useState();
  const [date, setDate] = useState(new Date());
  const [showMore, setShowMore] = useState(false);
  const [image, setImage] = useState();

  // useEffect(() => {
  //   console.log("pingubg")
  //   setPoint(getValues(`${name}`.ok));
  // }, [doRender])

  const handleClickOK = () => {
    setPoint(true);
    setValue(`${name}.ok`, true);
  };

  const handleClickNotOK = () => {
    setPoint(false);
    setValue(`${name}.ok`, false);
  };

  const setImageURL = (e) => {
    console.log(e.target.value);
    setImage(e.target.value);
    register(`${name}.image`, "");
    setValue(`${name}.image`, e.target.value);
  };

  const setDueDate = (e) => {
    console.log(e.target.value);
    register(`${name}.due_date`, "");
    setValue(`${name}.due_date`, e.target.value);
    setDate(e.target.value);
  };

  const AddDetails = (props) => {
    const register = props;
    return (
      <Grid container xs={10} spacing={1} direction="column">
        <Grid item>
          <TextField
            name="desc"
            label="Add a Description"
            required={true}
            ref={register}
          />
        </Grid>
        <Grid item>
          <UploadPhoto name="image" label="Upload photo" />
        </Grid>
        {showMore && <CardMedia />}
      </Grid>
    );
  };

  useEffect(() => {
    if (point == 0) setShowMore(true);
    else setShowMore(false);
  }, [point]);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="row" className={classes.text}>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <Typography variant="body2" component="p" align="left">
              {desc}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              ref={register}
              name={`${name}.ok`}
              value=""
              onClick={handleClickOK}
              disableElevation
              size="small"
              color={
                point == null ? "secondary" : point ? "primary" : "secondary"
              }
            >
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
              color={
                point == null ? "secondary" : point ? "secondary" : "primary"
              }
            >
              Not Ok
            </Button>
          </Grid>
        </Grid>
        {showMore && (
          <Grid item container spacing={1} justify="center" direction="row" className={classes.moreGrid}>
            <Grid item xs={12} md={3} className={classes.moreGrid}>
              <DatePicker
                name="due_date"
                label="Select due date"
                value={date}
                onChange={setDueDate}
              />
            </Grid>
            <Grid item xs={12} md={3} className={classes.moreGrid}>
              <TextField
                name={`${name}.desc`}
                label="Add a description"
                required={true}
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} md={3} className={classes.moreGrid}>
              <UploadPhoto
                name="image"
                label="Upload photo"
                onChange={setImageURL}
              />
            </Grid>
            <Grid item xs={12} md={11} className={classes.moreGrid}>
            {image && <CardMedia className={classes.media} image={image}/>}
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
