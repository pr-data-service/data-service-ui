import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        top: "20%",
        left: "30%",
    },
    boxHeader: {
        padding: "20px 0px 15px 30px"
    },
    boxBody: {
        margin: "15px 80px"
    },
    boxFooter: {
        display: "none"
    },
  }));


const ForgotPasswordContainer = () => {
    const classes = useStyles();

    return <Container maxWidth="sm" className={classes.root}>
        <Paper elevation={8}>
            <Box className={classes.boxHeader}>
                <Typography variant="h5" gutterBottom>
                    Please contact to Admin.
                </Typography>
            </Box>
            <Box className={classes.boxBody}>
                
            </Box>
            <Box className={classes.boxFooter}></Box>
        </Paper>
    </Container>;
}

export default ForgotPasswordContainer;