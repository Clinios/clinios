import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Checkbox, RadioGroup, Radio, FormControl, FormControlLabel, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BillSelectionFields, LabortoriesSelectionFields, FavoritesSelectionFields } from "../../../static/requisitionform"

const Requisitions = (props) => {
  const classes = useStyles();
  const { onClose } = props;
  const [searchText, setSearchText] = useState('');
  const [billSelection, setBillSelection] = useState('physician');
  const [setLabsSelection] = useState('');

  const handleSearchInputChnage = (e) => {
    const { value } = e.target;
    setSearchText(value);
  }

  const handleBillSelection = (e) => {
    setBillSelection(e.target.value);
  }

  const handleLabortoriesSelection = (e) => {
    setLabsSelection(e.target.checked);
  }

  return (
    <>
      <Grid className={classes.heading} container justify="space-between">
        <Typography variant="h3" color="textSecondary">Select Lab Test</Typography>
      </Grid>
      <Grid container spacing={1}>
        <Grid item lg={3}>
          <FormControl component="fieldset" className={classes.section}>
            <FormLabel component="legend">Bill To</FormLabel>
            <RadioGroup row value={billSelection} onChange={handleBillSelection} name="position" defaultValue="top">
              {BillSelectionFields.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.value}
                  label={item.label}
                  control={<Radio color="primary" />}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Grid className={classes.section}>
            <Typography gutterBottom variant="h4" color="textSecondary">Recommended</Typography>
            {
              [...Array(3)].map((item, index) => (
                <Grid container alignItems="center" direction="row" key={index}>
                  <Typography variant="body1">Chronic Fatigue (Un-specified)&nbsp;&nbsp;</Typography>
                  <Button>[Remove]</Button>
                </Grid>
              ))
            }
          </Grid>
          <Grid item lg={9} className={classes.border}>
            <Typography gutterBottom variant="h5" color="textPrimary">Labortories</Typography>
            {
              LabortoriesSelectionFields.map((item, index) => (
                <Grid key={index}>
                  <FormControlLabel
                    value={item.vlaue}
                    label={item.label}
                    control={<Checkbox color="primary" />}
                    onChange={handleLabortoriesSelection}
                  />
                </Grid>
              ))
            }
          </Grid>
        </Grid>
        <Grid item lg={3}>
          <Grid item lg={8} className={classes.heading}>
            <TextField
              label=""
              placeholder="Search..."
              name="search"
              fullWidth
              variant="outlined"
              value={searchText}
              onChange={(e) => handleSearchInputChnage(e)}
              size="small"
            />
          </Grid>
          <Typography gutterBottom variant="h4" color="textSecondary">Recommended</Typography>
          {
            [...Array(5)].map((item, index) => (
              <Grid key={index}>
                <Typography gutterBottom variant="body1">Exythromycine 25mcg Tablets</Typography>
              </Grid>
            ))
          }
        </Grid>
        <Grid item lg={6}>
          <Grid className={`${classes.border} ${classes.height100}`}>
            <Typography gutterBottom variant="h5" color="textPrimary">Favorites</Typography>
            <Grid container spacing={1}>
            <Grid item lg={4}>
            {
              FavoritesSelectionFields.map((item, index) => (
                <Grid key={index}>
                  <FormControlLabel
                    value={item.vlaue}
                    label={item.label}
                    control={<Checkbox color="primary" />}
                  />
                </Grid>
              ))
            }
            </Grid>
            <Grid item lg={4}>
            {
              FavoritesSelectionFields.map((item, index) => (
                <Grid key={index}>
                  <FormControlLabel
                    value={item.vlaue}
                    label={item.label}
                    control={<Checkbox color="primary" />}
                  />
                </Grid>
              ))
            }
            </Grid>
            <Grid item lg={4}>
            {
              FavoritesSelectionFields.map((item, index) => (
                <Grid key={index}>
                  <FormControlLabel
                    value={item.vlaue}
                    label={item.label}
                    control={<Checkbox color="primary" />}
                  />
                </Grid>
              ))
            }
            </Grid>
          </Grid>
        </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.actionContainer} container justify="space-between">
        <Grid>
          <Button variant="outlined" className={classes.mr2} onClick={() => onClose()}>Complete</Button>
          <Button variant="outlined" onClick={() => onClose()}>Complete and Fax</Button>
        </Grid>
        <Button variant="outlined" onClick={() => onClose()}>Cancel</Button>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  section: {
    marginBottom: theme.spacing(2)
  },
  heading: {
    marginBottom: theme.spacing(2)
  },
  border: {
    border: '1px solid grey',
    padding: 10,
  },
  height100: {
    height: '100%'
  },
  actionContainer: {
    marginTop: theme.spacing(2)
  },
  mr2: {
    marginRight: theme.spacing(2)
  },
})
)


export default Requisitions;

