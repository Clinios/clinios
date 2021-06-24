import React, { useCallback, useEffect, useState } from "react";

import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

import usePatientContext from "../../../../../hooks/usePatientContext";
import PatientService from "../../../../../services/patient.service";
import { useLocalStore } from "../../../../../utils/helpers";

const PlanCard = (props) => {
  const { isEncounter } = props;
  const [encounterPlans, setEncounterPlans] = useState([]);
  const { state } = isEncounter ? useLocalStore() : usePatientContext();
  const { patientId } = state;
  const { selectedEncounter } = state.encounters;
  const encounterId = selectedEncounter?.id;

  const fetchEncountersPlan = useCallback(() => {
    PatientService.getEncountersPlan(patientId, encounterId)
      .then((response) => {
        setEncounterPlans(response.data);
      });
  }, [patientId, encounterId]);

  useEffect(() => {
    if (selectedEncounter) {
      fetchEncountersPlan();
    }
  }, [fetchEncountersPlan, selectedEncounter]);

  return (
    <>
      {
        encounterPlans.length
          ? encounterPlans.map((plan) => (
            <Typography key={`${plan.type}_${plan.name}`} gutterBottom>{plan.name}</Typography>
          ))
          : ""
      }
    </>
  );
};

PlanCard.defaultProps = {
  isEncounter: false,
};

PlanCard.propTypes = {
  isEncounter: PropTypes.bool,
};

export default PlanCard;
