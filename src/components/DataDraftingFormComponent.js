import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import React from 'react';
import {
    useParams,
    useHistory
} from "react-router-dom";
import FormGeneratorComponent from './FormGeneratorComponent';
import dtataDraftingFormService from '../service/dtataDraftingFormService';
import AppRootContext from './AppRootContext';
import utils from '../utils/utils';
import ImageSourceComponent from './ImageSourceComponent';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    formContainer: {
        width: "50%",
        // height: 600,
        // maxHeight: 600,
        // overflow: "auto",
        padding: "0px 12px"
    }
}));




const DataDraftingFormComponent = () => {
    const { showSnackbar } = React.useContext(AppRootContext);
    const classes = useStyles();
    const childRef = React.useRef();

    const [fields, setFields] = React.useState(fieldConstants);
    const [rawStates, setRawStates] = React.useState([]);
    const { id } = useParams();
    const history = useHistory();

    React.useEffect(() => {
        getState();
    }, []);

    React.useEffect(() => {
        if (id > 0) {
            getDataToEdit(id);
        }
    }, [id]);

    const getDataToEdit = async (id) => {
        let responseData = await dtataDraftingFormService.getRawDataById(id);
        if (responseData && responseData.status == 0) {
            childRef.current.setFormValues(responseData.data);
        } else if (responseData) {
            showSnackbar(responseData.message);
        }
    }

    const callBack = (fieldName, event) => {
        if (fieldName == "propTaxState") {
            getCity(event.target.value);
        } else if (fieldName == "propTaxCity") {
            childRef.current.setFormValues({ propTaxReducPrcntg: event.target.value });
        }

    }

    const getState = async () => {
        try {
            let responseData = await dtataDraftingFormService.getState();
            if (responseData && responseData.status == 0) {
                if (responseData.data) {
                    setRawStates(responseData.data);
                    /*let stateField = fields.find(f => f.name == "propTaxState");
                    if (stateField) {
                        let options = responseData.data.map(s => { return { value: s.value, label: s.name } });
                        options.unshift({ value: ' ', label: '--- Select State ---' });
                        stateField.options = options;
                        stateField.value = " ";
                        setFields([...fields]);
                    }*/
                }
            }

        } catch (error) {
            console.error(error);
        }
    }

    const getCity = async (stateVal) => {
        try {
            if (stateVal && stateVal != "" && rawStates) {
                let stateObj = rawStates.find(f => f.value == stateVal);
                if (stateObj && stateObj.cityList) {
                    let options = stateObj.cityList.map(s => { return { value: s.reductionRate, label: s.name } });
                    options.unshift({ value: ' ', label: '--- Select City ---' });

                    let stateField = fields.find(f => f.name == "propTaxCity");
                    stateField.options = options;
                    setFields([...fields]);

                    childRef.current.setFormValues({ propTaxCity: ' ' });
                }


            }
        } catch (error) {
            console.error(error);
        }
    }

    const isDuplicateRawData = async () => {
        let { cRefNo, guarantorNo } = childRef.current.getFormValues();
        let params = {cRefNo, guarantorNo};
        if(id && id > 0) {
            params.id = id;
        }
        let responseData = await dtataDraftingFormService.isDuplicateRawData(params);
        if (responseData && responseData.status == 0) {
            return responseData.data;
        } 
        return false;
    }



    const onSubmit = async (data, e) => {
        let isDuplicate = await isDuplicateRawData();
        if(isDuplicate) {
            showSnackbar("System can not allow duplicate CUSTOMER REFRENCE NUMBER or GUARANTOR NUMBER.");
            return;
        }

        if (id > 0) {
            data.id = id;
        }
        let responseData = await dtataDraftingFormService.onFormSubmit(data);
        if (responseData && responseData.status == 0) {
            showSnackbar("Successfully saved.");
            if (id > 0) {
                history.push("/data-drafting-form")
            } else {
                childRef.current.resetForm();
            }

        } else if (responseData) {
            showSnackbar("Faild to save!");
        }
    }

    return <Box className={classes.root}>
        <ImageSourceComponent />
        <Box className={classes.formContainer}>
            <FormGeneratorComponent ref={childRef} fields={fields} onSubmit={onSubmit} callBack={callBack} />
        </Box>

    </Box>;
}

export default DataDraftingFormComponent;



const onBlurEvent = (getValues, setValue, fieldName, event) => {

    if (fieldName == "cRefNo" || fieldName == "guarantorNo") {
        let val = UtilsFunc.spaceFactor(3, event.target.value);
        val = UtilsFunc.upperCase(val);
        setValue(fieldName, val);
    } else if (fieldName == "cName" || fieldName == "guarantorName") {
        let rawVal = UtilsFunc.upperCase(event.target.value);
        rawVal = rawVal.replace(/[0-9]/g, '');
        if(rawVal.startsWith("MR. ")) {
            rawVal = rawVal.replaceAll("MR.", "");
            rawVal = "MR."+rawVal.trim();
        } else if(rawVal.startsWith("MRS. ")) {
            rawVal = rawVal.replaceAll("MRS.", "");
            rawVal = "MRS."+rawVal.trim();
        } else if(rawVal.toUpperCase().startsWith("MS. ")) {
            rawVal = rawVal.replaceAll("MS.", "");
            rawVal = "MS."+rawVal.trim();
        }

        let val = UtilsFunc.spaceFactor(2, rawVal);
        val = UtilsFunc.upperCase(val);
        setValue(fieldName, val);
    } else if (fieldName == "city" || fieldName == "state") {
        let val = UtilsFunc.spaceFactor(1, event.target.value);
        val = UtilsFunc.upperCase(val);
        setValue(fieldName, val);

        let state = fieldName != "state" ? getValues()["state"] : val;
        let city = fieldName != "city" ? getValues()["city"] : val;
        getPropertyTax(setValue, state, city);       
    } else if(fieldName == "purchaseVal") {
        let purchaseValInWords = utils.convertAmountInWords(event.target.value);
        setValue("purchaseValInWords", purchaseValInWords);
    }
}

const getPropertyTax = async (setValue, state, city) => {
    if(state && state != "" && city && city != "") {
        state = state.replaceAll("  ", " ");
        city = city.replaceAll("  ", " ");


        let responseData = await dtataDraftingFormService.getPropertyTax(state, city);
        if (responseData && responseData.status == 0) {
            setValue("propTaxReducPrcntg", responseData.data);
        }        
    }
}

const onKeyUpEvent = (setValue, fieldName, event) => {
    if (fieldName == "workLoad" 
        || fieldName == "loanAmount" || fieldName == "principal"
        || fieldName == "purchaseVal" || fieldName == "downPayment"
        || fieldName == "loanPeriod" || fieldName == "annualInterest"
        || fieldName == "purchaseValReduc" || fieldName == "monthPrincReduc"
        || fieldName == "totIntReduc" || fieldName == "propTaxReducPrcntg") {

        let val = UtilsFunc.amountFieldValidation(event.target.value);
        setValue(fieldName, val);
    }
}

let fieldConstants = [
    { name: "workLoad", label: "WORK LOAD", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "cRefNo", label: "CUSTOMER REFRENCE NUMBER", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "cName", label: "CUSTOMER NAME", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "city", label: "CITY", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "state", label: "STATE", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "purchaseVal", label: "PURCHASE VALUE", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "purchaseValInWords", label: "PURCHASE VALUE IN WORDS", type: "TEXT", gridXS: 12, required: false, value: "", readonly: true, multiline: true, event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {}, InputProps:{color: "red", background: "#00000021"} },
    { name: "downPayment", label: "DOWN PAYMENT(%)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "loanPeriod", label: "LOAN PERIOD(YEARS)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "annualInterest", label: "ANNUAL INTEREST(%)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "purchaseValReduc", label: "PURCHASE VALUE REDUCTION(%)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "monthPrincReduc", label: "MONTHLY PRINCIPLE REDUCTION(%)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "totIntReduc", label: "TOTAL INTEREST REDUCTION(%)", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {} },
    { name: "guarantorName", label: "GUARANTER NAME", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "guarantorNo", label: "GUARANTOR NUMBER", type: "TEXT", gridXS: 6, required: true, value: "", event: { onBlur: onBlurEvent }, rules: {} },
    { name: "propTaxReducPrcntg", label: "PROPERTY TAX REDUCTION (%)", type: "TEXT", gridXS: 6, value: "", readonly: true, event: { onBlur: onBlurEvent, onKeyUp: onKeyUpEvent }, rules: {}, InputProps:{color: "red", background: "#00000021"}},
]


const UtilsFunc = {
    spaceFactor: (noOfSpace, value) => {
        try {
            if (noOfSpace > 0) {
                var strSpace = "";
                for (var i = 0; i < noOfSpace; i++) {
                    strSpace += " ";
                }

                var strArr = value.split(" ");
                strArr = strArr.filter(f => f != "");
                value = strArr.join(strSpace);
            }
        } catch (error) {
            console.error(error);
        }
        return value;
    },
    upperCase: (val) => {
        try {
            if (val) {
                val = val.toUpperCase();
            }
        } catch (error) {
            console.error(error);
        }
        return val;
    },
    amountFieldValidation: (val) => {
        try {
            var valid = /^\d{0,10}(\.\d{0,2})?$/.test(val);

            if (parseFloat(val)) {
                if (!valid) {
                    val = val.substring(0, val.length - 1)
                }
            } else {
                val = "";
            }
        } catch (error) {
            console.error(error);
            val = "";
        }

        return val;
    }
}