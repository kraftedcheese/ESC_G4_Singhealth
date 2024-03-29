import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AssignmentRoundedIcon from "@material-ui/icons/AssignmentRounded";
import TimelineRoundedIcon from "@material-ui/icons/TimelineRounded";
import StoreMallDirectoryRoundedIcon from "@material-ui/icons/StoreMallDirectoryRounded";
import PersonRoundedIcon from "@material-ui/icons/PersonRounded";
import { useHistory } from "react-router-dom";
import useToken from "./useToken";
import useUser from "./useUser";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionDesktop: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const { removeToken, getRole } = useToken();
  const { removeUser }= useUser();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);  
  };

  const handleLogout = () => {
    removeToken();
    removeUser();
    history.push("/signin");
  };

  const menuId = "primary-search-account-menu";

  const history = useHistory();

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem data-test="profile" onClick={() => history.push("./profile")}>
        Profile
      </MenuItem>
      {/* <MenuItem data-test="account" onClick={handleMenuClose}>
        My account
      </MenuItem> */}
      <MenuItem data-test="logout" onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography
            className={classes.title}
            color="primary"
            variant="h6"
            noWrap
          >
            Singhealth Audits - {getRole() ? "Staff" : "Tenant"}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="show 4 new mails"
              color="inherit"
              data-test="home"
              onClick={() => history.push("/home")}
            >
              <Badge badgeContent={0} color="primary">
                <AssignmentRoundedIcon />
              </Badge>
            </IconButton>
            {/* <IconButton aria-label="show 17 new notifications" color="inherit" onClick={() => history.push("/dashboard")}>
              <Badge badgeContent={5} color="primary">
                <TimelineRoundedIcon />
              </Badge>
            </IconButton> */}
            {getRole() &&
            <IconButton
              aria-label="something"
              color="inherit"
              data-test="directory"
              onClick={() => history.push("/directory")}
            >
              <Badge badgeContent={0} color="primary">
                <StoreMallDirectoryRoundedIcon />
              </Badge>
            </IconButton>}
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              data-test="menu"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <PersonRoundedIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}
