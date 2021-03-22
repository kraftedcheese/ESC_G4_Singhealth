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
import { GridList, IconButton, InputBase } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

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
    padding: theme.spacing(10,4),
  },
  storename:{
    margin: theme.spacing(4,4),
    fontSize: 40,
    color: theme.palette.primary.light,
  },
  message:{
    //maxWidth: theme.spacing(150),
    padding: theme.spacing(2,4),
    justifyContent: 'flex-end',
  },
  messageOther:{
    textAlign: 'left',
    padding: '10px 20px',
    background: '#f4f4f8',
    borderRadius: '20px',
    maxWidth: '75%',
    borderTopLeftRadius: '2px',
    borderBottomLeftRadius: '20px',
    borderTopRightRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  
  messageMine: {
    textAlign: 'right',
    background: '#007aff',
    color: 'white',
    padding: '10px 20px',
    maxWidth: '75%',
    borderTopLeftRadius: '20px',
    borderBottomLeftRadius: '20px',
    borderTopRightRadius: '2px',
    borderBottomRightRadius: '20px',
    marginLeft: '25%',
  },
  chatbarbase:{
    background: theme.palette.primary.main,
  },
  compose:{
    background: "#ffffff",
    borderRadius: theme.spacing(100),
    padding: "10px 15px",
    margin: "10px 15px",
    borderColor: "#ffffff",
    width: '75%',
  },
  icon:{
    color: "#ffffff",
    fontSize: '50px',
  }
}));

const chat_data = [{
  from_staff: true,
  body: "heyyy this is from the staff"
},
{
  from_staff: false,
  body: "from da tenant"
},
{
  from_staff: true,
  body: "this is gonna be a long piece of text to test qwrap LYRICS Can't count the years one hand  That we've been together  I need the other one to hold you. Make you feel, make you feel better.  It's not a walk in the park  To love each other.  But when our fingers interlock,  Can't eny, can't deny you're worth it  Cause after all this time.  I'm still into you I should be over all the butterflies But i'm into you (I'm in to you) And baby even on our worst nights I'm into you (I'm into you) Let em wonder how we got this far Cause I don't really need to wonder at all Yeah after all this time I'm still into you"
},
{
  from_staff:true,
  body:"Miusov, as a man man of breeding and deilcacy, could not but feel some inwrd qualms, when he reached the Father Superior's with Ivan: he felt ashamed of havin lost his temper. He felt that he ought to have disdaimed that despicable wretch, Fyodor Pavlovitch, too much to have been upset by him in Father Zossima's cell, and so to have forgotten himself. 'Teh monks were not to blame, in any case,' he reflceted, on the steps. 'And if they're decent people here (and the Father Superior, I understand, is a nobleman) why not be friendly and courteous withthem? I won't argue, I'll fall in with everything, I'll win them by politness, and show them that I've nothing to do with that Aesop, thta buffoon, that Pierrot, and have merely been takken in over this affair, just as they have.'"
}];

function Message(props){
  const classes = useStyles(useTheme);
  const {
    data,
    isMine,
    startsSequence,
    endsSequence,
    showTimestamp
  } = props;

  //const friendlyTimestamp = moment(data.timestamp).format('LLLL');
  return (
    <div>
      <div className={classes.message}>
        <div className={props.fromStaff ? classes.messageOther : classes.messageMine} >
          <Typography>{ props.text }</Typography>
        </div>
        {/* {show time here} */}
      </div>
    </div>
  );
}

function ChatBar(props){
  const classes = useStyles(useTheme);
  return(
    <Container className={classes.chatbarbase}>
      <InputBase className={classes.compose}></InputBase>
      <IconButton>
        <CheckCircleIcon className={classes.icon}/>
      </IconButton>
    </Container>
  )
}

function Chatroom(props){
  return(
    <Grid item>
      {chat_data.map(message =>(
        <Message text={message.body} fromStaff={message.from_staff}/>
      ))}
    </Grid>
  );
}
export default function IssueChat() {
  const classes = useStyles(useTheme);
  const history = useHistory();
  const issueName = localStorage.getItem('issueName');
  const dueDate = localStorage.getItem('dueDate');

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} square >{/*this is for the buttons */}
        <Typography className = {classes.storename}>
            {issueName}
        </Typography>
        <Typography className = {classes.storename}>
            {"Due Date: " + dueDate}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        <Chatroom/>
      </Grid>
      <ChatBar/>
    </Grid>
  );
}