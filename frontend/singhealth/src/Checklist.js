import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { useData } from "./DataContext";
import { useHistory, useRouteMatch } from "react-router-dom";
import Button from "@material-ui/core/Button";
import ChecklistCard from "./ChecklistCard";
import { non_fnb_audit, fnb_audit, safe_management_audit } from './ChecklistData';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function Checklist(props) {
  const { setValues, data } = useData();
  const history = useHistory();
  const classes = useStyles(useTheme);
  const { register, handleSubmit, setValue, errors } = useForm();
  const { path, url } = useRouteMatch();
  const [auditChecklist, setAuditChecklist] = useState(non_fnb_audit);

  useEffect(() => {
    console.log(data);
    console.log(data.type);
    switch (data.type){
      case 0:
        setAuditChecklist(non_fnb_audit);
        break;
      case 1:
        setAuditChecklist(fnb_audit);
        break;
      case 2:
        setAuditChecklist(safe_management_audit);
        break;
    }
  }, [data])

  const onSubmit = (data) => {
    console.log("initial");
    console.log(data);

    //score computation, move to its own component/function?
    var score = 0;
    for (const [category, issues] of Object.entries(data)) {
      var count = 0;
      for (const [issue, details] of Object.entries(issues)) {
        console.log(issue, details);
        if (details.ok == "true") count += 1;
      }

      // console.log("count")
      // console.log(count)

      // console.log("computing scores")
      const weightage = auditChecklist[`${category}`].weightage;
      // console.log(weightage)
      const length = Object.keys(issues).length;
      // console.log(length)
      const catScore = (weightage * count) / length;
      // console.log(catScore)


      let flaggedIssues = Object.fromEntries(Object.entries(issues).filter((issue) => issue[1].ok === "false"))
      data[`${category}`] = {};
      data[`${category}`].issues = flaggedIssues;
      data[`${category}`].count = count;
      data[`${category}`].catScore = catScore;

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
        Object.keys(auditChecklist).map((x) => {
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
                {auditChecklist[x].issues.map((issue) => {
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
