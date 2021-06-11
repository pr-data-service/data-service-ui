
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import AppRootContext from './AppRootContext';
import moment from 'moment';
import authenticationService from '../service/authenticationService';
import utils from '../utils/utils';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    dateContainer: {
        display: "flex",
        marginRight: 10
    },
    dateField: {
        borderRadius: 1,
        border: "1px solid #00000091",
    },
    button: {
        height: 29
    }
}));


const useInputStyle = makeStyles((theme) => ({
    text: {
        height: 23,
        border: "none"
    },
    select: {
        height: 31,
        width: 170,
        color: "#000000d9"
    },
    searchInput: {
        // /height: 23,
        border: "none",
        outlineWidth: 0,
        color: "#000000d9",
        width: 170,
    },
    search: {
        display: "flex",
        borderRadius: 1,
        border: "1px solid #00000091",
    }
}));

const underLineStyle = makeStyles((theme) => ({
    underline: {
        "&&:before": {
            borderBottom: "none"
        },
        "&&:after": {
            borderBottom: "none"
        },
        '&:hover': {
            '&&:before': {
                borderBottom: "none"
            }

        }
    }
}));

const initTime = {
    loginTime: "00:00",
    logoutTime: "23:59"
}

const LogInTimeComponent = () => {
    const classes = useStyles();
    const { showSnackbar } = React.useContext(AppRootContext);
    const [params, setParams] = React.useState({...initTime})

    React.useEffect(()=> {
        getAppLoginInfo();
    }, [])

    const getAppLoginInfo = async () => {
        let responseData = await authenticationService.getAppLoginInfo();
        if (responseData && responseData.status == 0) {
            setParams(responseData.data)
        } else if (responseData) {
            showSnackbar(responseData.message);
        }
    }

    const onChange = (fieldName) => (event) => {
        let temp = {...params};
       temp[fieldName] = event.target.value; 
        setParams(temp);
    }

    const setLoginTime = async () => {
        let responseData = await authenticationService.saveAppLoginInfo(params);
        if (responseData && responseData.status == 0) {
            showSnackbar("Login Time successfully updated.");
        } else if (responseData) {
            showSnackbar(responseData.message);
        }
    }


    return <Box>
        <Typography style={{ fontWeight: "Bold", marginBottom: 20 }}>Login Time</Typography>
        <Box className={classes.root}>
            <FilterDateField name="loginTime" label={"Login Time"} onChange={onChange} defaultValue={params.loginTime}/>
            <FilterDateField name="logoutTime" label="Logout Time" onChange={onChange} defaultValue={params.logoutTime}/>
            <Button variant="contained" title={"Search"} className={classes.button} onClick={setLoginTime} >Save</Button>
        </Box>
    </Box>
}

export default LogInTimeComponent;

const FilterDateField = (props) => {
    const { value, name, label, defaultValue, onChange = () => { } } = props;
    const classesUnderLine = underLineStyle();
    const classes = useStyles();

    return <Box className={classes.dateContainer}>
        <Typography style={{ paddingRight: 10, }}>{label}</Typography>
        <TextField
            id="datetime-local"
            type="time"
            className={classes.dateField}
            size="small"
            style={{ width: 190, borderBottom: "px solid red" }}
            InputProps={{ classes: classesUnderLine }}
            InputLabelProps={{
                shrink: false,
            }}
            onChange={onChange(name)}
            //value={moment(value, 'HH:mm:ss').format('HH:mm')}
            //defaultValue={defaultValue}
            value={defaultValue}
        />
    </Box>
}