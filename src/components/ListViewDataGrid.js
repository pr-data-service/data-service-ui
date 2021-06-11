
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { XGrid, GridOverlay } from '@material-ui/x-grid';
import {
    useDemoData,
    getRealData,
    getCommodityColumns,
} from '@material-ui/x-grid-data-generator';
import LinearProgress from '@material-ui/core/LinearProgress';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { DataGrid } from '@material-ui/data-grid';
import Button from '@material-ui/core/Button';
import moment from 'moment'
import ListViewFilterComponent from './ListViewFilterComponent';
import TablePagination from '@material-ui/core/TablePagination';
import Pagination from 'react-js-pagination';


const useStyles = makeStyles((theme) => ({
    root: {
        height: 580
    },
    header: {
        padding: 10,
        display: "flex"
    },
    button: {
        height: 29
    },
    dataGrid: {
        //height: "80%"
    },
    innerClass: {
        listStyle: "none",        
        display: "flex"
    },
    itemClass: {
        padding: "5px 16px",
        border: "1px solid #d4d4d4",
        '& a': {
            color: "#337ab7",
            textDecoration: "none"
        }
    },
    activeClass: {
        background: "#337ab7",
        '& a': {
            color: "white",
            textDecoration: "none"
        }
    }
}));

const ListViewDataGrid = ({
    columns=[], 
    rows=[], 
    callBack=() =>{}, 
    filterFields=[], 
    onFilterChange=() =>{}, 
    checkboxSelection=true, isEdit=true, isDelete=true, isExcelDownlod=false}) => {
        
    const classes = useStyles();
    const apiRef = React.useRef();
    const [rowIds, setRowIds] = React.useState([]);

    columns.map( m => {
        m.renderHeader = (params) => <FormattedHeaderComponent {...params}/>
        m.renderCell = (params) => <FormattedCellComponent params={params}/>
        //m.valueFormatter = (params) => () => {}//valueFormatter;
    })

    const handleEvent = ({selectionModel}) => {
        console.log(apiRef)
        setRowIds(selectionModel);
    }

    const handleRowSelect = ({api, data, isSelect}) => {
        setRowIds([data.id]);
    }  
    
    const handleRecordEvent = (type) => () => {
        callBack(type, rowIds);
    }

    /*
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    const onPageChange = (event, newPage) => {
        console.log(newPage);
        setPage(newPage);
    }

    const onPageSizeChange = ({page, pageCount, pageSize, paginationMode, rowCount}) => {
        console.log(pageSize);
        setRowsPerPage(pageSize);
        setPage(0);
    }
   
    const arrRows = rows.slice((page*rowsPerPage), ((page*rowsPerPage)+rowsPerPage));
*/

    return <Box className={classes.root}>
        <Box className={classes.header}>
            {isEdit && <React.Fragment>
                <Button variant="contained" title={"Edit"} className={classes.button} onClick={handleRecordEvent("EDIT")} ><EditIcon style={{fontSize: 19}}/></Button>
                <Typography style={{width: 10}}/>
            </React.Fragment>}
            {isDelete && <React.Fragment>
                <Button variant="contained" title={"Delete"} className={classes.button} onClick={handleRecordEvent("DELETE")} ><DeleteIcon style={{fontSize: 19}}/></Button>
                <Typography style={{width: 10}}/>
            </React.Fragment>}
            <ListViewFilterComponent fields={filterFields} onChange={onFilterChange} />
            <Typography style={{width: 10}}/>
            {isExcelDownlod && <React.Fragment>                
                <Button variant="contained" title={"Download Excel"} className={classes.button} onClick={() => callBack("DOWN_LOAD_EXCEL", rowIds)} >
                <i className="fa fa-file-excel-o" aria-hidden="true"></i>
                </Button>
                <Typography style={{width: 10}}/>
            </React.Fragment>}
        </Box>
        <DataGrid
            //apiRef={apiRef}
            key={"data-grid"}
            headerHeight={25}
            rowHeight={25}
            checkboxSelection={checkboxSelection}
            disableColumnMenu={true}
            disableColumnSelector={true}
            disableExtendRowFullWidth={true}
            disableSelectionOnClick={true}
            onSelectionModelChange={(row) => handleEvent(row)}//multiple row
            onRowSelected={(row) => handleRowSelect(row)}
            onColumnResizeCommitted={(s) => console.log(s)}
            columns={columns}
            rows={rows}
            //rows={arrRows}
            showColumnRightBorder={true}

            /*
            rowCount={arrRows.length}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            paginationMode={"server"}*/
            // hideFooterPagination={true}
            // hideFooter={true}

            className={classes.dataGrid}
        />

        {/* https://www.npmjs.com/package/react-js-pagination */}
        {/* <Pagination
          activePage={5}
          itemsCountPerPage={10}
          totalItemsCount={100}
          pageRangeDisplayed={5}
          onChange={(pageNumber) => alert(pageNumber)}
          innerClass={classes.innerClass}
          itemClass={classes.itemClass}
          activeClass={classes.activeClass}
        /> */}
    </Box>;
}

export default ListViewDataGrid;

const FormattedHeaderComponent = ({colDef,...params}) => {    
    return <div style={{
        fontWeight: "bold",
        color: '#000000b5',
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap'}
    } title={colDef.headerName}>{colDef.headerName}</div>
}


const FormattedCellComponent = ({params}) => {
    let value = valueFormatter(params);
    return <div style={{
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap'}
    } title={value}>{value}</div>
}

const valueFormatter = ({colDef, value, ...params}) => {
    if(colDef.type == "DATE") {
        let dt = new Date(value);
        let strDt = moment(dt).format('YYYY-MMM-DD HH:mm:ss') ; //moment(dt).format('YYYY-MMM-DD hh:mm:ss a') ;
        return strDt
    }
    return value;
}



const columns1 = [
    { field: 'id', headerName: 'ID', width: 90, hide: true },
    { field: 'firstName', headerName: 'First name', width: 150 },
    { field: 'lastName', headerName: 'Last name', width: 350 },
    {
        field: 'age',
        headerName: 'Age',
        type: 'number',
        width: 110,
    },
    {
        field: 'fullName',
        headerName: 'Full name',
        description: 'This column has a value getter and is not sortable.',
        sortable: false,
        width: 160,
        valueGetter: (params) =>
            `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''
            }`,
    },
];

const rows1 = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];