import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { Redirect, useHistory } from "react-router-dom";
import authenticationService from "../service/authenticationService";
import AppRootContext from "../components/AppRootContext";


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
    const { showSnackbar } = React.useContext(AppRootContext);

    const classes = useStyles();
    let history = useHistory();
    

    const { register, handleSubmit } = useForm();
    const onSubmit = async (data, e) => {
        let responseData = await authenticationService.getToken(data);
        if(responseData){
            if(responseData.status == 0) {
                localStorage.setItem("token", responseData.data);
                reDirectToHomePage();
            } else {
                showSnackbar(responseData.message);
            }            
        } else {
            showSnackbar("System error!");
        }
    }
    
    const onError = (errors, e) => console.log(errors, e);

    const reDirectToHomePage = () => {
        history.go("/");
    }

    return <Container maxWidth="sm" className={classes.root}>
        <Paper elevation={8}>
            <Box className={classes.boxHeader}>
                <Typography variant="h5" gutterBottom>
                    Welcome back!
                </Typography>
            </Box>
            <Box className={classes.boxBody}>                
                <form>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12}>
                            <TextField id="outlined-basic" label="User name" variant="outlined" fullWidth={true} size="small" inputProps={{...register("username")}}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField id="outlined-basic" label="Passowrd" variant="outlined" fullWidth={true} size="small" type="password" inputProps={{...register("password")}}/>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Button variant="contained" color="primary" fullWidth={true} onClick={handleSubmit(onSubmit, onError)}>     Login   </Button>
                        </Grid>
                        <Grid item xs={2} sm={2}></Grid>
                        <Grid item xs={8} sm={8}>
                            <Link href="/forgot-password" variant="body2">    Forgot password?   </Link>
                            <Link href="/signup" variant="body2">    Signup new account   </Link>
                        </Grid>
                        <Grid item xs={2} sm={2}> </Grid>
                    </Grid>
                </form>
            </Box>
            <Box className={classes.boxFooter}></Box>
        </Paper>
    </Container>
}

export default LoginContainer;