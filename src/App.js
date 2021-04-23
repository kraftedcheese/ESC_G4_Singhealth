import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import { ThemeProvider } from "@material-ui/core";
import theme from "./theme";
import TaskBar from "./Common/TaskBar";
import Home from "./Home";
import Directory from "./Directory/Directory";
import Frame from "./Common/Frame";
import NewAudit from "./NewAudit/NewAudit";
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import { DataProvider } from "./NewAudit/DataContext";
import useToken from "./Common/useToken";
import Issues from "./Chat/Issues";
import IssueChat from "./Chat/IssueChat";
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
            <AdminRoute path="/directory">
              <Directory />
            </AdminRoute>
            <AdminRoute path="/newaudit">
              {/* //DataProvider holds all data for the new audit component */}
              <DataProvider>
                <NewAudit />
              </DataProvider>
            </AdminRoute>
            <PrivateRoute path="/frame">
              <Frame />
            </PrivateRoute>
            <PrivateRoute path="/profile">
              <Profile />
            </PrivateRoute>
            <Route exact path="/signin">
              <SignIn setToken={setToken}/>
            </Route>
            <PrivateRoute path="/issues">
              <TaskBar />
              <Issues />
            </PrivateRoute>
            <PrivateRoute path="/issueChat">
              <TaskBar/>
              <IssueChat/>
            </PrivateRoute>
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
