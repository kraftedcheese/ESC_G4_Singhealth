import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded';
import PhoneRoundedIcon from '@material-ui/icons/PhoneRounded';
import MailRoundedIcon from '@material-ui/icons/MailRounded';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import CreateRoundedIcon from '@material-ui/icons/CreateRounded';
import Popup from "./Popup";
import DirectoryForm from "./DirectoryForm";
import * as tenantService from './tenantService';


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));


export default function DirectoryCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [openPopup, setOpenPopup] = React.useState(false)
  const [recordForEdit, setRecordForEdit] = React.useState(null) 

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="storefront" 
          className={classes.avatar}
          src='http://photos.prnewswire.com/prnfull/20130709/LA44075LOGO'>
          </Avatar>
        }
        action={
            <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        }
        title={props.name}
        subheader={props.unit}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
            <Grid container spacing={2} direction='column'>
                <Grid item>
                    <CardMedia
                    component="img"
                    alt="cover"
                    height="100"
                    image="https://burpple-3.imgix.net/venue_images/img_20190211_193340-min-jpg_5676_original"
                    title="cover"
                    />
                </Grid>
                <Grid item container direction='row'>
                        <Grid item xs = {1}><LocationOnRoundedIcon /></Grid>
                        <Grid item xs = {1}></Grid>
                        <Grid item xs = {10}>
                        <Typography variant="p">{props.institution}</Typography>
                        </Grid>
                </Grid>
                <Grid item container direction='row'>
                        <Grid item xs = {1}><PhoneRoundedIcon /></Grid>
                        <Grid item xs = {1}></Grid>
                        <Grid item xs = {10}>
                        <Typography variant="p">{props.phone}</Typography>
                        </Grid>
                </Grid>
                <Grid item container direction='row'>
                        <Grid item xs = {1}><MailRoundedIcon /></Grid>
                        <Grid item xs = {1}></Grid>
                        <Grid item xs = {10}>
                        <Typography variant="p">{props.email}</Typography>
                        </Grid>
                </Grid>
                <Grid item container direction='row'>
                        <Grid item xs = {1}><DescriptionRoundedIcon /></Grid>
                        <Grid item xs = {1}></Grid>
                        <Grid item xs = {10}>
                        <Typography variant="p">Contract expires: {props.tenancyEndDate}</Typography>
                        </Grid>
                </Grid>
                <Grid item container direction='row'>
                        <Grid item xs = {1}>
                          <IconButton  onClick={() => { setOpenPopup(true); setRecordForEdit(props); }}>
                            <CreateRoundedIcon />
                          </IconButton>
                        </Grid>
                        <Grid item xs = {11}></Grid>
                </Grid>
            </Grid>
        </CardContent>
      </Collapse>
      <Popup
        title="Edit Tenant"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
       >
        <DirectoryForm
            recordForEdit={recordForEdit}
            addOrEdit={props.addOrEdit} />
      </Popup>
    </Card>
  );
}