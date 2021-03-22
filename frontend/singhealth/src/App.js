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
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Issues from "./Issues";


const App = () => {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route path="/home">
              <TaskBar />
              <Home />
            </Route>
            <Route path="/dashboard">
              <TaskBar />
            </Route>
            <Route path="/directory">
              <Directory />
            </Route>
            <Route path="/newaudit">
              <NewAudit />
            </Route>
            <Route path="/frame">
              <Frame />
            </Route>
            <Route path="/issues">
              <TaskBar />
              <Issues />
            </Route>
            <Route exact path="/">
              <SignIn />
            </Route>
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;