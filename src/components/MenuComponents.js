import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import AppContext from './AppContext';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    menuContainer: {
        height: 610,
        padding: 30
    },
}));

const MenuComponent = () => {
    const classes = useStyles();
    const { loggedInUser } = React.useContext(AppContext);
    const isAdmin = loggedInUser && loggedInUser.admin ? true : false;
    return <Paper elevation={8} className={classes.menuContainer}>
        {isAdmin && <Typography><Link href="/user-listview">User List</Link></Typography>}
        <Typography><Link href="/data-drafting-form">Drafting Form</Link></Typography>
        <Typography><Link href="/data-drafting-listview">Drafting List View</Link></Typography>
        <Typography><Link href="/data-drafting-result-listview">Drafting Result List View</Link></Typography>
    </Paper>
}

export default MenuComponent;