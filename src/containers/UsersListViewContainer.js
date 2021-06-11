import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import ListViewDataGrid from '../components/ListViewDataGrid';
import dtataDraftingFormService from '../service/dtataDraftingFormService';
import { Redirect, useHistory } from "react-router-dom";
import AppRootContext from '../components/AppRootContext';
import utils from '../utils/utils';
import userService from '../service/userService';
import AppContext from '../components/AppContext';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {

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


const UsersListViewContainer = () => {
    const { showSnackbar, openConfirmDialog } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();
    const [rows, setRows] = React.useState([]);
    const [filterParams, setFilterParams] = React.useState({});
    const [filterFields, setFilterFields] = React.useState([...arrFields]);

    React.useEffect(()=> {
        getData();
    }, []);


    const getData = async (filterParams) => {
        let responseData = await userService.getListViewData(filterParams);
        if(responseData && responseData.status == 0){
            setRows(responseData.data);
        }
    }

    const handleRecordEvent = (type, values) => {
        if(type == "EDIT" || type == "DELETE") {
            if(values.length == 0 || values.length > 1) {
                showSnackbar("Select one record for this operation.");
            } else if(values.length > 0) {
                if(type == "EDIT") {
                    history.push("/user/edit/"+values[0]);
                } else if(type == "DELETE") {
                    deleteRawData(values[0]);
                }                
            }
        }
        
    }

    const deleteRawData = (id) => {

        openConfirmDialog("Do you want to delete this record?", null, async () => {
            let responseData = await userService.deleteUserById(id);
            if(responseData && responseData.status == 0){
                showSnackbar("Successfully deleted.");
                getData(filterParams);
            } else {
                showSnackbar("Failed to deleted.");
            }
        })
        
    }

    const onFilterChange = (fieldName) => (event) => {
        if(fieldName == "SEARCH_BUTTON") {
            getData(filterParams);
        } else {
            let params = {...filterParams};
            if(fieldName == "from" || fieldName == "to") {
                params[fieldName] = utils.formatDateForAPI(event.target.value);
            } else {
                params[fieldName] = event.target.value;
            }
            
            setFilterParams(params);
        }
    }

    return <>
        <ListViewDataGrid columns={columns} rows={rows} callBack={handleRecordEvent} filterFields={filterFields} onFilterChange={onFilterChange}/>
    </>;
}

export default UsersListViewContainer;

const columns = [
    { field: 'firstName', headerName: 'FIRST NAME', type: "STRING", width: 200, },
    { field: 'lastName', headerName: 'LAST NAME', type: "STRING", width: 200, },
    { field: 'email', headerName: 'EMAIL', type: "STRING", width: 200, },
    { field: 'phone', headerName: 'PHONE', type: "STRING", width: 200, },
    { field: 'type', headerName: 'TYPE', type: "STRING", width: 200, },
    { field: 'activeOrdeactive', headerName: 'ATIVE/DE-ACTIVE', type: "STRING", width: 200, },
    { field: 'createdOn', headerName: 'Created On', type: "DATE", width: 200, },
    { field: 'updatedOn', headerName: 'Updated On', type: "DATE", width: 200, },
];


const arrFields =[
    {name: "search", label: "Search", type: "SEARCH"},
]