import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Frame from "./Frame";
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
  storeSelector: {
    position: 'relative',
    top: '500px'
  },
  }));

export default function NewAudit() {
    const classes = useStyles(useTheme);
    return(
      <Frame title="New Audit">
        <div>
            <Container classname={classes.storeSelector}>
              store
            </Container>
        </div>
      </Frame>
    )
}