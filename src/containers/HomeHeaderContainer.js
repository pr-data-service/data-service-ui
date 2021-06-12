import React from 'react';
import { makeStyles, fade } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { IconButton } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useHistory } from "react-router-dom";

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AppRootContext from '../components/AppRootContext';
import AppContext from '../components/AppContext';

const useStyles = makeStyles((theme) => ({
    root: {        
        color: "#fff",
        backgroundColor: "#1976d2"
    },
    grow:{
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    user: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        fontSize: 12
    },
}));


const HomeHeaderContainer = () => {
    const classes = useStyles();
    let history = useHistory();

    const { loggedInUser } = React.useContext(AppContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleProfileMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
    
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const menuId = 'primary-search-account-menu';
    
    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            history.go("/login");
        } catch (error) {
            console.error(error);
        }
    }

    const handleEditProfile = () => {
        try {
            let token = localStorage.getItem("token");
            if(token && loggedInUser) {
                history.push("/profile/edit/"+loggedInUser.id);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const handleLoginTime = () => {
        try {
            handleMenuClose();
            history.push("/login-time");
        } catch (error) {
            console.error(error);
        }
    }

    const isAdmin = loggedInUser && loggedInUser.admin ? true : false;
    const isSuperAdmin = loggedInUser && loggedInUser.superAdmin ? true : false;
    const logedInUserName = loggedInUser ? loggedInUser.firstName + " " + loggedInUser.lastName : "";    

    return <AppBar position="static" className={classes.root}>
        <Toolbar>
            <Typography className={classes.title} variant="h6">
                Data Drafting Service
            </Typography>
            {/* <Box className={classes.search}>
                <Box className={classes.searchIcon}>
                    <SearchIcon />
                </Box>
                <InputBase
                    placeholder="Search…"
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Box> */}
            <Box className={classes.grow} />
            <Box className={classes.user} variant="h6">{logedInUserName} [{loggedInUser.type}]</Box>
            <Box className={classes.sectionDesktop}>
                {/* <IconButton aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <IconButton aria-label="show 17 new notifications" color="inherit">
                    <Badge badgeContent={17} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton> */}
                
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </Box>

        </Toolbar>
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}            
        >
            <MenuItem onClick={() => {handleMenuClose(); handleEditProfile()} }>Profile</MenuItem>
            {isSuperAdmin && <MenuItem onClick={handleMenuClose} onClick={handleLoginTime}>Login Time</MenuItem>}
            <MenuItem onClick={handleMenuClose} onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </AppBar>;
}

export default HomeHeaderContainer;