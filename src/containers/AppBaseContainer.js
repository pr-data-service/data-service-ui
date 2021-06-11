import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import AppRootContext from "../components/AppRootContext";
import AppBaseRouterContainer from "./AppBaseRouterContainer";
import ConfirmDialogComponent from "../components/ConfirmDialogComponent";
import userService from "../service/userService";



const AppBaseContainer = () => {
    const [state, setState] = React.useState({ open: false, msg: "" });
    const [confDilogState, setConfDilogState] = React.useState({open: false, title:"", description:"", callBackFunc: ()=>{}})
    
    const showSnackbar = (msg) => {
        setState({ ...state, open: true, msg });
    };

    const hideSnackbar = () => {
        setState({ ...state, open: false, msg: "" });
    };

    const openConfirmDialog = ( title, description, callBackFunc) => {
        setConfDilogState({ ...confDilogState, open: true, title, description, callBackFunc});
    };

    const handleCloseConfirmDialog = () => {
        setConfDilogState({...confDilogState, open: false})
    }
    

    return <AppRootContext.Provider value={{ showSnackbar, openConfirmDialog }}>
        <React.Fragment>
            <AppBaseRouterContainer />
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={state.open}
                onClose={hideSnackbar}
                message={state.msg}
                key={"topcenter"}
            />
            <ConfirmDialogComponent handleClose={handleCloseConfirmDialog} {...confDilogState}/>
        </React.Fragment>
    </AppRootContext.Provider>
}

export default AppBaseContainer;