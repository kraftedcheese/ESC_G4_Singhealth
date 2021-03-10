import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import { useForm, Form } from './useForm';
import TextField from '@material-ui/core/TextField';
import RadioGroup from './RadioGroup';
import Button from './Button';
import DatePicker from './DatePicker';
import Select from './Select';
import * as tenantService from './tenantService';


const fnbItems = [
    { id: 'fnb', title: 'F&B' },
    { id: 'not_fnb', title: 'Non-F&B' }
]

const initialFValues = {
    tenant_id: 0,
    name: '',
    phone: '',
    email: '',
    institution: '',
    fnb: 'false',
    unit: '',
    tenancyEndDate: new Date(),
}

export default function DirectoryForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        if ('phone' in fieldValues)
            temp.phone = fieldValues.phone.length > 7 ? "" : "Minimum 8 numbers required."
        setErrors({
            ...temp
        })

        if (fieldValues == values)
            return Object.values(temp).every(x => x == "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12} md={6} >
                    <TextField
                        name="name"
                        label="Name"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        error={errors.email}
                    />
                    <TextField
                        label="Phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleInputChange}
                        error={errors.phone}
                    />
                    <TextField
                        label="Unit"
                        name="unit"
                        value={values.unit}
                        onChange={handleInputChange}
                    />

                </Grid>
                <Grid item xs={12} md={6}>
                    <RadioGroup
                        name="fnb"
                        label=""
                        value={values.fnb}
                        onChange={handleInputChange}
                        items={fnbItems}
                    />
                    <Select
                        name="institution"
                        label="Institution"
                        value={values.institution}
                        onChange={handleInputChange}
                        options={tenantService.getInstitutionCollection()}
                    />
                    <DatePicker
                        name="tenancyEndDate"
                        label="Tenancy End Date"
                        value={values.tenancyEndDate}
                        onChange={handleInputChange}
                    />
                    <div>
                        <Button
                            type="submit"
                            text="Submit" />
                        <Button
                            text="Reset"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}