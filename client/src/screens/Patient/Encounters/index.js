import React, { useState, useEffect } from 'react';
import moment from "moment";
import { TextField, Button, Grid, Typography, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { EncountersFormFields, EncountersCards } from "../../../static/encountersForm";
import Card from "../../../components/common/Card";
import { useSelector, shallowEqual } from "react-redux";

const Form = (props) => {
  const classes = useStyles();
  const { onClose } = props;
  const [formFields, setFormFields] = useState({
    title: '',
    type: '',
    name: '',
    date: '',
  })
  const encounter = useSelector((state) => state.patient.selectedEncounter, shallowEqual);

  useEffect(() => {
    if (!!encounter) {
      updateFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounter])

  const updateFields = () => {
    formFields.title = encounter.title;
    formFields.type = encounter.encounter_type;
    formFields.name = encounter.name;
    formFields.date = moment(encounter.dt).format("YYYY-MM-DD");
    setFormFields({ ...formFields })
  }

  const handleInputChnage = (e) => {
    const { value, name } = e.target;
    setFormFields({
      ...formFields,
      [name]: value
    })
  }

  return (
    <>
      <Typography variant="h3" color="textSecondary">Encounters Form</Typography>
      <Grid container>
        <Grid item md={8}>
          <Grid className={classes.inputRow}>
            {
              EncountersFormFields.map((item, index) => (
                <Grid key={index} container alignItems="center" className={classes.formInput}>
                  <Grid item lg={2}>
                    <label variant="h4" color="textSecondary">{item.label}</label>
                  </Grid>
                  <Grid item md={4}>
                    {
                      item.baseType === "input"
                        ?
                        <TextField
                          variant={"standard"}
                          name={item.name}
                          id={item.id}
                          type={item.type}
                          value={formFields[item.name]}
                          fullWidth
                          onChange={(e) => handleInputChnage(e)}
                        />
                        :
                        <TextField
                          select
                          placeholder={item.label}
                          id={item.id}
                          name={item.name}
                          value={formFields[item.name]}
                          fullWidth
                          onChange={(e) => handleInputChnage(e)}
                        >
                          {
                            item.options.map((option, index) => {
                              return (
                                <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
                              )
                            })
                          }
                        </TextField>
                    }
                  </Grid>
                </Grid>
              ))
            }
            <Grid className={classes.formInput}>
              <Grid item lg={6}>
                <Typography gutterBottom variant="h5" color="textPrimary">Internal Notes (Not Visible to Patients)</Typography>
              </Grid>
              <Grid item md={12}>
                <TextField
                  variant="outlined"
                  name={"notes"}
                  id={"notes"}
                  type={"text"}
                  fullWidth
                  onChange={(e) => handleInputChnage(e)}
                  multiline={true}
                  rows={5}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid className={classes.formInput}>
            <Grid item lg={6}>
              <Typography gutterBottom variant="h5" color="textPrimary">Treatment Plan (Not Visible to Patients)</Typography>
            </Grid>
            <Grid item md={12}>
              <TextField
                variant="outlined"
                name={"notes"}
                id={"notes"}
                type={"text"}
                fullWidth
                onChange={(e) => handleInputChnage(e)}
                multiline={true}
                rows={5}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} className={classes.cardsContainer}>
          {
            EncountersCards.map((item, index) => (
              <Card
                key={index}
                title={item.title}
                showActions={item.showActions}
                showSearch={item.showSearch}
                icon={item.icon}
                primaryButtonText={item.primaryButtonText}
                secondaryButtonText={item.secondaryButtonText}
                iconHandler={() => console.log(item.title)}
              />
            ))
          }

          <Grid className={classes.formInput} container justify="space-between">
            <Button variant="outlined" onClick={() => onClose()}>Save</Button>
            <Button variant="outlined" onClick={() => onClose()}>Exit</Button>
          </Grid>
          <Typography gutterBottom>Created {moment().format("MMM, DD, YYYY")}</Typography>
          <Typography gutterBottom>Created By {!!encounter && encounter.name}</Typography>
        </Grid>
      </Grid>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    margin: theme.spacing(3, 0),
  },
  formInput: {
    margin: theme.spacing(2, 0)
  },
  cardsContainer: {
    padding: theme.spacing(0, 2)
  }
})
)


export default Form;
