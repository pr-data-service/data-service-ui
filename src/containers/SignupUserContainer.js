
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Redirect, useHistory, useParams } from "react-router-dom";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import userService from '../service/userService';
import AppRootContext from '../components/AppRootContext';
import FormGeneratorComponent from '../components/FormGeneratorComponent';
import AppContext from '../components/AppContext';

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        top: "10%",
        left: "30%",
    },
    rootForEdit: {
        width: 500
    },
    boxHeader: {
        padding: "20px 0px 15px 30px"
    },
    boxBody: {
        margin: "15px 80px"
    },
    boxFooter: {
        display: "none"
    },
}));

const SignupUserContainer = () => {
    const { showSnackbar } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    const childRef = React.useRef();
    const classes = useStyles();
    let history = useHistory();
    const { register, handleSubmit } = useForm();
    const { id } = useParams();
    const [fields, setFields] = React.useState([...fieldsArr])

    
    React.useEffect(()=>{
        filterFieldsForUser();
        if(id>0) {
            getDataToEdit(id);
        }
    },[id]);

    const filterFieldsForUser = async () => {
        
                
        if(loggedInUser) {
            let isProfile = history.location.pathname.startsWith("/profile/edit/");
            if(loggedInUser.superAdmin) {
                if(isProfile){
                    let arr = fieldsArr.filter( f => f.name != "isActive" && f.name != "type" );
                    setFields(arr);
                }
                
            } else {
                let arr = fieldsArr.filter( f => f.name != "isActive" && f.name != "phone" && f.name != "type");
                setFields(arr);
            }           
        } else {
            let arr = fieldsArr.filter( f => f.name != "isActive" && f.name != "type");
            setFields(arr);
        }    
    }

    const getDataToEdit = async (id) => {
        let responseData = await userService.getUserById(id);
        if(responseData && responseData.status == 0){
           childRef.current.setFormValues(responseData.data);
        }
    }

    const onSubmit = async (data, e) => {
        let isProfile = history.location.pathname.startsWith("/profile/edit/");
        if(!isProfile && loggedInUser && loggedInUser.userName == data.userName) {
            showSnackbar("Logged in user record can not update from here. Go to profile and update.");
            return;
        }
        if(id > 0) {
            data.id = id;
        }
        let responseData = await userService.saveUser(data);
        if (responseData && responseData.status == 0) {
            if(id > 0) {
                showSnackbar("Successfull Saved user.");
            } else {
                showSnackbar("Successfull added user.");
                history.push("/");
            }
        } else if (responseData) {
            showSnackbar(responseData.message);
        } else {
            showSnackbar("Failed to added user.");
        }

    }

    

    const cancelEvent = () => {
        if(id && id > 0) {
            childRef.current.resetForm();
        } else {
            history.push("/");
        }
    }

    

    let flds = [...fields];
    if(id && id > 0) {
        flds = flds.filter(f => f.name != "password");
    }


    return <> {id && <Box className={classes.rootForEdit}>  
        <FormGeneratorComponent ref={childRef} fields={flds} onSubmit={onSubmit} isHideCleareButton={true}/>
    </Box> }
     {!id && <Container maxWidth="sm" className={classes.root}>
        <Paper elevation={8}>
            <Box className={classes.boxHeader}>
                <Typography variant="h5" gutterBottom>Signup User</Typography>
            </Box>
            <Box className={classes.boxBody}>
                <FormGeneratorComponent 
                    ref={childRef} 
                    fields={fields} 
                    onSubmit={onSubmit} 
                    cancelEvent={cancelEvent}/>
            </Box>
        </Paper>
    </Container>}
    </>
}

export default SignupUserContainer;

const userOptions = [
    {value: " ", label: '-- Select --'}, 
    {value: "USER", label: 'User'}, 
    {value: "ADMIN", label: 'Admin'}
];

const activeDeactiveOptions = [
    {value: " ", label: '-- Select --'}, 
    {value: true, label: 'Active'}, 
    {value: false, label: 'De-Active'}
];

const onBlurEvent = (getValues, setValue, fieldName, event) => {

    if (fieldName == "userName") {
        let val = event.target.value;
        val = val.replaceAll(" ", "");
        setValue(fieldName, val);
    }
}

const fieldsArr = [
    {name: "userName", label:"User name", type: "TEXT", gridXS: 12, required: true, value: "", rules: {}, event: { onBlur: onBlurEvent }},
    {name: "password", label:"Password", type: "PASSWORD", gridXS: 12, required: true, value: "", rules: {}},
    {name: "firstName", label:"First Name", type: "TEXT", gridXS: 12, required: true, value: "", rules: {}},
    {name: "lastName", label:"Last Name", type: "TEXT", gridXS: 12, required: true, value: "", rules: {}},
    {name: "email", label:"Email", type: "TEXT", gridXS: 12, required: true, value: "", rules: {}},
    {name: "phone", label:"Phone", type: "TEXT", gridXS: 12, required: true, value: "", rules: {}},
    {name: "type", label:"User Role", type: "SELECT", gridXS: 12, required: true, value: "", rules: {}, options: userOptions},
    {name: "isActive", label:"Active/De-Active", type: "SELECT", gridXS: 12, required: true, value: "", rules: {}, options: activeDeactiveOptions},
]