import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import {useEffect, useState} from 'react';
import useToken from "./useToken";
import axios from "axios";

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
    timestampLeft:{
      display: 'flex',
      justifyContent: 'center',
      color: '#999',
      fontWeight: '600',
      fontSize: '12px',
      margin: '10px 0px',
      textTransform: 'uppercase',
    },
    timestampRight:{
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
      //color: 'white',
    },
  }));

  function BasicMessage(props){
    const classes = useStyles(useTheme);
    // const {
    //   data,
    //   isMine,
    //   startsSequence,
    //   endsSequence,
    //   showTimestamp
    // } = props;
  
    const friendlyTimestamp = moment(props.timestamp).format('LLLL');
    return (
      <div>
        <div className={classes.messageContainer}>
          <div className={props.isMine ? classes.messageMine : classes.messageOther} >
            <Typography>{ props.text }</Typography>
          </div>
          <div className={props.isMine ? classes.timestampRight : classes.timestampLeft}>
            { friendlyTimestamp }
          </div>
        </div>
      </div>
    );
  }
  
  function ImageMessage(props){
    const classes = useStyles(useTheme);
    const friendlyTimestamp = moment(props.timestamp).format('LLLL');
    return (
      <div>
        <div className={classes.messageContainer}>
          <div className={props.isMine ? classes.messageMine : classes.messageOther} >
            <div>
              <img className={classes.msgImage} src={props.imagelink}/>
            </div>
            <Typography>{ props.text }</Typography>
          </div>
          <div className={props.isMine ? classes.timestampRight : classes.timestampLeft}>
            { friendlyTimestamp }
          </div>
        </div>
      </div>
    );
  };
  
  function TimeExtensionMessage(props){
    const classes = useStyles(useTheme);
    const friendlyTimestamp = moment(props.timestamp).format('LLLL');
    const newDateReq = moment(parseInt(props.text)).format('Do MMMM YYYY');
    const [status,setStatus] = useState(props.status);
    const {token} = useToken();
    const msg = props.msg;
    const tempissue = localStorage.getItem('issue');
    const issue = JSON.parse(tempissue);
    const [pending, setPending] = useState(props.status == "pending");
    console.log("something", issue);

    
    function approveReq(){
      //have to set in msgservice
      //alert(status)
      axios.put("http://singhealthdb.herokuapp.com/api/message/message_id_param", {
        "issue_id": msg.issue_id,
        "staff_id": msg.staff_id,
        "tenant_id": msg.tenant_id,
        "from_staff": false,
        "tag": "timeextension",
        "info": "approved",
        "body": props.text,
        "image": ""
    },{
      params: { 
        secret_token: token ,
        message_id : msg.message_id,
      }}
    ).then((response)=>{
      console.log(response.data);
      setStatus(response.data.info);
      setPending(false);
    }).catch(error => {
      console.log(error);
    })
    axios.put("http://singhealthdb.herokuapp.com/api/issue/issue_id_param", {
      "audit_id": issue.audit_id,
      "name": issue.name,
      "category": issue.category,
      "description": issue.description,
      "due_date": parseInt(props.text),
      "resolved": false
    },{
      params: { 
        secret_token: token ,
        issue_id : msg.issue_id
      }}
    ).then((response)=>{
      console.log(response.data);
      props.updateDueDate();
    }).catch(error => {
      console.log(error);
    })
    }

    function rejectReq(){
      //alert(status)
      axios.put("http://singhealthdb.herokuapp.com/api/message/message_id_param", {
        "issue_id": msg.issue_id,
        "staff_id": msg.staff_id,
        "tenant_id": msg.tenant_id,
        "from_staff": false,
        "tag": "timeextension",
        "info": "rejected",
        "body": props.text,
        "image": ""
    },{
      params: { 
        secret_token: token ,
        message_id : msg.message_id,
      }}
    ).then((response)=>{
      console.log(response.data);
      setStatus(response.data.info);
      setPending(false);
    }).catch(error => {
      console.log(error);
    })
    }
    
    if(props.isStaff){
      return (
        <div>
          <div className={classes.messageContainer}>
            {pending ?
            <div className={props.isMine ? classes.messageMine : classes.messageOther} >
              <Typography>{"Request for time extension til " + newDateReq}</Typography>

              <Button className={classes.yesnobutton} onClick={approveReq}>Yes</Button>
              <Button className={classes.yesnobutton} onClick={rejectReq}>No</Button> {/*only visible to staff!*/}
            </div> : <div className={props.isMine ? classes.messageMine : classes.messageOther} >
              <Typography>{"Request for time extension til " + newDateReq}</Typography>
              <Button disabled style={{color: 'black'}}>{status}</Button> {/*change this based on approved/rejected/pending later on*/}
            </div>}
            <div className={props.isMine ? classes.timestampRight : classes.timestampLeft}>
              { friendlyTimestamp }
            </div>
          </div>
        </div>
      );
    }
    else{
      return (
        <div>
          <div className={classes.messageContainer}>
            <div className={props.isMine ? classes.messageMine : classes.messageOther} >
              <Typography>{"Request for time extension til " + newDateReq}</Typography>
              <Button disabled style={{color: 'white'}}>{status}</Button> {/*change this based on approved/rejected/pending later on*/}
            </div>
            <div className={props.isMine ? classes.timestampRight : classes.timestampLeft}>
              { friendlyTimestamp }
            </div>
          </div>
        </div>
      );
    }
  }
  
export default function Message(props){
    if (props.type == "textonly"){
      return(<BasicMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp}/>)
    }
    else if (props.type == "textimage"){
      return(<ImageMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp} imagelink={props.imagelink} />)
    }
    else if (props.type == "timeextension"){
      return(<TimeExtensionMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp} isStaff={props.is_staff} status={props.info} msg={props.msg} updateDueDate={props.updateDueDate}/>)
    }
    else{
      return(<BasicMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp}/>)
    }
  }