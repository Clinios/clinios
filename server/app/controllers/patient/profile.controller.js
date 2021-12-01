const moment = require("moment");
const bcrypt = require("bcryptjs");
const db = require("../../db");
const {
  errorMessage,
  successMessage,
  status,
} = require("../../helpers/status");

const getPatient = async (req, res) => {
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
    where p.id=$1`;

    const dbResponse = await db.query($sql, [patient_id]);

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse.rows;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.info("err:", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const updatePatient = async (req, res) => {

  const { firstname, middlename, lastname, email, gender, dob, preferred_name, referred_by, phone_home, phone_cell, phone_work,
    phone_note, admin_note, medical_note, address, address2, city, postal, state, height, waist, weight,
    insurance_name, insurance_group, insurance_member, insurance_phone, insurance_desc } = req.body.data;
  const formData = req.body.data;
  formData.created = new Date();
  formData.created_user_id = req.user_id;

  if (formData.password && formData.password !== "") {
    formData.password = bcrypt.hashSync(formData.password, 8);
  } else {
    delete formData.password;
  }


  try {

    const updateResponse = await db.query(
      `update patient set firstname=$1, middlename=$2, lastname=$3, email=$4, gender=$5, dob=$6, preferred_name=$7,
      referred_by=$8, phone_home=$9, phone_cell=$10, phone_work=$11, phone_note=$12, admin_note=$13, medical_note=$14, address=$15,
      address2=$16, city=$17, postal=$18, state=$19, height=$20, waist=$21, weight=$22, insurance_name=$23, insurance_group=$24, insurance_member=$25,
      insurance_phone=$26, insurance_desc=$27, updated=now(), updated_user_id=${req.user_id}
      where id=${req.user_id} RETURNING id`,
      [firstname, middlename, lastname, email, gender, dob, preferred_name, referred_by, phone_home, phone_cell, phone_work, phone_note,
        admin_note, medical_note, address, address2, city, postal, state, height, waist, weight, insurance_name, insurance_group, insurance_member, insurance_phone, insurance_desc]
    );
    if (!updateResponse.rowCount) {
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
    await db.query(`insert into patient_history(id, firstname, middlename, lastname, email, gender, dob, preferred_name, referred_by, phone_home, phone_cell, phone_work,
      phone_note, admin_note, medical_note, address, address2, city, postal, state, height, waist, weight, insurance_name,
      insurance_group, insurance_member, insurance_phone, insurance_desc, created, created_user_id) 
      VALUES(${req.user_id}, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, $26, $27, now(), ${req.user_id})`,
       [firstname, middlename, lastname, email, gender, dob, preferred_name, referred_by, phone_home, phone_cell, phone_work, phone_note,
        admin_note, medical_note, address, address2, city, postal, state, height, waist, weight, insurance_name,
        insurance_group, insurance_member, insurance_phone, insurance_desc]);

    successMessage.data = updateResponse.rows;
    successMessage.message = "Update successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Update not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const getPatientPaymentMethod = async (req, res) => {
  let { patient_id } = req.query;

  if (typeof patient_id === "undefined") {
    patient_id = req.user_id;
  }
  let $sql;

  try {
    $sql = `select id, type, account_number, exp, created 
    from payment_method 
    where patient_id=$1 
    and (status is null or status <> 'D')
    order by 1
    `;

    const dbResponse = await db.query($sql, [patient_id]);
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse.rows;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.info("err:", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const Profile = {
  getPatient,
  updatePatient,
  getPatientPaymentMethod,
};

module.exports = Profile;
