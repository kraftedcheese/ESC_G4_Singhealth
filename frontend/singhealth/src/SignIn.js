import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Loading from "./Common/Loading";
import tr from "date-fns/esm/locale/tr/index.js";
import useToken from "./Common/useToken";
import useUser from "./Common/useUser";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Singhealth Retail Audits
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100%",
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/featured/?covid-19)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  logo: {
    width: "60%",
    padding: "20px",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles(useTheme);
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { setToken, getRole } = useToken();
  const { setUser } = useUser();

  const validate = () => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email && password && re.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log({ email: email, password: password });
      setLoading(true);
      axios
        .post("http://singhealthdb.herokuapp.com/auth/login", {
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
          setToken(response.data);
          getUserAfterLogin(email, response.data.token);
        })
        .catch((error) => {
          setLoading(false);
          alert("Incorrect password, or user not found");
          console.error(error);
        });
    } else {
      alert("Invalid login fields!");
    }
  };

  const getUserAfterLogin = (email, token) => {
    if (getRole()){
      axios
      .get("http://singhealthdb.herokuapp.com/api/staff/email_param", {
        params: { secret_token: token, email: email },
      })
      .then((res) => {
        console.log("getting staff complete");
        console.log(res.data);
        setUser(res.data);
        setLoading(false);
        history.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        alert("Staff data not found");
        console.error(error);
      });
    }
    else {
      axios
      .get("http://singhealthdb.herokuapp.com/api/tenant/email_param", {
        params: { secret_token: token, email: email },
      })
      .then((res) => {
        console.log("getting tenant complete");
        console.log(res.data);
        setUser(res.data);
        setLoading(false);
        history.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        alert("Tenant data not found");
        console.error(error);
      });
    }
    
  };

  return loading ? (
    <Loading />
  ) : (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid
        item
        container
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
      >
        <div className={classes.paper}>
          <Typography component="h1" variant="h3">
            Singhealth Retail Audits
          </Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              data-test="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              data-test="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              data-test="submit"
              className={classes.submit}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}
