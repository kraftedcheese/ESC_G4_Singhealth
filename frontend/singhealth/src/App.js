import logo from './logo.svg';
import './App.css';
import SignIn from "./SignIn";
import { ThemeProvider } from '@material-ui/core';
import theme from "./theme";
import TaskBar from "./TaskBar";
import Home from "./Home";
import Directory from "./Directory/Directory"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  return (
    <Router>
    <ThemeProvider theme = {theme}>
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
          <TaskBar />
          <Directory />
        </Route>
        <Route path="/">
          <SignIn />
        </Route>
      </Switch>
    </div>
    
    </ThemeProvider>
    </Router>
  );
}

export default App;

// import React from "react";


// export default function App() {
//   return (
//     <Router>
//       <div>
//         <nav>
//           <ul>
//             <li>
          // <Link to="/">Home</Link>
//             </li>
//             <li>
          // <Link to="/about">About</Link>
//             </li>
//             <li>
          // <Link to="/users">Users</Link>
//             </li>
//           </ul>
//         </nav>

//         {/* A <Switch> looks through its children <Route>s and
//             renders the first one that matches the current URL. */}
//         <Switch>
//           <Route path="/about">
//             <About />
//           </Route>
//           <Route path="/users">
//             <Users />
//           </Route>
//           <Route path="/">
//             <Home />
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   );
// }

// function Home() {
//   return <h2>Home</h2>;
// }

// function About() {
//   return <h2>About</h2>;
// }

// function Users() {
//   return <h2>Users</h2>;
// }
