import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import { GridList, IconButton, InputBase } from '@material-ui/core';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import AddAPhotoRoundedIcon from '@material-ui/icons/AddAPhotoRounded';
import moment from 'moment';
import Button from '@material-ui/core/Button';

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
              <img className={classes.msgImage} src="https://source.unsplash.com/featured/?food"/>
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
    const newDateReq = moment(props.timestamp).format('Do MMMM YYYY');
    
    if(props.isStaff){
      return (
        <div>
          <div className={classes.messageContainer}>
            <div className={props.isMine ? classes.messageMine : classes.messageOther} >
              <Typography>{newDateReq}</Typography>
              <Button className={classes.yesnobutton}>Yes</Button>
              <Button className={classes.yesnobutton}>No</Button> {/*only visible to staff!*/}
            </div>
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
              <Typography>{ newDateReq}</Typography>
              <Button disabled style={{color: 'white'}}>Pending</Button> {/*change this based on approved/rejected/pending later on*/}
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
      return(<ImageMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp}/>)
    }
    else if (props.type == "timeextension"){
      return(<TimeExtensionMessage text={props.body} isMine={props.is_mine} timestamp={props.timestamp} isStaff={props.is_staff}/>)
    }
  }