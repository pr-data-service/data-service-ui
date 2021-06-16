import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CardMedia from '@material-ui/core/CardMedia';
import HomeHeaderContainer from './HomeHeaderContainer';
import React from 'react';
import MenuComponent from '../components/MenuComponents';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import DataDraftingFormComponent from '../components/DataDraftingFormComponent';
import HomeRouterComponent from '../components/HomeRouterComponent';

const useStyles = makeStyles((theme) => ({
    root: {

    },
    boxHeader: {
        padding: "20px 0px 15px 30px"
    },
    body: {
        padding: "15px 15px",
        display: "flex",
        minHeight: 530
    },    
    boxFooter: {
        display: "none"
    },
    media: {
        height: 200
    },
    mainContainer: {
        height: "inherit",
        marginLeft: 20,
        padding: 30,
        float: "right",
        width: "82%"
    },
    menuContainer: {
        float: "left",
        width: "11%",
        height: "inherit"
    }
}));


const HomeContainer = () => {
    const classes = useStyles();

    return <Box className={classes.root}>
        <HomeHeaderContainer />
        <Box className={classes.body}>
            <Box className={classes.menuContainer}>
                <MenuComponent />
            </Box>
            <Paper elevation={8} className={classes.mainContainer}>
                <HomeRouterComponent />
            </Paper>
        </Box>
    </Box>;
}

export default HomeContainer;















{/* <Paper elevation={8}>
            <Box className={classes.boxHeader}>
                <Typography variant="h5" gutterBottom>
                    Home
                </Typography>
            </Box>
            <Box className={classes.boxBody}>
                <CardMedia
                    className={classes.media}
                    src="http://localhost:8080/"
                    title="Contemplative Reptile"
                />
            </Box>
            <Box className={classes.boxFooter}></Box>
        </Paper> */}