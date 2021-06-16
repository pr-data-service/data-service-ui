
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, Dialog, TextField } from '@material-ui/core';
import AppRootContext from './AppRootContext';
import utils from '../utils/utils';
import AppContext from './AppContext';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
       
    },
}));




const DialogComponent = ({open=false, handleClose=()=>{}, title, children=null}) => {
    const classes = useStyles();
    const { showSnackbar } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    

    return <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        {(title && title != "") && <DialogTitle id="simple-dialog-title">{title}</DialogTitle>}
        {children}
    </Dialog>
}

export default DialogComponent;
