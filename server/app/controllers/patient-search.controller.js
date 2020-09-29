"use strict";
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const search = async (req, res) => {
  const db = makeDb(configuration, res);
  const {
    firstname,
    lastname,
    phone,
    email,
    id,
    patientStatus,
    createdFrom,
    createdTo,
    appointmentFrom,
    appointmentTo,
    paymentFrom,
    paymentTo,
  } = req.body.data;
  let $sql;

  try {
    $sql = `select distinct p.id, p.firstname, p.middlename, p.lastname, p.city, p.state, p.postal, p.country, p.phone_cell, p.phone_home, p.email, p.gender, p.created
    from patient p \n`;
    if (appointmentFrom || appointmentTo) {
      $sql =
        $sql +
        `join user_calendar uc on uc.client_id=${req.client_id} and uc.patient_id=p.id \n`;
    }
    if (appointmentFrom) {
      $sql = $sql + `  and uc.start_dt >= '${appointmentFrom}' \n`;
    }
    if (appointmentTo) {
      $sql = $sql + `  and uc.start_dt <= '${appointmentTo}' \n`;
    }
    if (paymentFrom || paymentTo) {
      $sql =
        $sql +
        `join tran t on t.client_id=${req.client_id} and t.patient_id=p.id \n`;
    }
    if (paymentFrom) {
      $sql = $sql + `  and t.dt >= ${paymentFrom} \n`;
    }
    if (paymentTo) {
      $sql = $sql + `  and t.dt <= ${paymentTo} \n`;
    }
    $sql = $sql + `where p.client_id=${req.client_id} \n`;
    if (firstname) {
      $sql = $sql + `and p.firstname like '${firstname}%' \n`;
    }
    if (lastname) {
      $sql = $sql + `and p.lastname like '${lastname}%' \n`;
    }
    if (phone) {
      $sql = $sql + `and p.phone_home like '${phone}%' \n`;
    }
    if (email) {
      $sql = $sql + `and p.email like '${email}%' \n`;
    }
    if (id) {
      $sql = $sql + `and p.id = ${id} \n`;
    }
    if (patientStatus) {
      $sql = $sql + `and p.status = ${patientStatus}  \n`;
    }
    if (createdFrom) {
      $sql = $sql + `and p.created >= '${createdFrom}' \n`;
    }
    if (createdTo) {
      $sql = $sql + `and p.created <= '${createdTo}' \n`;
    }
    $sql = $sql + `order by p.firstname \n`;
    $sql = $sql + `limit 20 \n`;

    const dbResponse = await db.query($sql);
    if (!dbResponse) {
      errorMessage.error = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.error = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const PatientSearch = {
  search,
};

module.exports = PatientSearch;
