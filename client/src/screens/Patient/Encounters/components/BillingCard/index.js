import React, { useCallback, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import usePatientContext from "../../../../../hooks/usePatientContext";
import PatientService from "../../../../../services/patient.service";
import { useLocalStore } from "../../../../../utils/helpers";

const BillingCard = (props) => {
  const { isEncounter } = props;
  const [encounterBillings, setEncounterBillings] = useState([]);
  const { state } = isEncounter ? useLocalStore() : usePatientContext();
  const { patientId } = state;
  const { selectedEncounter } = state.encounters;
  const encounterId = selectedEncounter?.id;

  const fetchEncountersBilling = useCallback(() => {
    PatientService.getEncountersBilling(patientId, encounterId)
      .then((response) => {
        setEncounterBillings(response.data);
      });
  }, [patientId, encounterId]);

  useEffect(() => {
    if (selectedEncounter) {
      fetchEncountersBilling();
    }
  }, [fetchEncountersBilling, selectedEncounter]);

  return (
    <>
      {
        encounterBillings.length
          ? encounterBillings.map((Billing) => (
            <Typography gutterBottom>{Billing.title}</Typography>
          ))
          : ""
      }
    </>
  );
};

BillingCard.defaultProps = {
  isEncounter: false,
};

BillingCard.propTypes = {
  isEncounter: PropTypes.bool,
};

export default BillingCard;
