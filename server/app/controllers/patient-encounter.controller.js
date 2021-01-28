const moment = require("moment");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getEncounters = async (req, res) => {
  const db = makeDb(configuration, res);
  const { patient_id } = req.params;

  try {
    const dbResponse = await db.query(
      `select e.dt, e.id, e.title, et.name encounter_type, concat(u.firstname, ' ', u.lastname) name, notes, treatment
      from encounter e 
      left join encounter_type et on et.id=e.type_id
      left join user u on u.id=e.user_id
      where e.patient_id=${patient_id}
      order by e.dt desc
      limit 50`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getEncountersPrescriptions = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select d.name, concat(ds.strength, ds.unit) strength, case when ds.form='T' then 'Tablets' end form, pd.created, case when df.drug_id then true end favorite
      from patient_drug pd
      join drug d on d.id=pd.drug_id
      left join client_drug df on df.client_id=${req.client_id}
          and df.drug_id=d.id
      join drug_strength ds on ds.drug_id=d.id and ds.id=pd.drug_strength_id
      where pd.user_id=${req.user_id}
      order by pd.created desc
      limit 20`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getEncountersPrescriptionsFrequencies = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select id, descr
      from drug_frequency
      order by id
      limit 100`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const encountersPrescriptionsEdit = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select d.name, concat(ds.strength, ds.unit) strength, case when ds.form='T' then 'Tablets' end form
      , df.descr, pd.start_dt, pd.expires, pd.amount, pd.refills
      , pd.generic, pd.patient_instructions, pd.pharmacy_instructions
      from patient_drug pd
      left join drug d on d.id=pd.drug_id
      left join drug_strength ds on ds.drug_id=d.id 
        and ds.id=pd.drug_strength_id left join drug_frequency df on df.id=pd.drug_frequency_id
      where pd.encounter_id=1
      and pd.drug_id=1
      and pd.drug_strength_id=1`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const encountersRecentProfiles = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select d.name, concat(ds.strength, ds.unit) strength, case when ds.form='T' then 'Tablets' end form, df.descr, pd.expires, pd.amount, pd.refills, pd.generic, pd.patient_instructions, pd.pharmacy_instructions, pd.created last_used_dt, pd.count from (
        select drug_id, drug_strength_id, drug_frequency_id, expires, amount, refills, generic, patient_instructions, pharmacy_instructions, max(created) created, count(*) count
        from patient_drug pd
        where pd.client_id=1
        and pd.drug_id=1
        and pd.encounter_id<>1
        and pd.created > date_sub(now(), interval 90 day)
        group by drug_id, drug_strength_id, drug_frequency_id, expires, amount, refills, generic, patient_instructions, pharmacy_instructions
        ) pd
        left join drug d on d.id=pd.drug_id
        left join drug_strength ds on ds.drug_id=d.id 
            and ds.id=pd.drug_strength_id
        left join drug_frequency df on df.id=pd.drug_frequency_id
        order by count desc
        limit 10`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const createEncounter = async (req, res) => {
  const { patient_id } = req.params;
  const { title } = req.body.data;
  let { dt, type_id, notes, treatment, read_dt, lab_bill_to } = req.body.data;

  if (typeof dt !== "undefined") {
    dt = `'${moment(dt).format("YYYY-MM-DD HH:mm:ss")}'`;
  } else {
    dt = null;
  }
  if (typeof type_id !== "undefined") {
    type_id = `'${type_id}'`;
  } else {
    type_id = null;
  }
  if (typeof notes !== "undefined") {
    notes = `'${notes}'`;
  } else {
    notes = null;
  }
  if (typeof treatment !== "undefined") {
    treatment = `'${treatment}'`;
  } else {
    treatment = null;
  }
  if (typeof read_dt !== "undefined") {
    read_dt = `'${moment(read_dt).format("YYYY-MM-DD HH:mm:ss")}'`;
  } else {
    read_dt = null;
  }
  if (typeof lab_bill_to !== "undefined") {
    lab_bill_to = `'${lab_bill_to}'`;
  } else {
    lab_bill_to = null;
  }

  const db = makeDb(configuration, res);
  try {
    const insertResponse = await db.query(
      `insert into encounter (client_id, user_id, patient_id, dt, type_id, title, notes, treatment, read_dt, lab_bill_to, created, created_user_id) 
      values (${req.client_id}, ${req.user_id}, ${patient_id}, ${dt}, ${type_id}, '${title}', ${notes}, ${treatment}, ${read_dt}, ${lab_bill_to}, now(), ${req.user_id})`
    );

    if (!insertResponse.affectedRows) {
      errorMessage.message = "Insert not successful";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = insertResponse;
    successMessage.message = "Insert successful";
    return res.status(status.created).send(successMessage);
  } catch (excepErr) {
    errorMessage.message = "Insert not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const updateEncounter = async (req, res) => {
  const { patient_id, id } = req.params;
  const {
    dt,
    type_id,
    title,
    notes,
    treatment,
    read_dt,
    lab_bill_to,
  } = req.body.data;

  const db = makeDb(configuration, res);
  try {
    let $sql;

    $sql = `update encounter set title='${title}', notes='${notes}', treatment='${treatment}' `;

    if (typeof dt !== "undefined") {
      $sql += `, dt='${moment(dt).format("YYYY-MM-DD HH:mm:ss")}'`;
    }
    if (typeof type_id !== "undefined") {
      $sql += `, type_id='${type_id}'`;
    }
    if (typeof read_dt !== "undefined") {
      $sql += `, read_dt='${moment(read_dt).format("YYYY-MM-DD HH:mm:ss")}'`;
    }

    if (typeof lab_bill_to !== "undefined") {
      $sql += `, lab_bill_to=${lab_bill_to}`;
    }

    $sql += `, updated='${moment().format("YYYY-MM-DD HH:mm:ss")}',
    updated_user_id=${req.user_id}
    where patient_id=${patient_id} and id=${id}`;

    const updateResponse = await db.query($sql);
    if (!updateResponse.affectedRows) {
      errorMessage.error = "Update not successful";
      return res.status(status.notfound).send(errorMessage);
    }

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

const deleteEncounter = async (req, res) => {
  const { id } = req.params;

  const db = makeDb(configuration, res);
  try {
    // Call DB query without assigning into a variable
    const deleteResponse = await db.query(`
      delete from encounter where id=${id}
    `);

    if (!deleteResponse.affectedRows) {
      errorMessage.error = "Deletion not successful";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = deleteResponse;
    successMessage.message = "Delete successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Delete not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getEncounterTypes = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select et.id, et.name
      from encounter_type et
      where (et.client_id is null or et.client_id=1)
      order by et.sort_order
      limit 100`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getRecentDiagnoses = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select i.name, concat('(', pi.icd_id, ' ICD-10)') id
      from patient_icd pi
      join icd i on i.id=pi.icd_id
      where pi.encounter_id<>2
      and pi.user_id=${req.client_id}
      order by pi.created desc
      limit 20`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const searchDrug = async (req, res) => {
  const { text } = req.body.data;

  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(
      `select d.name, concat(ds.strength, ds.unit) strength
      , case when ds.form='T' then 'Tablets' end form
      , cd.favorite
      from drug d
      left join client_drug cd on cd.client_id=${req.client_id}
      and cd.drug_id=d.id
      left join drug_strength ds on ds.drug_id=d.id
      where d.name like '${text}%'
      order by d.name, ds.strength
      limit 50`
    );

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Search not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const createEncounter_ICD = async (req, res) => {
  const { patient_id } = req.params;
  const { icd_id } = req.body.data;
  const db = makeDb(configuration, res);
  try {
    const insertResponse = await db.query(
      `insert into patient_icd (patient_id, icd_id, active, client_id, user_id, encounter_id, created, created_user_id)
       values (${patient_id}, '${icd_id}', true, ${req.client_id}, ${req.user_id}, 1, now(), ${req.user_id})`
    );

    if (!insertResponse.affectedRows) {
      errorMessage.message = "Insert not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = insertResponse;
    successMessage.message = "Insert successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Insert not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const getEncounterPlan = async (req, res) => {
  const db = makeDb(configuration, res);

  try {
    const dbResponse = await db.query(
      `select type, name, strength, unit from (
        select 1 sort, 'Rx' type, d.name, ds.strength, ds.unit
        from patient_drug pd
        left join drug d on d.id=pd.drug_id
        left join drug_strength ds on ds.id=pd.drug_strength_id
        where pd.encounter_id=1
        union
        select 2 sort, 'Lab' type, c.name, null, null
        from patient_cpt pc
        join cpt c on c.id=pc.cpt_id
        where pc.encounter_id=1
      ) d
      order by sort
      limit 50`
    );
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }

    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const patientEncounter = {
  getEncounters,
  getEncountersPrescriptions,
  getEncountersPrescriptionsFrequencies,
  encountersPrescriptionsEdit,
  encountersRecentProfiles,
  createEncounter,
  updateEncounter,
  deleteEncounter,
  getEncounterTypes,
  getRecentDiagnoses,
  searchDrug,
  createEncounter_ICD,
  getEncounterPlan,
};

module.exports = patientEncounter;
