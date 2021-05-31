import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import themeInstance from './styles/theme';

import LoginContainer from './containers/LoginContainer';

function App() {
  return <ThemeProvider theme={themeInstance}>
    <LoginContainer />
  </ThemeProvider>;
}
export default App;





const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.background,
    border: 0,
    fontSize: 16,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
}));

function DeepChild() {
  const classes = useStyles();

  return (
    <button type="button" className={classes.root}>
      Theming
    </button>
  );
}
