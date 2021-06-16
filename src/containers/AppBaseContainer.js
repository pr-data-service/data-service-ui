import React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import AppRootContext from "../components/AppRootContext";
import AppBaseRouterContainer from "./AppBaseRouterContainer";
import ConfirmDialogComponent from "../components/ConfirmDialogComponent";
import userService from "../service/userService";
import DialogComponent from "../components/DialogComponent";
import CustomMenuComponent from '../components/CustomMenuComponent';



const AppBaseContainer = () => {
    const [state, setState] = React.useState({ open: false, msg: "" });
    const [confDilogState, setConfDilogState] = React.useState({open: false, title:"", description:"", callBackFunc: ()=>{}});
    const [dilogState, setDilogState] = React.useState({open: false, title:"", callBackFunc: ()=>{}});
    const [customMenuState, setCustomMenuState] = React.useState({anchorEl: null, menuItems:[], callBack: ()=>{}});

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

    const openDialog = ( children, title) => {
        setDilogState({ ...dilogState, open: true, title, children});
    };

    const handleCloseDialog = () => {
        setDilogState({...dilogState, open: false})
    }

    const openCustomMenu = ( menuItems, anchorEl, callBack) => {
        setCustomMenuState({ ...customMenuState, anchorEl, menuItems, callBack});
    };

    const handleCloseCustomMenu = () => {
        setCustomMenuState({...customMenuState, anchorEl: null})
    }
    

    return <AppRootContext.Provider value={{ showSnackbar, openConfirmDialog, openDialog, openCustomMenu }}>
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
            <DialogComponent handleClose={handleCloseDialog} {...dilogState}/>
            {(customMenuState.anchorEl && customMenuState.menuItems && customMenuState.menuItems.length > 0) && <CustomMenuComponent handleClose={handleCloseCustomMenu} {...customMenuState}/>}
        </React.Fragment>
    </AppRootContext.Provider>
}

export default AppBaseContainer;