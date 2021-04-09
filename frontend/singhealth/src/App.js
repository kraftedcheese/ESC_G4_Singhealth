import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import TaskBar from "./TaskBar";
import Home from "./Home";
import Directory from "./Directory/Directory";
import Frame from "./Frame";
import NewAudit from "./NewAudit";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import { DataProvider } from "./DataContext";
import useToken from "./useToken";
import Issues from "./Issues";
import IssueChat from "./IssueChat";
import Profile from "./Profile";


const App = () => {
  const { getToken, setToken, getRole } = useToken();
  const history = useHistory();

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          getToken() ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/signin",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  function AdminRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          (getRole()) ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/home",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <PrivateRoute path="/home">
              <TaskBar />
              <Home />
            </PrivateRoute>
            <Route path="/dashboard">
              <TaskBar />
            </Route>
            <PrivateRoute path="/directory">
              <Directory />
            </PrivateRoute>
            <PrivateRoute path="/newaudit">
              {/* //DataProvider holds all data for the new audit component */}
              <DataProvider>
                <NewAudit />
              </DataProvider>
            </PrivateRoute>
            <PrivateRoute path="/frame">
              <Frame />
            </PrivateRoute>
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
            <Route exact path="/signin">
              <SignIn setToken={setToken}/>
            </Route>
            <Route path="/issues">
              <TaskBar />
              <Issues />
            </Route>
            <Route path="/issueChat">
              <TaskBar/>
              <IssueChat/>
            </Route>
            <Route exact path="/">
              <Redirect to={{
                pathname: "/signin",
              }}></Redirect>
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
