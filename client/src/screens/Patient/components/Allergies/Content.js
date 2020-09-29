import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

export default function AllergiesContent(props) {
  const classes = useStyles();

  const { data } = props;

  const [, setElement] = useState(null);
  const [, setSelectedItem] = useState(null);

  const menuHandler = (e, item) => {
    setElement(e.currentTarget);
    setSelectedItem(item);
  };

  // const onItemDelete = () => {
  //   const drugId = selectedItem.drug_id;
  //   const patientId = "1";
  //   PatientService.deleteAllergy(patientId, drugId)
  //     .then((response) => {
  //       dispatch(setSuccess(`${response.data.message}`));
  //       reloadData();
  //     })
  //     .catch((error) => {
  //       const resMessage =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //       let severity = "error";
  //       dispatch(
  //         setError({
  //           severity: severity,
  //           message: resMessage,
  //         })
  //       );
  //     });
  // };

  return (
    <>
      {data.map((item) => (
        <Grid
          key={item.drug_id}
          className={classes.inputRow}
          onContextMenu={(e) => menuHandler(e, item)}
        >
          <Grid component="span">{item.name}</Grid>
        </Grid>
      ))}
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  inputRow: {
    marginBottom: theme.spacing(1),
  },
}));
