import React from 'react';
import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import TaskBar from './TaskBar';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:'e9e9e9',
  },
  title: {
    position: 'absolute',
    top: '100px'
  },
  roundcard:{
    borderRadius: '50px 50px 0px 0px',
    position: 'absolute',
    top: '200px',
    minHeight: 'calc(100vh)',
    flexBasis: 'auto',
    alignSelf: 'flex-end',
  },
}));


export default function Frame(props) {
  const classes = useStyles(useTheme);

  return (
    <div>
    <CssBaseline />    
    <TaskBar />
    <Grid container component="main" className={classes.root}>
      <Grid container alignItems='top' justify='center' item>
        <Typography component="h1" variant="h3" className={classes.title}>
            {props.title}
          </Typography>
      </Grid>
      <Grid container 
        justify='center' 
        component={Paper} 
        className={classes.roundcard} 
        elevation={3}>
            {props.children}
      </Grid>
    </Grid>
    </div>
  );
}