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
import { Prompt, useHistory } from "react-router-dom";
import { GridList, IconButton, InputBase,Fab } from '@material-ui/core';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import Message from "./Messages";
import * as messageService from './messageService';
import AlarmAddRoundedIcon from '@material-ui/icons/AlarmAddRounded';
import Popover from '@material-ui/core/Popover';
import DatePicker from "./Directory/DatePicker";
import moment from 'moment';
import useToken from "./useToken";
import axios from "axios";
import Loading from "./Loading";


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
    minHeight: "-webkit-fill-available",
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
    //margin: theme.spacing(10,2,0,),
    //overflow: 'auto',
    height: 'inherit',
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
  },},
  imageToSend:{
    maxWidth: "10vw",
  },
  imagePopup:{
    position: 'fixed',
    right: '8.5%',
    bottom: '10%',
    padding:theme.spacing(2),
  }
}));

const isStaff = JSON.parse(localStorage.getItem('token')).isAdmin;
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
  body:  new Date().getTime(),
  timestamp: new Date().getTime(),
  tag: "timeextension",
  info: "pending",
}];

function TimeExtReqPopup(props){
  const classes = useStyles(useTheme);
  const [date,setDate] = useState(null); //maybe set to current due date
  const {token} = useToken();
  const issueID = localStorage.getItem('issueID');
  const issue = JSON.parse(localStorage.getItem('issue'));

  const changeDate = (e) => {
    setDate(e.target.value);
    //alert(e.target.value)
  }

  function submitNewDate(){
    //alert(JSON.stringify(date));
    //alert(date);
    if(date == null){
      alert("No date specified"); //should remove this later, prob just cannot submit
    }else{
      //alert(date.getTime());
      // messageService.sendTimeExtReq(date.getTime());
      // props.setStateFunction(messageService.getAllMessages());
      axios.post("http://singhealthdb.herokuapp.com/api/message",
      {
        "issue_id": issueID,
        "staff_id": 4,
        "tenant_id": 4,
        "from_staff": isStaff,
        "tag": "timeextension",
        "info": "pending",
        "body": date.getTime().toString(),
        "image": ""
    },{params:{secret_token:token}})
    .then((response) => {
      console.log(response);
      props.getMsgsFunction();
      //localStorage.setItem('issueForMsg',JSON.stringify(issue));
      console.log(issue);
    }, (error) => {
      console.log(error);
    });
    }
    props.closePopup();
  }
  
  return(
    <Grid item className={classes.popupContents}>
      <Typography className={classes.timeReqPopup}>When would you like to extend the due date until?</Typography>
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
  const { token } = useToken();
  const [imageToSend, setImageToSend] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [messageTag, setTag]=useState("textonly");
  const issue = JSON.parse(localStorage.getItem('issue'));
  const issueID = localStorage.getItem('issueID');
  const checkResolve = props.checkResolve;
  console.log(issue);

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    props.getMsgsFunction();
  },[props.setStateFunction]);


  function mehandleSubmit(data){
    //alert(JSON.stringify(data));
    //messageService.sendMessage(data.messageToSend,isStaff);
    //alert(data.messageToSend.length);
    axios.post("http://singhealthdb.herokuapp.com/api/message?secret_token="+token,
      {
        "issue_id": issueID,
        "staff_id": 4,
        "tenant_id": 4,
        "from_staff": isStaff,
        "tag": messageTag,
        "info": "",
        "body": data.messageToSend,
        "image": imageToSend
    }).then((response) => {
      props.getMsgsFunction();
      console.log(response);
      setImageToSend("");
      setShowImage(false);
      setImageReady(false);
      setTag("textonly");
      reset();
    }, (error) => {
      console.log(error);
    });
    //messageService.clearMessages();
    //messageService.defaultMessages();
  }

  function addPhoto(e){
    console.log(e);
    console.log(e.target.files[0]);
    const fd = new FormData();
    fd.append('file', e.target.files[0], e.target.files[0].name);
    setShowImage(true);

    axios
      .post("http://singhealthdb.herokuapp.com/api/image", fd, {params: {secret_token: token}})
      .then((response) => {
        console.log(response.data.url);
        setImageToSend(response.data.url);
        setImageReady(true);
        setTag("textimage");
        console.log(imageToSend);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  function closeIssue(){
    axios.put("http://singhealthdb.herokuapp.com/api/issue/issue_id_param", {
      "audit_id": issue.audit_id,
      "name": issue.name,
      "category": issue.category,
      "description": issue.description,
      "due_date": issue.due_date,
      "resolved": true
    },{
      params: { 
        secret_token: token ,
        issue_id : issueID,
      }}
    ).then((response)=>{
      console.log(response.data);
      checkResolve();
    }).catch(error => {
      console.log(error);
    })
  }

  if(isStaff){
    return(
      <Container className={classes.chatbarbase}>
        {console.log(imageReady)}
        {showImage && <Paper className={classes.imagePopup}> {imageReady ?
          <img className = {classes.imageToSend} src={imageToSend}/> : <Typography>Getting Image...</Typography>}
          </Paper> }
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <input name="messageToSend" ref={register} className={classes.compose} autoComplete="off"></input>
          <IconButton>
            <CheckCircleRoundedIcon className={classes.icon} onClick={closeIssue}/>
          </IconButton>
          <IconButton>
            <label for="uploadmsgpic">
              <AddAPhotoRoundedIcon className={classes.icon} />
              <input
                  onChange={addPhoto}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  id = "uploadmsgpic"
                  hidden
                />
            </label>
          </IconButton>
        </form>
      </Container>
    )
  }
  else{
    return(
      <Container className={classes.chatbarbase}>
        {imageReady && <Paper className={classes.imagePopup}><img className = {classes.imageToSend} src={imageToSend}/></Paper> }
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
            <TimeExtReqPopup setStateFunction={props.setStateFunction} closePopup={handleClose} getMsgsFunction={props.getMsgsFunction}/>
          </Popover>
          <IconButton>
          <label for="uploadmsgpic">
              <AddAPhotoRoundedIcon className={classes.icon}/>
              <input
                  onChange={addPhoto}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  id = "uploadmsgpic"
                  hidden
                />
            </label>
          </IconButton>
          
        </form>
        
      </Container>
    )
  }
  
}

function Chatroom(props){
  const classes = useStyles(useTheme);
  const [messages, setMessages] = useState([]);
  const issueID = localStorage.getItem('issueID');
  //if the user isStaff, then 
  //i should render left or right based on whether it is mine. if i am staff then i can use the value fromstaff, if i am tenant then i flip it

  const [loading, setLoading] = useState(true);
  const { token } = useToken();
    
  useEffect(() => {
    console.log("effect");
    getAllMessages();
  },[setMessages]);

  //get all issues based on audit_id
  async function getAllMessages() {
    console.log("gettingmsgs");
    var tempMsgs;

    await axios
      
    axios.get("http://singhealthdb.herokuapp.com/api/message/time_issue_id_param", {
      params: { 
        secret_token: token ,
        time : 0,
        issue_id : issueID,
      },
      })
      .then(
        resarr=>{
          //alert("hello");
          tempMsgs = Object.values(resarr.data);
          setMessages(tempMsgs);
          console.log(tempMsgs);
          setLoading(false);
        }
               
      )
      .catch((error) => {
        console.log(error);
      });
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid item style={{height: "100%"}}>
      <Grid item className={classes.chatroomContainer}>
        {messages.map(message =>(
          //<BasicMessage text={message.body} fromStaff={message.from_staff}/>
          <Message type = {message.tag} body={message.body} imagelink={message.image} is_mine={isStaff ? message.from_staff : !message.from_staff} timestamp={message.time} is_staff={isStaff} info={message.info} msg={message} updateDueDate={props.updateDueDate}/>
        ))}
      </Grid>
      <ChatBar className={classes.chatbar} setStateFunction = {setMessages} getMsgsFunction={getAllMessages} checkResolve={props.checkResolve}/>
    </Grid>
    
  );
}

export default function IssueChat() {
  const classes = useStyles(useTheme);
  const history = useHistory();
  const issueName = localStorage.getItem('issueName');
  const issueID = localStorage.getItem('issueID');
  const initdueDate = localStorage.getItem('dueDate');
  const {token} = useToken();
  const [dueDate,setDueDate] = useState(initdueDate);
  const [resolved,setResolved] = useState(false);
  var duedate = moment(parseInt(dueDate)).format('Do MMMM YYYY');

  useEffect(()=>{
    checkResolve()
  },[setResolved])

  function checkResolve(){
    axios.get("http://singhealthdb.herokuapp.com/api/issue/issue_id_param",{params:{secret_token:token,issue_id:issueID}})
    .then((resarr)=>{
      console.log(resarr.data);
      console.log(resarr.data.resolved);
      if(resarr.data.resolved == 1){
        setResolved(true);
      }
    }).catch((error)=>{console.log(error)})
  }

  function updateDueDate(){
    axios.get("http://singhealthdb.herokuapp.com/api/issue/issue_id_param",{params:{secret_token:token,issue_id:issueID}})
    .then((resarr)=>{
      console.log(resarr.data);
      console.log(resarr.data.due_date);
      setDueDate(resarr.data.due_date);
      console.log(dueDate);
      duedate = moment(parseInt(dueDate)).format('Do MMMM YYYY');
    }).catch((error)=>{console.log(error)})
  }

  return (
    <Grid container component="main" className={classes.root} style={{minHeight: 'fit-content'}}>
      <Prompt message={(location,action) =>{
        localStorage.setItem("lastAccessFor"+issueID,Date.now());
        console.log(issueID, Date.now());
        //return "Leaving"
      }}/>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} square >{/*this is for the buttons */}
        <Typography className = {classes.storename}>
            {issueName}
        </Typography>
      </Grid>
      <div className={classes.dueDateContainer}>
        {resolved ? <Fab variant="extended" className = {classes.duedate}>
            Resolved
        </Fab> :
        <Fab variant="extended" className = {classes.duedate}>
            {"Due Date: " + duedate}
        </Fab>}
      </div>
      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        <Chatroom checkResolve={checkResolve} updateDueDate={updateDueDate}/>
      </Grid>
      {/* <ChatBar/> */}
    </Grid>
    
  );
}