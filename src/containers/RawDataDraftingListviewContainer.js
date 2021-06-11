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

const initDataFilter = {
    from: moment().format('YYYY-MM-DD')+" 00:00:00",
    to: moment().format('YYYY-MM-DD')+" 23:59:59"
}
const RawDataDraftingListviewContainer = () => {
    const { showSnackbar, openConfirmDialog } = React.useContext(AppRootContext);
    const { loggedInUser } = React.useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();
    const [rows, setRows] = React.useState([]);
    const [filterParams, setFilterParams] = React.useState({...initDataFilter});
    const [filterFields, setFilterFields] = React.useState([...arrFields]);

    React.useEffect(()=> {
        getData(filterParams);
        getAllActiveUser();
    }, []);


    const getAllActiveUser = async () => {
        if(loggedInUser && loggedInUser.admin) { 
            let responseData = await userService.getAllActiveUser();
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
        let responseData = await dtataDraftingFormService.getListViewRawData(filterParams);
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
                    history.push("/data-drafting-form/"+values[0]);
                } else if(type == "DELETE") {
                    deleteRawData(values[0]);
                }                
            }
        }
        
    }

    const deleteRawData = (id) => {

        openConfirmDialog("Do you want to delete this record?", null, async () => {
            let responseData = await dtataDraftingFormService.deleteRawDataById(id);
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
            if( filterParams.to != null && filterParams.to != "" && (filterParams.from == null || filterParams.from == "")){
                showSnackbar("From date required.");
            } else {
                getData(filterParams);
            }            
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

export default RawDataDraftingListviewContainer;

const columns = [
    { field: 'workLoad', headerName: 'WORK LOAD', type: "STRING", width: 150, },
    { field: 'cRefNo', headerName: 'CUSTOMER REFRENCE NUMBER', type: "STRING", width: 200, },
    { field: 'cName', headerName: 'CUSTOMER NAME', type: "STRING", width: 200, },
    { field: 'city', headerName: 'CITY', type: "STRING", width: 200, },
    { field: 'state', headerName: 'STATE', type: "STRING", width: 200, },
    { field: 'purchaseVal', headerName: 'PURCHASE VALUE', type: "FLOAT", width: 200, },
    { field: 'downPayment', headerName: 'DOWN PAYMENT(%)', type: "FLOAT", width: 200, },
    { field: 'loanPeriod', headerName: 'LOAN PERIOD(YEARS)', type: "FLOAT", width: 200, },
    { field: 'annualInterest', headerName: 'ANNUAL INTEREST(%)', type: "", width: 200, },
    { field: 'guarantorName', headerName: 'GUARANTER NAME', type: "STRING", width: 200, },
    { field: 'guarantorNo', headerName: 'GUARANTOR NO', type: "STRING", width: 200, },
    { field: 'purchaseValReduc', headerName: 'PURCHASE VALUE REDUC.(%)', type: "FLOAT", width: 200, },
    { field: 'monthPrincReduc', headerName: 'MONTHLY PRIN. REDUC.(%)', type: "FLOAT", width: 200, },
    { field: 'totIntReduc', headerName: 'TOTAL INTEREST REDUC.(%)', type: "FLOAT", width: 200, },
    { field: 'propTaxState', headerName: 'PROP. TAX STATE', type: "STRING", width: 200, },
    { field: 'propTaxCity', headerName: 'PROP. TAX CITY', type: "STRING", width: 200, },
    { field: 'propTaxReducPrcntg', headerName: 'PROP. TAX REDUC.(%)', type: "", width: 200, },
    { field: 'createdBy', headerName: 'Created By', type: "STRING", width: 150, },
    { field: 'updatedBy', headerName: 'Updated By', type: "STRING", width: 150, },
    { field: 'createdOn', headerName: 'Created On', type: "DATE", width: 200, },
    { field: 'updatedOn', headerName: 'Updated On', type: "DATE", width: 200, },
];


const arrFields = [
    {name: "userId", label: "User", type: "SELECT"},
    {name: "from", label: "From", type: "DATE", defaultValue: initDataFilter.from},
    {name: "to", label: "To", type: "DATE", defaultValue: initDataFilter.to},
    {name: "search", label: "Search", type: "SEARCH"},
]