import logo from './logo.svg';
import './App.css';
import SignIn from "./SignIn";
import { ThemeProvider } from '@material-ui/core';
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme = {theme}>
    <div className="App">
      <SignIn />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          TEST POST PLS IGNORE
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    </ThemeProvider>
  );
}

export default App;
