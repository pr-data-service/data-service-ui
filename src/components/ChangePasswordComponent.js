
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
import AppContext from './AppContext';

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


const ChangePasswordComponent = () => {
    const classes = useStyles();
    const { showSnackbar } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    const [params, setParams] = React.useState({newPassword: "", confirmNewPassword: ""})

    React.useEffect(()=> {
        
    }, [])
    
    const onChange = (fieldName) => (event) => {
        let temp = {...params};
       temp[fieldName] = event.target.value; 
        setParams(temp);
    }

    const savePassword = async () => {
        if(params.newPassword != params.confirmNewPassword) {
            showSnackbar("New Password and confirm password should be same.");
            return ;
        }
        if(loggedInUser.id && loggedInUser.id > 0) {
            let responseData = await authenticationService.savePassword({id: loggedInUser.id, ...params});
            if (responseData && responseData.status == 0) {
                showSnackbar("Password successfully updated.");
            } else if (responseData) {
                showSnackbar(responseData.message);
            }
        }         
        
    }


    return <Box>
        <Typography style={{ fontWeight: "Bold", marginBottom: 20 }}>Change Password</Typography>
        <Box className={classes.root}>
            <FilterDateField name="newPassword" label={"New Password"} onChange={onChange} defaultValue={params.newPassword}/>
            <FilterDateField name="confirmNewPassword" label="Confirm New Password" onChange={onChange} defaultValue={params.confirmNewPassword}/>
            <Button variant="contained" title={"Search"} className={classes.button} onClick={savePassword} >Save</Button>
        </Box>
    </Box>
}

export default ChangePasswordComponent;

const FilterDateField = (props) => {
    const { value, name, label, defaultValue, onChange = () => { } } = props;
    const classesUnderLine = underLineStyle();
    const classes = useStyles();

    return <Box className={classes.dateContainer}>
        <Typography style={{ paddingRight: 10, }}>{label}</Typography>
        <TextField
            id="datetime-local"
            type="password"
            className={classes.dateField}
            size="small"
            style={{ width: 190, borderBottom: "0px solid none", padding: "0px 5px" }}
            InputProps={{ classes: classesUnderLine }}
            InputLabelProps={{
                shrink: false,
            }}
            onChange={onChange(name)}
            value={defaultValue}
        />
    </Box>
}