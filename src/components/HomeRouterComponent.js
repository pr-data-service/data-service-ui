
import {
    Route,
    useHistory
} from "react-router-dom";
import React from 'react';
import DataDraftingFormComponent from "./DataDraftingFormComponent";
import RawDataDraftingListviewContainer from "../containers/RawDataDraftingListviewContainer";
import SignupUserContainer from "../containers/SignupUserContainer";
import UsersListViewContainer from "../containers/UsersListViewContainer";
import AppContext from "./AppContext";
import DataDraftingResultListViewContainer from "../containers/DataDraftingResultListViewContainer";
import LogInTimeComponent from "./LogInTimeComponent";
import { Box } from "@material-ui/core";
import ChangePasswordComponent from "./ChangePasswordComponent";

const HomeRouterComponent = () => {
    const history = useHistory();
    const { loggedInUser } = React.useContext(AppContext);
    const isAdmin = loggedInUser && loggedInUser.admin ? true : false;
    const isSuperAdmin = loggedInUser && loggedInUser.superAdmin ? true : false;

    React.useEffect(() => {
        if(history.location.pathname == "/") {
            history.push("/listview")
        }        
    }, [])


    return <Box style={{height: "inherit"}}>
            <Route exact path="/data-drafting-form"  component={DataDraftingFormComponent}/>
            <Route exact path="/data-drafting-form/:id"  component={DataDraftingFormComponent}/>
            <Route exact path="/listview"  component={RawDataDraftingListviewContainer}/>
            <Route exact path="/profile/edit/:id" component={SignupUserContainer}/>
            <Route exact path="/change-password" component={ChangePasswordComponent}/>  
            {isSuperAdmin && <React.Fragment>                
                <Route exact path="/user/edit/:id" component={SignupUserContainer}/>
                <Route exact path="/login-time" component={LogInTimeComponent}/>  
                <Route exact path="/result-listview"  component={DataDraftingResultListViewContainer}/>              
            </React.Fragment>}
            {(isSuperAdmin || isAdmin) && <Route exact path="/user-listview" component={UsersListViewContainer}/>}
            
    </Box>
}

export default HomeRouterComponent;