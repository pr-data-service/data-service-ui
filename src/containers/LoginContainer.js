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


const LoginContainer = () => {
    const classes = useStyles();

    return <Container maxWidth="sm" className={classes.root}>
        <Paper elevation={8}>
            <Box className={classes.boxHeader}>
                <Typography variant="h5" gutterBottom>
                    Welcome back!
                </Typography>
            </Box>
            <Box className={classes.boxBody}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <TextField id="outlined-basic" label="User name" variant="outlined" fullWidth={true} size="small"/>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField id="outlined-basic" label="Passowrd" variant="outlined" fullWidth={true} size="small" type="password" />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button variant="contained" color="primary" fullWidth={true}>     Login   </Button>
                    </Grid>
                    <Grid item xs={2} sm={2}></Grid>
                    <Grid item xs={8} sm={8}>
                        <Link href="#" variant="body2">    Forgot account?   </Link>
                        <Link href="#" variant="body2">    Signup new account   </Link>
                    </Grid>
                    <Grid item xs={2} sm={2}> </Grid>
                </Grid>
            </Box>
            <Box className={classes.boxFooter}></Box>
        </Paper>
    </Container>;
}

export default LoginContainer;