import { ThemeProvider } from '@material-ui/core/styles';
import themeInstance from './styles/theme';
import AppBaseContainer from './containers/AppBaseContainer';

function App() {
  return <ThemeProvider theme={themeInstance}>
    <AppBaseContainer />
  </ThemeProvider>;
}
export default App;


