import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import {useEffect, useState} from 'react';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { useForm } from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { GridList, IconButton, InputBase,Fab } from '@material-ui/core';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import Message from "./Messages";
import * as messageService from './messageService';
import AlarmAddRoundedIcon from '@material-ui/icons/AlarmAddRounded';
import Popover from '@material-ui/core/Popover';
import DatePicker from "./Directory/DatePicker";


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
    // padding: theme.spacing(10,4),
  },
  storename:{
    margin: theme.spacing(4,4),
    fontSize: 40,
    color: theme.palette.primary.light,
  },
  messageContainer:{
    //maxWidth: theme.spacing(150),
    //padding: theme.spacing(2,4),
    textAlign: 'right',
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
    width: 'fit-content'
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
    marginLeft: 'auto',
    width: 'fit-content',
  },
  chatbarbase:{
    background: theme.palette.primary.main,
    maxWidth: '100vw',
    position: 'sticky',
    bottom: 0,
  },
  compose:{
    background: "#ffffff",
    borderRadius: theme.spacing(100),
    padding: "10px 15px",
    margin: "10px 15px",
    width: '75%',
    border: '1px solid white',
    outline: 'none'
  },
  icon:{
    color: "#ffffff",
    fontSize: '40px',
  },
  timestamp:{
    display: 'flex',
    justifyContent: 'center',
    color: '#999',
    fontWeight: '600',
    fontSize: '12px',
    margin: '10px 0px',
    textTransform: 'uppercase',
  },
  msgImage:{
    maxHeight: '350px',
    maxWidth: '100%',
  },
  yesnobutton:{
    color: 'white',
  },
  duedate:{
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    margin: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  dueDateContainer:{
    position: 'sticky',
    top: '5%',
    width: '100%',
    height: 0,
  },
  chatroomContainer:{
    padding: theme.spacing(10,4,2),
  },
  timeReqPopup:{
    padding: theme.spacing(4,4),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContents:{
    textAlign: 'center',
  },
  datepicker:{
    padding: theme.spacing(2)
  },
  submitbutton:{
    padding: theme.spacing(2,4),
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50px',
    color: 'white',
    margin: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }
}));

const isStaff = false;
const chat_data = [{
  from_staff: true,
  body: "heyyy this is from the staff",
  timestamp: new Date().getTime(),
  tag: "textonly"
},
{
  from_staff: false,
  body: "from da tenant",
  timestamp: new Date().getTime(),
  tag: "textonly"
},
{
  from_staff: true,
  body: "this is gonna be a long piece of text to test qwrap LYRICS Can't count the years one hand  That we've been together  I need the other one to hold you. Make you feel, make you feel better.  It's not a walk in the park  To love each other.  But when our fingers interlock,  Can't eny, can't deny you're worth it  Cause after all this time.  I'm still into you I should be over all the butterflies But i'm into you (I'm in to you) And baby even on our worst nights I'm into you (I'm into you) Let em wonder how we got this far Cause I don't really need to wonder at all Yeah after all this time I'm still into you",
  timestamp: new Date().getTime(),
  tag: "textimage"
},
{
  from_staff:true,
  body:"Miusov, as a man man of breeding and deilcacy, could not but feel some inwrd qualms, when he reached the Father Superior's with Ivan: he felt ashamed of havin lost his temper. He felt that he ought to have disdaimed that despicable wretch, Fyodor Pavlovitch, too much to have been upset by him in Father Zossima's cell, and so to have forgotten himself. 'Teh monks were not to blame, in any case,' he reflceted, on the steps. 'And if they're decent people here (and the Father Superior, I understand, is a nobleman) why not be friendly and courteous withthem? I won't argue, I'll fall in with everything, I'll win them by politness, and show them that I've nothing to do with that Aesop, thta buffoon, that Pierrot, and have merely been takken in over this affair, just as they have.'",
  timestamp: new Date().getTime(),
  tag: "textonly"
},
{
  from_staff: false,
  body: "i want a pic",
  timestamp: new Date().getTime(),
  tag: "timeextension"
}];

function TimeExtReqPopup(props){
  const classes = useStyles(useTheme);
  const [date,setDate] = useState(null); //maybe set to current due date

  const changeDate = (e) => {
    setDate(e.target.value);
    //alert(e.target.value)
  }

  function submitNewDate(){
    //alert(JSON.stringify(date));
    alert(date);
    if(date == null){
      alert("No date specified"); //should remove this later, prob just cannot submit
    }else{
      alert(parseInt(date.getTime()).toFixed(0));
      messageService.sendTimeExtReq(date.getTime());
      props.setStateFunction(messageService.getAllMessages());
    }
  }
  
  return(
    <Grid item className={classes.popupContents}>
      <Typography className={classes.timeReqPopup}>When would you like to extend the due date until?</Typography>
      {/*insert datepicker here*/}
      <Grid item className={classes.datepicker}>
        <DatePicker name="newDueDate" label="New Due Date" value={date} onChange={changeDate}/>
      </Grid>
      <Button className={classes.submitbutton} onClick={submitNewDate} >Submit</Button>
    </Grid>
  )
}

function ChatBar(props){
  const classes = useStyles(useTheme);
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => mehandleSubmit(data); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  function mehandleSubmit(data){
    //alert(JSON.stringify(data));
    messageService.sendMessage(data.messageToSend,isStaff);
    //messageService.clearMessages();
    //messageService.defaultMessages();
    //alert(JSON.stringify(messageService.getAllMessages()));
    props.setStateFunction(messageService.getAllMessages());
    reset();
  }

  if(isStaff){
    return(
      <Container className={classes.chatbarbase}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="messageToSend" ref={register} className={classes.compose} autoComplete="off"></input>
          <IconButton>
            <CheckCircleRoundedIcon className={classes.icon}/>
          </IconButton>
          <IconButton>
            <AddAPhotoRoundedIcon className={classes.icon}/>
          </IconButton>
        </form>
      </Container>
    )
  }
  else{
    return(
      <Container className={classes.chatbarbase}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="messageToSend" ref={register} className={classes.compose} autoComplete="off"></input>
          <IconButton>
            <AlarmAddRoundedIcon className={classes.icon} onClick={(event) => setAnchorEl(event.currentTarget)}/>
          </IconButton>
          <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorReference="none" className={classes.timeReqPopup}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <TimeExtReqPopup setStateFunction={props.setStateFunction}/>
          </Popover>
          <IconButton>
            <AddAPhotoRoundedIcon className={classes.icon}/>
          </IconButton>
        </form>
      </Container>
    )
  }
  
}

function Chatroom(props){
  const classes = useStyles(useTheme);
  const [messages, setMessages] = useState(chat_data)
  //if the user isStaff, then 
  //i should render left or right based on whether it is mine. if i am staff then i can use the value fromstaff, if i am tenant then i flip it
  return(
    <Grid item>
      <Grid item className={classes.chatroomContainer}>
        {messages.map(message =>(
          //<BasicMessage text={message.body} fromStaff={message.from_staff}/>
          <Message type = {message.tag} body={message.body} is_mine={isStaff ? message.from_staff : !message.from_staff} timestamp={message.timestamp} is_staff={isStaff}/>
        ))}
      </Grid>
      <ChatBar className={classes.chatbar} setStateFunction = {setMessages}/>
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
      </Grid>
      <div className={classes.dueDateContainer}>
        <Fab variant="extended" className = {classes.duedate}>
            {"Due Date: " + dueDate}
        </Fab>
      </div>
      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        <Chatroom/>
      </Grid>
      {/* <ChatBar/> */}
    </Grid>
    
  );
}