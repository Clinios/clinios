"use strict";
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const get = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select ul.dt, concat(p.firstname, ' ', p.lastname) patient, ul.action
      from user_log ul
      left join patient p on p.id=ul.patient_id
      where ul.user_id=${req.params.userId}
      order by ul.dt desc
      limit 20
      `
    );

    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const myActivityHistory = {
  get,
};

module.exports = myActivityHistory;
