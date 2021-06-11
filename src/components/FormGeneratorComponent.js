import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    buttonContainer: {
        display: "flex",
        float: "right"
    },
    buttonGap: {
        width: 20
    }

}));

const FormGeneratorComponent = React.forwardRef(({ fields, onSubmit, callBack, cancelEvent, isHideCleareButton = false }, ref) => {
    const classes = useStyles();
    const methods = useForm();
    const { handleSubmit, setValue, getValues } = methods;

    React.useImperativeHandle(ref, () => ({

        setFormValues(formValues) {
            //alert("getAlert from Child");
            formValues = { ...getValues(), ...formValues };
            Object.keys(formValues).map(fld => {
                if (formValues[fld]) {
                    setValue(fld, formValues[fld]);
                }
            });
        },
        getFormValues() {
            return getValues();
        },
        resetForm: resetForm
    }));

    const resetForm = () => {
        let formValues = { ...getValues() };
        Object.keys(formValues).map(fld => {
            if (formValues[fld]) {
                setValue(fld, "");
            }
        });
    }


    const onError = (errors, e) => console.log(errors, e);



    const ClearButton = () => <React.Fragment>
        <Typography component="div" className={classes.buttonGap} />
        <Button variant="contained" onClick={resetForm}> Clear </Button>
    </React.Fragment>;

    return <Grid container spacing={3}>
        <FormProvider {...methods} >
            {fields.map((fld, index) => <Field key={"field-" + index} field={fld} index={index} callBack={callBack} />)}
            <Grid item xs={12}>
                <Box className={classes.buttonContainer}>
                    {cancelEvent && <Button variant="contained" onClick={cancelEvent}> Cancel </Button>}
                    {!isHideCleareButton && <ClearButton />}
                    <Typography component="div" className={classes.buttonGap} />
                    <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit, onError)}> Submit </Button>
                </Box>
            </Grid>
        </FormProvider>
    </Grid>
});

export default FormGeneratorComponent;

const Field = ({ index, field, callBack = () => { } }) => {
    let { control, setValue, getValues } = useFormContext();

    let fieldKey = "fld-" + index + "-" + field.name;
    let rules = getRules(field);

    const getField = (fieldProps) => {
        let component = null;
        if (fieldProps.name) {
            if (fieldProps.type == "TEXT" || fieldProps.type == "PASSWORD") {
                component = <Controller
                    name={fieldProps.name}
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value, onBlur, keyUp }, fieldState: { error } }) => (
                        <TextField
                            key={fieldProps.name}
                            id={"outlined-basic-" + fieldProps.name}
                            label={fieldProps.label}
                            variant="outlined"
                            fullWidth={true}
                            size="small"
                            InputLabelProps={inputLabelProps}
                            required={fieldProps.required}
                            title={fieldProps.label}
                            value={value}
                            onChange={(event) => { onChange(event); callBack(fieldProps.name, event); }}
                            onBlur={(event) => { field.event && field.event.onBlur && field.event.onBlur(getValues, setValue, fieldProps.name, event); }}
                            onKeyUp={(event) => { field.event && field.event.onKeyUp && field.event.onKeyUp(setValue, fieldProps.name, event); }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            type={fieldProps.type == "PASSWORD" ? "password" : ""}
                            multiline={field.multiline ? field.multiline : false}
                            InputProps={{ readOnly: field.readonly ? field.readonly : false, style: field.InputProps ? field.InputProps : {} }}
                            style={{ color: "red" }}
                        />
                    )}
                    rules={rules}
                />
            } else if (fieldProps.type == "SELECT") {
                component = <Controller
                    name={fieldProps.name}
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                        <TextField select
                            key={fieldProps.name}
                            id={"outlined-basic-" + fieldProps.name}
                            label={fieldProps.label} variant="outlined" fullWidth={true} size="small"
                            SelectProps={{
                                native: true,
                            }}
                            InputLabelProps={inputLabelProps}
                            required={fieldProps.required}
                            title={fieldProps.label}
                            value={value}
                            onChange={(value) => { onChange(value); callBack(fieldProps.name, value); }}
                            onBlur={(event) => { field.event && field.event.onBlur && field.event.onBlur(getValues, setValue, fieldProps.name, event); }}
                            error={!!error}
                            helperText={error ? error.message : null}
                            InputProps={{ readOnly: field.readonly ? field.readonly : false, style: field.InputProps ? field.InputProps : {} }}
                        >

                            {fieldProps.options && fieldProps.options.map((option, index) => (
                                <option key={option.value + "-" + index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    )}
                    rules={rules}
                />
            }
        }
        return component;
    }

    return <Grid key={fieldKey} item xs={field.gridXS}>{getField(field)}</Grid>
}

const inputLabelProps = {
    style: {
        fontSize: 13,
        color: "#000000bd"
    },
}

const getRules = (field) => {
    let rules = { ...field.rules };
    if (field.required) {
        rules.required = field.label + ' should not be empty!';
    }
    return rules;
}