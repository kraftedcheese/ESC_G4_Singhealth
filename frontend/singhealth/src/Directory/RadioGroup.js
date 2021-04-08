import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

export default function RadioGroup(props) {
  const { name, label, onChange, items, error } = props;
  var value = props.value;
  
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <MuiRadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio color="primary" />}
            label={item.title}
            name={item.title}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
