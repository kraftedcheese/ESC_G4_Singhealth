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
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { Badge, CardActionArea, GridList } from '@material-ui/core';
import { useHistory } from 'react-router';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Singhealth Retail Audits
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const useStyles = makeStyles((theme) => ({
  root: {
    height: '93vh',
    backgroundColor:'e9e9e9',
  },
  paper: {
    margin: theme.spacing(7, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  button:{
    margin: theme.spacing(2,4),
  },
  roundcard:{
    borderRadius: '100px 100px 0px 0px',
  },
  typography:{
    margin: theme.spacing(4,10,2),
    textAlign: 'left',
  },
  hr:{
    margin: theme.spacing(0,8),
  },
  ascgrid:{
    margin: theme.spacing(2,0),
  },
  gridList:{
    padding: theme.spacing(4,8),
  },
  card:{
    textAlign:'left',
    borderRadius: 15,
    borderColor: theme.palette.primary.main,
  },

}));


function AuditScreenCard(props){
  const classes = useStyles();
  const history = useHistory();

  function cardClick(store){
    //alert(store);
    localStorage.setItem('storeToDisplay',store);
    history.push("/issues");
    //get card.store then display that in the next page header
  };

  return(
    <Grid item xs={12} sm={5} md={3} className={classes.ascgrid}>
      <Badge badgeContent={props.notifs} color="primary">
        <Card hoverable className={classes.card} variant="outlined" >
          <CardActionArea onClick={() => cardClick(props.store)}>
          <CardHeader
            avatar={
              <Avatar aria-label="coffeebean" className={classes.avatar}>
                C
              </Avatar>
            }
            title={props.store}
            subheader={"Due Date: " + props.date}
          />
          </CardActionArea>
        </Card>
      </Badge>
    </Grid>
  )
}

export default function SignIn() {
  const classes = useStyles(useTheme);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} square >{/*this is for the buttons */}
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
      >
        New Audit
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<VisibilityIcon/>}
      >
        Past Audits
      </Button>
        
      </Grid>
      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        <Typography className={classes.typography}>Open Audits</Typography>
        <hr color='#f06d1a' className={classes.hr}></hr>
        <Grid container className={classes.gridList}>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="Coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="40"></AuditScreenCard>
          <AuditScreenCard store="Starbucks" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="Watsons" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="3"></AuditScreenCard>
          <AuditScreenCard store="Koi" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="1"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="Coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee asfvan" date="16/03/21" notifs="9"></AuditScreenCard>
          <AuditScreenCard store="Starbucks" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="4"></AuditScreenCard>
          <AuditScreenCard store="Watsons" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="Koi" date="16/03/21" notifs="10"></AuditScreenCard>
          <AuditScreenCard store="coffee bean" date="16/03/21" notifs="10"></AuditScreenCard>
        </Grid>
      </Grid>
      
    </Grid>
  );
}