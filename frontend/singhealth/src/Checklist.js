import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import { useHistory, useRouteMatch } from "react-router-dom";
import Button from "@material-ui/core/Button";
import ChecklistCard from "./ChecklistCard";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const non_fnb_audit = {
  "Professionalism and Staff Hygiene": {
    issues: [
      "Shop is open and ready to service patients/visitors according to operating hours.",
      "Staff Attendance: adequate staff for peak and non-peak hours.",
      "At least one (1) clearly assigned person in-charge on site.",
      "Staff uniform/attire is not soiled.",
      "Staff who are unfit for work due to illness should not report to work.",
      "Staff who are fit for work but suffering from the lingering effects of a cough and/or cold should cover their mouths with a surgical mask.",
    ],
    weightage: 20,
  },
  "Housekeeping and General Cleanliness": {
    issues: [
      "Adequate and regular pest control.",
      "Goods and equipment are within shop boundary.",
      "Store display/ Shop front is neat and tidy.",
      "Work/ serving area is neat, clean and free of spillage.",
      "Uncluttered circulation space free of refuse/ furniture.",
      "Fixtures and fittings including shelves, cupboards and drawers are clean and dry and in a good state.",
      "Ceiling/ ceiling boards are free from stains/ dust with no gaps.",
      "Fans and air-con units are in proper working order and clean and free from dust, Proper maintenance and routine cleaning are carried out regularly.",
      "Equipment is clean, in good condition and serviced.",
      "Surfaces, walls and ceilings within customer areas are dry and clean.",
      "Floor within customer areas is clean and dry.",
      "Waste is properly managed and disposed.",
    ],
    weightage: 40,
  },
  "Workplace Safety and Health": {
    issues: [
      "MSDS for all industrial chemicals are available and up to date.",
      "Proper chemicals storage.",
      "All detergent and bottles containing liquids are labelled appropriately.",
      "All personnel to wear safety shoes and safety attire where necessary.",
      "Knives and sharp objects are kept at a safe place.",
      "Area under the sink should not be cluttered with items other than washing agents.",
      "Delivery personnel do not stack goods above the shoulder level.",
      "Stacking of goods does not exceed 600mm from the ceiling and heavy items at the bottom, light items on top.",
      "Proper signage/ label (fire, hazards, warnings, food stuff) and Exit signs in working order.",
      "Fire extinguishers access is unobstructed; Fire extinguishers are not expired and employees know how to use them.",
      "Escape route and exits are unobstructed.",
      "First aid box is available and well-equipped.",
      "Electrical sockets are not overloaded – one plug to one socket.",
      "Plugs and cords are intact and free from exposure/ tension with PSB safety mark.",
      "Power points that are in close proximity to flammable and/or water sources are installed with a plastic cover.",
      "Electrical panels / DBs are covered.",
    ],
    weightage: 40,
  },
};

//to fill when done figuring out checklist
const renderChecklist = (type) => {
  non_fnb_audit.map((x) => {});
};

export default function Checklist(props) {
  const { setValues, data } = useData();
  const history = useHistory();
  const classes = useStyles(useTheme);
  const { register, handleSubmit, setValue, errors } = useForm();
  const { type } = props;
  const { path, url } = useRouteMatch();

  const onSubmit = (data) => {
    console.log(data);

    //score computation, move to its own component/function
    var score = 0;
    for (const [category, issues] of Object.entries(data)) {
      var count = 0;
      // console.log(category)
      for (const [issue, details] of Object.entries(issues)) {
        if (details.ok == "true") count += 1;
      }
      // console.log(score)
      const weightage = non_fnb_audit[`${category}`].weightage;
      // console.log(weightage)
      const length = Object.keys(issues).length;
      // console.log(length)
      const catScore = (weightage * count) / length;
      // console.log(catScore)
      
      data[`${category}`].catScore = catScore

      score += catScore;
    }

    console.log("here's the total score!!");
    console.log(score);

    var output = {};
    output.audit = data;
    output.score = score;

    console.log(output);

    
    setValues(output);
    history.push("/newaudit/result");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {
        //ideally non_fnb_audit should be interchangeable with other audit types
        Object.keys(non_fnb_audit).map((x) => {
          return (
            <React.Fragment key={x}>
              <Grid
                container
                spacing={1}
                width="100%"
                alignItems="center"
                justify="center"
              >
                <h2>{/* category name: */ x}</h2>
                {non_fnb_audit[x].issues.map((issue) => {
                  return (
                    <React.Fragment key={issue}>
                      <Grid item xs={10}>
                        <ChecklistCard
                          desc={issue}
                          name={`${x}.${issue}`}
                          register={register}
                          setValue={setValue}
                        />
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </React.Fragment>
          );
        })
      }
      <Button variant="contained" type="submit" color="primary">
        Submit
      </Button>
    </form>
  );
}
