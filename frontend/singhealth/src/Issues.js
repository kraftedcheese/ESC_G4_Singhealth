import React, { useState, useEffect } from 'react';
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
import useToken from "./useToken";
import axios from "axios";
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
import Loading from "./Loading";
import moment from 'moment';


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
    //height: '93vh',
    backgroundColor: theme.palette.primary.main,
    overflowX: "hidden",
    overflowY: "hidden"
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
    margin: theme.spacing(4,4),
  },
  gridList:{
    padding: theme.spacing(4,8),
  },
  cardContainer:{
    width: '300px',
  }
}));

function IssueCard(props){
    const classes= useStyles();
    const history = useHistory();
    const dueDate = moment(props.date).format('Do MMMM YYYY');
    const issueID = props.issueid;
    const [notifs,setNotifs] = useState(0);
    const { token } = useToken();
    const audit_id = localStorage.getItem('audit_id');
    const [imageLink, setImageLink] = useState("");
    const lastAccessed = parseInt(localStorage.getItem('lastAccessFor'+issueID));
    const [lastAccessTime, setlat] = useState(lastAccessed);
    console.log(issueID,lastAccessed)
    
    useEffect(()=>{
      getNotifs();
    },[setNotifs,setlat]);

    function getNotifs(){
      var tempNotifs;

      
      axios.get("http://singhealthdb.herokuapp.com/api/message/time_issue_id_param", {
        params: { 
          secret_token: token ,
          time : 0,
          issue_id : issueID
        },
      })
      .then(
        resarr=>{
          //alert("hello");
          tempNotifs = Object.values(resarr.data).length;
          console.log(lastAccessTime);
          tempNotifs -= Object.values(resarr.data).filter((msg) => msg.time < lastAccessTime).length;
          setNotifs(tempNotifs);
          //get first image
          console.log(Object.values(resarr.data)[0].image);
          setImageLink(Object.values(resarr.data)[0].image);
          console.log(imageLink);
        }
               
      )
      .catch((error) => {
        console.log(error);
        setNotifs(0);
      });

      
    }

    function cardClick(issueName,dueDate){
      //alert(dueDate);
      localStorage.setItem('issueName',issueName);
      localStorage.setItem('issueID',issueID);
      localStorage.setItem('issue',JSON.stringify(props.data));
      localStorage.setItem('dueDate',props.date);
      history.push("/issueChat");
      //get card.store then display that in the next page header
    };
    

    return(
    <Grid item xs={10} sm={5} md={3} className={classes.issueCard}>
        <Badge badgeContent={notifs} color="primary">
            <Card className={classes.cardContainer}>
                <CardActionArea onClick={() => cardClick(props.issue,props.date)}>
                  {(imageLink.length > 0) &&
                    <CardMedia
                        className={classes.media}
                        image={imageLink}
                    />}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {"Due Date: " + dueDate}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {props.issue + issueID}
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
            },
            {
                issueName: "Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask",
                dueDate: "16/03/21",
                msgs: 6
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
    const theme = useTheme();
    //const issueCard = props.openIssues;
    //console.log(issueCard);
    if(props.openIssues.length >0){ console.log(props.openIssues);
    return(
        <Grid item xs={12} sm={12} md={12}>
            <Typography className={classes.issueCategory}>{props.issueCategory}</Typography>
            <hr color="#f06d1a" className={classes.hr}></hr>
            <GridList style={{padding: theme.spacing(2)}}>
              {props.openIssues.map(issueCard=>
              <IssueCard date={issueCard.due_date} issue={issueCard.name} issueid={issueCard.issue_id} data={issueCard}/>)}
            </GridList>
        </Grid>
    )}
    else{return null;}
}

export default function Issues() {
  const classes = useStyles(useTheme);
  const history = useHistory();
  const { token } = useToken();
  const [tenantissues, setIssues] = useState(null);
  const storeName = localStorage.getItem('storeToDisplay');
  const audit_id = localStorage.getItem('audit_id');
  const [loading, setLoading] = useState(true);
  const [tenantissuesmap,setmap] = useState([]);
  const allCategories = ["Food","Professionalism and Staff Hygiene","Housekeeping and General Cleanliness","Food Hygiene","Healthier Choice in line with HPB’s Healthy Eating’s Initiative","Workplace Safety and Health","Safe Management Measures for Front-of-house","Staff Hygiene & Safe Management Measures"]

  useEffect(() => {
    getAllIssues();
  },[setIssues]);

  //get all issues based on audit_id
  async function getAllIssues() {
    var issues;

    await axios
      
      axios.get("http://singhealthdb.herokuapp.com/api/issue/audit_id_param", {
        params: { secret_token: token, audit_id : audit_id },
      })
      .then(
        resarr=>{
          //alert("hello");
          issues = Object.values(resarr.data);
          console.log(issues);
          setIssues(issues);
          categoriseIssues(issues);
          setLoading(false);
        }
               
      )
      .catch((error) => {
        setIssues([]);
        setLoading(false);
        console.log(error);
      });
  }

  function categoriseIssues(tempIssues){
    var categorisedIssues = [];
    allCategories.forEach(cat => {
      var indaCat = {};
      var issuesForCat = tempIssues.filter((issue) => issue.category == cat);
      console.log(cat);
      console.log(issuesForCat);
      indaCat["category"] = cat;
      indaCat["data"] = issuesForCat;
      categorisedIssues.push(indaCat);
      console.log(indaCat);
    });
    console.log(categorisedIssues);
    setmap(categorisedIssues);
  }

  return loading ? (
    <Loading />
  ) : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={12} sm={12} md={12} square style={{overflow:"visible"}}>{/*this is for the buttons */}
        <Typography className = {classes.storename}>
            {storeName} ({audit_id})
        </Typography>
      </Grid>

      <Grid item xs={12} sm={12} md={12} component={Paper} className={classes.roundcard} elevation={3}>
        {console.log(tenantissues)}
        {tenantissuesmap.map(broadIssue => (
            <IssueGrid issueCategory={broadIssue.category} openIssues={broadIssue.data}/>
        ))}
      </Grid>
    </Grid>
  );
}