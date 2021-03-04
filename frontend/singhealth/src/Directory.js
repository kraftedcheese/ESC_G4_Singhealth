import React from 'react';
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

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '5px 4px',
    height: '100vh',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(5),
    right: theme.spacing(5),
  },
}));

export default function Directory() {
  const classes = useStyles(useTheme);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Grid container spacing={2} direction='column' alignItems='center'>
        <Grid item ></Grid>
        <Grid item ></Grid>
        <Grid item xs={12} wrap='wrap'>
            <Typography variant="h3">
                Directory
            </Typography>
        </Grid>
        <Grid item xs={12}><SearchBar /></Grid>
        <Grid item ></Grid>
        <Grid item ></Grid>
        <Grid container xs={12} spacing={5} justify='center'>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <DirectoryCard />
            </Grid>
        </Grid> 
    

      </Grid>

      <Fab color="primary" className={classes.fab} aria-label="add">
        <AddIcon />
      </Fab>
      
    </div>
  );
}