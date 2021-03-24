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
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory, useLocation } from "react-router-dom";
import { DataProvider } from "./DataContext";
import useToken from "./useToken";

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
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
