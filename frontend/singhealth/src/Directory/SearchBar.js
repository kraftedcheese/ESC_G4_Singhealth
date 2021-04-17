import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function CustomizedInputBase(props) {
  const {onChange} = props;
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      {/* <IconButton className={classes.iconButton} aria-label="filter">
        <FilterListRoundedIcon />
      </IconButton> */}
      <InputBase
        className={classes.input}
        placeholder="Search Directory"
        onChange={onChange}
        inputProps={{ 'aria-label': 'search directory' }}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}