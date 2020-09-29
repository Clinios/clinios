import {
  SET_SELECTED_ENCOUNTER,
  RESET_SELECTED_ENCOUNTER
} from "./types";


export const setEncounter = (encounter) => {
  return {
    type: SET_SELECTED_ENCOUNTER,
    payload: encounter,
  };
};

export const resetEncounter = () => {
  return {
    type: RESET_SELECTED_ENCOUNTER
  };
};
