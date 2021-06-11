

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        height: 580
    },
    header: {
        padding: 10,
        display: "flex"
    }, 
    button:{
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






const ListViewFilterComponent = ({ fields=[], onChange=()=>{} }) => {
    const classes = useStyles();
    
    let arrFields = fields.map((m, index) => <FilterTextField key={'FilterTextField-'+index} {...m} onChange={onChange}/>);
    let elements = [];
    arrFields.map((m, index)=>{
        if((index+1 != 1) && (index+1 % 2 != 0)) {
            elements.push(<Box key={'box-'+index}style={{ width: 10 }}></Box>)
        }
        elements.push(m);
    });
    return <Box style={{ display: "flex" }}>
        {elements}
        <Box style={{ width: 10 }}></Box>
        <Button variant="contained" title={"Search"} className={classes.button} onClick={onChange("SEARCH_BUTTON")} >Search</Button>
    </Box>
}

export default ListViewFilterComponent;



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
    },
    dateField: {
        borderRadius: 1,
        border: "1px solid #00000091",
    }
}));



const FilterTextField = (props) => {
    const {type, name, label, options, onChange = () => { }} = props;
    const classes = useInputStyle();
    let element = <input type="text" placeholder="Search Data" className={classes.text} />;
    if (type == "SELECT") {
        element = <select placeholder="Search Data" className={classes.select}
            id={"name-" + name}
            name={name}
            onChange={onChange(name)}
        >
            <option value=''> -- Select {label} -- </option>
            {options && options.map(m => <option value={m.value}>{m.label}</option>)}
        </select>;
    } else if (type == "SEARCH") {
        element = <FilterSearchField {...props}/>
    } else if (type == "DATE") {
        element = <FilterDateField {...props}/>
    }
    return element;
}

const FilterSearchField = (props) => {
    const {type, name, label, optionsArr, onChange = () => { }} = props;
    const classes = useInputStyle();
    let element = <Box className={classes.search}>
        <SearchIcon />
        <input type="text" placeholder="Search Data" className={classes.searchInput} onChange={onChange(name)}/>
    </Box>;

    return element;
}

const FilterDateField = (props) => {
    const {type, name, label, defaultValue, onChange = () => { }} = props;
    const classesUnderLine = underLineStyle();
    const classes = useInputStyle();


    return <TextField
        id="datetime-local"
        //label="Next appointment"
        type="datetime-local"
        //defaultValue="2017-05-24T10:30"
        //defaultValue={moment().format('YYYY-MM-DDTHH:mm')}
        defaultValue={moment(defaultValue).format('YYYY-MM-DDTHH:mm')}
        className={classes.dateField}
        size="small"
        style={{ width: 190, borderBottom: "px solid red" }}
        InputProps={{ classes: classesUnderLine }}
        InputLabelProps={{
            shrink: false,
        }}
        onChange={onChange(name)}
    />
}
