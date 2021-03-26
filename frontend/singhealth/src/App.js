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


const App = () => {
  const { token, setToken } = useToken();
  const history = useHistory();

  function PrivateRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={({ location }) =>
          token ? (
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
              <DataProvider>
                <NewAudit />
              </DataProvider>
            </PrivateRoute>
            <PrivateRoute path="/frame">
              <Frame />
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
