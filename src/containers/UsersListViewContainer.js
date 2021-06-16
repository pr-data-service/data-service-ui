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
    const { showSnackbar, openConfirmDialog, openDialog } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();
    const [rows, setRows] = React.useState([]);
    const [filterParams, setFilterParams] = React.useState({});
    const [filterFields, setFilterFields] = React.useState([...arrFields]);

    const isSuperAdmin = loggedInUser && loggedInUser.superAdmin ? true : false;

    React.useEffect(()=> {
        getAllAdminUser();
        getData();
    }, []);

    const getAllAdminUser = async () => {
        if(loggedInUser && (loggedInUser.superAdmin)) {
            let responseData = await userService.getAllAdminUser();
            if(responseData && responseData.status == 0 && responseData.data){
                let users = responseData.data;
                users = users.map(m => { return {value: m.id, label: m.firstName + " " + m.lastName}});
                if(filterFields) {
                    let arr = [...filterFields];
                    arr.map( m => {
                        if(m.name == "userId") {
                            m.options = users;
                        }
                    })
                    setFilterFields(arr);
                }
            }
        } else {
            let arr = filterFields.filter( f => f.name != "userId");
            setFilterFields(arr);
        }        
    }


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
        } else if(type == "FROM_MORE_BUTTON") {
            if(values.value == "ADD_USER_TO_ADMIN_MENU") {
                if(values.selectedRecordIds.length > 0){
                    openDialog(<AddUserToAdmin userList={rows} selectedUsers={values.selectedRecordIds} callBack={handleRecordEvent}/>, "Add User to Admin");
                } else {
                    showSnackbar("Select one or more record!");
                }                
            } else if(values.value == "REMOVE_USER_FROM_ADMIN_MENU") {
                if(values.selectedRecordIds.length > 0){
                    removeFromParent(values.selectedRecordIds);
                } else {
                    showSnackbar("Select one or more record!");
                }                
            } else if(values.value == "ACTIVE_MENU" || values.value == "DEACTIVE_MENU") {
                if(values.selectedRecordIds.length > 0){
                    activeOrDeactive({ids: values.selectedRecordIds, fieldNameValue: {isActive: values.value == "ACTIVE_MENU" ? true : false}});
                } else {
                    showSnackbar("Select one or more record!");
                } 
            }
        } else if(type == "ADD_USER_TO_ADMIN") {
            addToParent(values)
        }
        
    }

    const addToParent = async ({parentId, selectedUsers}) => {        
        openConfirmDialog("Do you want to add selected users to Admin?", null, async () => {
            let responseData = await userService.addToParent({parentId, userIds: selectedUsers});
            if(responseData && responseData.status == 0){
                showSnackbar("Successfully Added.");
                getData(filterParams);
            } else {
                showSnackbar("Failed to added.");
            }
        })
    }

    const activeOrDeactive = async (params) => {
        openConfirmDialog("Do you want to "+(params.fieldNameValue.isActive ? "ACTIVE" : "DEACTIVE") +" selected users from Admin?", null, async () => {
            let responseData = await userService.activeOrDeactive(params);
            if(responseData && responseData.status == 0) {
                showSnackbar("Successfully "+(params.fieldNameValue.isActive ? "Active" : "Deactive") +"ted.");
                getData(filterParams);
            } else {
                showSnackbar("Failed to "+(params.fieldNameValue.isActive ? "Active" : "Deactive"));
            }
        })
    }

    const removeFromParent = async (selectedUsers) => {        
        openConfirmDialog("Do you want to remove selected users from Admin?", null, async () => {
            let responseData = await userService.removeFromParent({userIds: selectedUsers});
            if(responseData && responseData.status == 0) {
                showSnackbar("Successfully removed.");
                getData(filterParams);
            } else {
                showSnackbar("Failed to removed.");
            }
        })
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

    let cols = isSuperAdmin ? columns : columns.filter( f => f.field != "type" && f.field != "activeOrdeactive" && f.field != "parent" && f.field != "createdOn" && f.field != "updatedOn");

    return <>
        <ListViewDataGrid 
            id={"user-listview"} 
            columns={cols} 
            rows={rows} 
            callBack={handleRecordEvent} 
            filterFields={filterFields} 
            onFilterChange={onFilterChange} 
            isEdit={isSuperAdmin ? true : false}
            isDelete={isSuperAdmin ? true : false}
            moreMenues={isSuperAdmin ? moreMenues : []}/>
    </>;
}

export default UsersListViewContainer;

const columns = [
    { field: 'userName', headerName: 'USER NAME', type: "STRING", width: 200, },
    { field: 'firstName', headerName: 'FIRST NAME', type: "STRING", width: 200, },
    { field: 'lastName', headerName: 'LAST NAME', type: "STRING", width: 200, },
    { field: 'email', headerName: 'EMAIL', type: "STRING", width: 200, },
    { field: 'phone', headerName: 'PHONE', type: "STRING", width: 110, },
    { field: 'parent', headerName: 'Admin', type: "STRING", width: 200, },
    { field: 'type', headerName: 'TYPE', type: "STRING", width: 110, },
    { field: 'activeOrdeactive', headerName: 'ACTIVE/DE-ACTIVE', type: "STRING", width: 200, },
    { field: 'createdOn', headerName: 'Created On', type: "DATE", width: 200, },
    { field: 'updatedOn', headerName: 'Updated On', type: "DATE", width: 200, },
];


const arrFields =[
    {name: "userId", label: "User", type: "SELECT"},
    {name: "search", label: "Search", type: "SEARCH"},
]

const moreMenues =[
    {value: "ADD_USER_TO_ADMIN_MENU", label: "Add user to Admin"},
    {value: "REMOVE_USER_FROM_ADMIN_MENU", label: "Remove user from Admin"},
    {value: "ACTIVE_MENU", label: "Active"},
    {value: "DEACTIVE_MENU", label: "Deactive"},
]


const AddUserToAdmin = ({userList=[], callBack=()=>{}, selectedUsers=[]}) => {

    const [adminId, setAdminId] = React.useState(0);

    const handleAddUserToAdmin = () => {
        if(adminId && adminId > 0) {
            callBack("ADD_USER_TO_ADMIN", {parentId: adminId, selectedUsers});
        }
    }

    const options = userList.filter(f => f.type == "ADMIN").map( m => <option value={m.id}>{`${m.firstName} ${m.lastName} (${m.email})`}</option>) 

    return <Box style={{width: 500, padding: "0px 20px 20px", display: "flex"}}>
        <select style={{width: "80%", height: 30,  color: "#000000d9"}} onChange={(e)=> setAdminId(e.target.value)}>
            <option value={0}>--- Select Admin ---</option>
        {options}
        </select>
        <Button variant="contained" title={"Search"} style={{ marginLeft: 10, width: "20%", height: 29, }} onClick={handleAddUserToAdmin}>Add</Button>
    </Box>
}