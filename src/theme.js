import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ffffff',
      main: '#F06D1A',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f06d1a',
      main: '#ffffff',
      dark: '#002884',
      contrastText: '#000',
    },
  },
});

export default theme