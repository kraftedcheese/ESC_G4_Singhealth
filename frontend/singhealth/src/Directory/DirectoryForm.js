import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { useForm, Form } from "./useForm";
import TextField from "@material-ui/core/TextField";
import RadioGroup from "./RadioGroup";
import Button from "./Button";
import DatePicker from "./DatePicker";
import Select from "./Select";
import * as tenantService from "./tenantService";
import UploadPhoto from "./UploadPhoto";

const fnbItems = [
  { id: "true", title: "F&B" },
  { id: "false", title: "Non-F&B" },
];

//allows you to define the things we're storing for each tenant.
const initialFValues = {
  name: "",
  phone: "",
  email: "",
  password: "",
  institution: "",
  fnb: "false",
  unit: "",
  image_logo: "",
  image_location: "",
  contract_date: new Date(), //should be a unix datetime integer
};

export default function DirectoryForm(props) {
  const { addOrEdit, recordForEdit, isAdd, setOpenPopup } = props;

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("name" in fieldValues)
      temp.name = fieldValues.name ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = (/$^|.+@.+..+/.test(fieldValues.email) && fieldValues.email)
        ? ""
        : "Email is not valid.";
    if ("password" in fieldValues)
      temp.password = fieldValues.password ? "" : "This field is required.";
    if ("phone" in fieldValues)
      temp.phone =
        ((fieldValues.phone.length > 7) && (/^[^a-z]+$/gi.test(fieldValues.phone))) 
        ? "" 
        : "Minimum 8 numbers required.";
    if ("unit" in fieldValues)
      temp.unit = /^[^a-z]+$/gi.test(fieldValues.unit)
        ? ""
        : "Unit is not valid.";
    if ("institution" in fieldValues)
      temp.institution = fieldValues.institution ? "" : "This field is required.";
    if ("fnb" in fieldValues)
      temp.fnb = fieldValues.fnb ? "" : "This field is required.";
    setErrors({
      ...temp,
    });

    if (fieldValues == values) return Object.values(temp).every((x) => x == "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  } = useForm(initialFValues, true, validate);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting")
    if (validate()) {
      console.log("validated. these are the submitted values:")
      console.log(values)
      addOrEdit(values, resetForm);
      setOpenPopup(false);
    }
    else console.log("not validated")
  };

  useEffect(() => {
    if (recordForEdit != null)
      setValues({
        ...recordForEdit,
      });
  }, [recordForEdit]);

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <TextField
            name="name"
            label="Name"
            value={values.name}
            onChange={handleInputChange}
            error={errors.name}
            data-test="name"
          />
          <TextField
            label="Email"
            name="email"
            value={values.email}
            onChange={handleInputChange}
            error={errors.email}
            data-test="email"
          />
          {isAdd &&
          <TextField
            label="Password"
            name="password"
            value={values.password}
            onChange={handleInputChange}
            error={errors.password}
            data-test="password"
          />}
          <TextField
            label="Phone"
            name="phone"
            value={values.phone}
            onChange={handleInputChange}
            error={errors.phone}
            data-test="phone"
          />
          <TextField
            label="Unit"
            name="unit"
            value={values.unit}
            onChange={handleInputChange}
            error={errors.unit}
            data-test="unit"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container style={{gap: 20}} justify="center"> 
            <UploadPhoto 
              name="image_logo"
              label="Upload Logo"
              onChange={handleInputChange}
              data-test="image_logo"
            />
            <UploadPhoto 
              name="image_location"
              label="Upload Storefront"
              onChange={handleInputChange}
              data-test="image_location"
            />
          </Grid>
          <RadioGroup
            value={values.fnb}
            onChange={handleInputChange}
            items={fnbItems}
            error={errors.fnb}
            name="fnb"
          />
          <Select
            name="institution"
            label="Institution"
            value={values.institution}
            onChange={handleInputChange}
            options={tenantService.getInstitutionCollection()}
            error={errors.institution}
            data-test="institution"
          />
          <DatePicker
            name="contract_date"
            label="Contract End Date"
            value={values.contract_date}
            onChange={handleInputChange}
            data-test="contract_date"
          />
          
          <Grid container justify="center">
            <Button type="submit" text="Submit" data-test="submit"/>
            <Button text="Reset" color="default" onClick={resetForm} data-test="reset" />
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
}
