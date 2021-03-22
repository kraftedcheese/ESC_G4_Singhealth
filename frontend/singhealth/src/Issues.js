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
import Container from '@material-ui/core/Container';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Badge from '@material-ui/core/Badge';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { GridList } from '@material-ui/core';

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
    backgroundColor: theme.palette.primary.main,
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
  storename:{
    margin: theme.spacing(4,4),
    fontSize: 70,
    color: theme.palette.primary.light,
  },
  hr:{
    margin: theme.spacing(0,8),
  },
  issueCategory:{
    margin: theme.spacing(4,10,2),
    textAlign: 'left',
  },
  media:{
    height:200,
  },
  issueCard:{
    margin: theme.spacing(4,0),
  },
  gridList:{
    padding: theme.spacing(4,8),
  },
}));

function IssueCard(props){
    const classes= useStyles();
    return(
    <Grid item xs={10} sm={5} md={3} className={classes.issueCard}>
        <Badge badgeContent={props.unreadMsgs} color="primary">
            <Card>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image="https://source.unsplash.com/featured/?food"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {"Due Date:" + props.date}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {props.issue}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Badge>
    </Grid>
  )
}

const tenantIssues = [
    {
        category: "Professionalism and Staff Hygiene",
        openIssues: [
            {
                issueName: "Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask",
                dueDate: "16/03/21",
                msgs: 9
            }
        ]
    },
    {
        category: "Safe Management Measures for Front-of-house",
        openIssues: [
            {
                issueName: "Mask not worn",
                dueDate: "17/03/21",
                msgs: 3
            }
        ]
    },
]

function IssueGrid(props){
    const classes = useStyles();
    return(
        <Grid item xs={12} sm={12} md={12}>
            <Typography className={classes.issueCategory}>{props.issueCategory}</Typography>
            <hr color="#f06d1a" className={classes.hr}></hr>
            <GridList>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
                <IssueCard date="16/03/21" unreadMsgs="10" issue="some issue"/>
            </GridList>
        </Grid>
    )
}

export default function Issues() {
  const classes = useStyles(useTheme);
  const history = useHistory();
  const storeName = localStorage.getItem('storeToDisplay');

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} square >{/*this is for the buttons */}
        <Typography className = {classes.storename}>
            {storeName}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        {tenantIssues.map(broadIssue => (
            <IssueGrid issueCategory={broadIssue.category}/>
        ))}
      </Grid>
    </Grid>
  );
}