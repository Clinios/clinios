const moment = require("moment");
const { configuration, makeDb } = require("../../db/db.js");
const {
  errorMessage,
  successMessage,
  status,
} = require("../../helpers/status");

const getPatient = async (req, res) => {
  const db = makeDb(configuration, res);
  let { patient_id } = req.query;

  if (typeof patient_id === "undefined") {
    // eslint-disable-next-line prefer-destructuring
    patient_id = req.user_id;
  }
  let $sql;
  try {
    $sql = `select p.status, p.id, p.firstname, p.middlename, p.lastname, p.gender, p.phone_home, p.phone_cell, p.phone_work, p.phone_other, p.phone_note, p.ssn
    , p.address, p.address2, p.city, p.postal, p.state, p.country, p.insurance_name, p.insurance_group, p.insurance_member, p.insurance_phone, p.insurance_desc, p.email
    from patient p
    where p.id=${patient_id}`;

    const dbResponse = await db.query($sql);

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.info("err:", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const updatePatient = async (req, res) => {
  const {
    status: profileStatus,
    firstname,
    middlename,
    lastname,
    preferred_name,
    email,
    gender,
    dob,
    ssn,
    referred_by,
    phone_home,
    phone_cell,
    phone_work,
    phone_other,
    phone_note,
    admin_note,
    medical_note,
    address,
    address2,
    city,
    postal,
    state,
    emergency_firstname,
    emergency_middlename,
    emergency_lastname,
    emergency_relationship,
    emergency_email,
    emergency_phone,
    insurance_name,
    insurance_group,
    insurance_member,
    insurance_phone,
    insurance_desc,
    height,
    waist,
    weight,
  } = req.body.data;

  const db = makeDb(configuration, res);
  let { client_id } = req.query;

  if (typeof client_id === "undefined") {
    // eslint-disable-next-line prefer-destructuring
    client_id = req.client_id;
  }
  try {
    let $sql;
    if (typeof email !== "undefined") {
      const doesEmailExists = await db.query(
        `select 1 from patient where client_id=${client_id} and id<>1 and email='${email}' limit 1`
      );
      if (doesEmailExists.length > 0) {
        errorMessage.message = "The new email address is already in use.";
        res.status(status.error).send(errorMessage);
      }
    }
    $sql = `update patient set firstname='${firstname}', lastname='${lastname}', email='${email}' `;

    if (typeof profileStatus !== "undefined") {
      $sql += `, status=${profileStatus ? `"${profileStatus}"` : "default"}`;
    }
    if (typeof middlename !== "undefined") {
      $sql += `, middlename='${middlename}'`;
    }
    if (typeof preferred_name !== "undefined") {
      $sql += `, preferred_name='${preferred_name}'`;
    }
    if (typeof gender !== "undefined") {
      $sql += `, gender='${gender}'`;
    }
    if (typeof dob !== "undefined") {
      $sql += `, dob='${moment(dob).format("YYYY-MM-DD")}'`;
    }
    if (typeof ssn !== "undefined") {
      $sql += `, ssn='${ssn}'`;
    }
    if (typeof referred_by !== "undefined") {
      $sql += `, referred_by='${referred_by}'`;
    }
    if (typeof phone_home !== "undefined") {
      $sql += `, phone_home='${phone_home}'`;
    }
    if (typeof phone_cell !== "undefined") {
      $sql += `, phone_cell='${phone_cell}'`;
    }
    if (typeof phone_work !== "undefined") {
      $sql += `, phone_work='${phone_work}'`;
    }
    if (typeof phone_other !== "undefined") {
      $sql += `, phone_other='${phone_other}'`;
    }
    if (typeof phone_note !== "undefined") {
      $sql += `, phone_note='${phone_note}'`;
    }
    if (typeof admin_note !== "undefined") {
      $sql += `, admin_note='${admin_note}'`;
    }
    if (typeof medical_note !== "undefined") {
      $sql += `, medical_note='${medical_note}'`;
    }
    if (typeof address !== "undefined") {
      $sql += `, address='${address}'`;
    }
    if (typeof address2 !== "undefined") {
      $sql += `, address2='${address2}'`;
    }
    if (typeof city !== "undefined") {
      $sql += `, city='${city}'`;
    }
    if (typeof postal !== "undefined") {
      $sql += `, postal='${postal}'`;
    }
    if (typeof state !== "undefined") {
      $sql += `, state='${state}'`;
    }
    if (typeof emergency_firstname !== "undefined") {
      $sql += `, emergency_firstname='${emergency_firstname}'`;
    }
    if (typeof emergency_middlename !== "undefined") {
      $sql += `, emergency_middlename='${emergency_middlename}'`;
    }
    if (typeof emergency_lastname !== "undefined") {
      $sql += `, emergency_lastname='${emergency_lastname}'`;
    }
    if (typeof emergency_relationship !== "undefined") {
      $sql += `, emergency_relationship='${emergency_relationship}'`;
    }
    if (typeof emergency_email !== "undefined") {
      $sql += `, emergency_email='${emergency_email}'`;
    }
    if (typeof emergency_phone !== "undefined") {
      $sql += `, emergency_phone='${emergency_phone}'`;
    }
    if (typeof insurance_name !== "undefined") {
      $sql += `, insurance_name='${insurance_name}'`;
    }
    if (typeof insurance_group !== "undefined") {
      $sql += `, insurance_group='${insurance_group}'`;
    }
    if (typeof insurance_member !== "undefined") {
      $sql += `, insurance_member='${insurance_member}'`;
    }
    if (typeof insurance_phone !== "undefined") {
      $sql += `, insurance_phone='${insurance_phone}'`;
    }
    if (typeof insurance_desc !== "undefined") {
      $sql += `, insurance_desc='${insurance_desc}'`;
    }
    if (typeof height !== "undefined") {
      $sql += `, height='${height}'`;
    }
    if (typeof waist !== "undefined") {
      $sql += `, waist='${waist}'`;
    }
    if (typeof weight !== "undefined") {
      $sql += `, weight='${weight}'`;
    }
    $sql += `, updated='${moment().format(
      "YYYY-MM-DD HH:mm:ss"
    )}', updated_user_id=${req.user_id} where id=${req.user_id}`;

    const updateResponse = await db.query($sql);
    if (!updateResponse.affectedRows) {
      errorMessage.message = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }

    const patientData = req.body.data;
    if (typeof dob !== "undefined") {
      patientData.dob = moment(patientData.dob).format("YYYY-MM-DD");
    }
    patientData.created = new Date();
    patientData.created_user_id = req.user_id;

    // Log into patient_history
    await db.query("insert into patient_history set ?", patientData);

    successMessage.data = updateResponse;
    successMessage.message = "Update successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Update not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getPatientPaymentMethod = async (req, res) => {
  const db = makeDb(configuration, res);
  let { patient_id } = req.query;

  if (typeof patient_id === "undefined") {
    patient_id = req.user_id;
  }
  let $sql;

  try {
    $sql = `select id, type, account_number, exp, created from payment_method where patient_id=${patient_id} order by 1`;

    const dbResponse = await db.query($sql);
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.info("err:", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const Profile = {
  getPatient,
  updatePatient,
  getPatientPaymentMethod,
};

module.exports = Profile;
