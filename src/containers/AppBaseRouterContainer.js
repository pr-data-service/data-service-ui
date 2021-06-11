
import { makeStyles } from '@material-ui/core/styles';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import LoginContainer from './LoginContainer';
import SignupUserContainer from './SignupUserContainer';
import ForgotPasswordContainer from './ForgotPasswordContainer';
import HomeContainer from './HomeContainer';
import React from 'react';
import { Redirect, } from "react-router-dom";
import AppContext from '../components/AppContext';
import userService from '../service/userService';

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

const AppBaseRouterContainer = () => {
    const classes = useStyles();
    const isLoggedIn = localStorage.getItem("token") ? true : false;
    const [loggedInUser, setLoggedInUser] = React.useState();
    
    React.useEffect(() => {
        getLoggedInUser();
    }, []);

    const getLoggedInUser = async () => {
        let token = localStorage.getItem("token");
        if(token) {
            let responseData = await userService.getLoggedInUser();
            if(responseData && responseData.status == 0){
                setLoggedInUser(responseData.data);    
            }
            
        }        
    }




    return <Router>
        <Switch>
            <Route path="/login">
                {!isLoggedIn ? <LoginContainer /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/signup">
                <SignupUserContainer />
            </Route>
            <Route exact path="/forgot-password">
                <ForgotPasswordContainer />
            </Route>
            <Route path="/">
                {isLoggedIn ? <AppContext.Provider value={{ loggedInUser }}>
                    {loggedInUser && <HomeContainer />}
                </AppContext.Provider> : <Redirect to="/login" />}
            </Route>
        </Switch>
    </Router>
}

export default AppBaseRouterContainer;