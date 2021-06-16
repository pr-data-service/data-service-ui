import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import AppContext from './AppContext';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    menuContainer: {
        height: "calc(100% - 30px)",
        padding: 15
    },
}));

const MenuComponent = () => {
    const classes = useStyles();
    const { loggedInUser } = React.useContext(AppContext);
    const isAdmin = loggedInUser && loggedInUser.admin ? true : false;
    const isSuperAdmin = loggedInUser && loggedInUser.superAdmin ? true : false;
    
    return <Paper elevation={8} className={classes.menuContainer}>
        <Typography><Link href="/data-drafting-form">Form</Link></Typography>
        <Typography><Link href="/listview">List View</Link></Typography>
        {isSuperAdmin && <Typography><Link href="/result-listview">Result View</Link></Typography>}
        {(isSuperAdmin || isAdmin) && <Typography><Link href="/user-listview">User List View</Link></Typography>}
    </Paper>
}

export default MenuComponent;