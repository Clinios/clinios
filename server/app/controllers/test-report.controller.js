const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getFunctionalRange = async (req, res) => {
  const db = makeDb(configuration, res);
  let $sql;

  try {
    $sql = `select functional_range
    from client
    where id=${req.client_id}`;

    const dbResponse = await db.query($sql);

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

const getPageTitle = async (req, res) => {
  const { cptId } = req.params;

  const db = makeDb(configuration, res);
  try {
    const $sql = `select name
    from cpt 
    where id = ${cptId}`;

    const dbResponse = await db.query($sql);

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

const getLabcptByLabId = async (req, res) => {
  const { patientId, labId } = req.params;

  const db = makeDb(configuration, res);
  try {
    const $sql = `select cpt_id
   from lab_cpt
   where patient_id=${req.patient_id || patientId}
   and lab_id=${labId}
   order by line_nbr
   limit 200`;

    const dbResponse = await db.query($sql);

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

const getLabcpt = async (req, res) => {
  const { patientId } = req.params;

  const db = makeDb(configuration, res);
  try {
    const $sql = `select c.id, c.name from (
    select distinct lc.cpt_id
    from lab_cpt lc
    where lc.patient_id=${req.patient_id || patientId}
    ) lc
    left join cpt c on c.id=lc.cpt_id
    order by c.name
    limit 200`;

    const dbResponse = await db.query($sql);

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

const getTestGraph = async (req, res) => {
  const { patientId, labId } = req.params;

  const db = makeDb(configuration, res);
  try {
    const $sql = `select lc.lab_id, lc.lab_dt, lc.cpt_id, lc.value, lc.range_low, lc.range_high, lc.unit, /*c.name,*/ l.filename, lc.client_id
    from lab_cpt lc
    /*left join cpt c on c.id=lc.cpt_id*/
    left join lab l on l.id=lc.lab_id
    where lc.patient_id=${req.patient_id || patientId}
    and lc.cpt_id=${labId}
    order by lc.lab_dt, lc.lab_id
    limit 200`;

    const dbResponse = await db.query($sql);

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

const testReport = {
  getFunctionalRange,
  getPageTitle,
  getLabcptByLabId,
  getLabcpt,
  getTestGraph,
};

module.exports = testReport;
