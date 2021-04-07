import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core";

export function useForm(initialFValues, validateOnChange = false, validate) {


    const [values, setValues] = useState(initialFValues);
    const [errors, setErrors] = useState({});

    const handleInputChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })

        console.log("changing values")
        console.log(values);
        if (validateOnChange)
            validate({ [name]: value })
    }

    // const handlefnbChange = e => {
    //     const { name, value } = e.target
    //     if (value == 0) {
    //         setValues({
    //             [name]: "false"
    //         })
    //     }
    //     else if (value == 1) {
    //         setValues({
    //             [name]: "true"
    //         })
    //     }
    //     else{

    //     }
    // }


    const resetForm = () => {
        setValues(initialFValues);
        setErrors({})
    }


    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm

    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '90%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form className={classes.root} autoComplete="off" {...other}>
            {props.children}
        </form>
    )
}