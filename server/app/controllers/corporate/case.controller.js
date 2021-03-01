const { configuration, makeDb } = require("../../db/db.js");
const {
  errorMessage,
  successMessage,
  status,
} = require("../../helpers/status");

const getCase = async (req, res) => {

  const {supportStatus} = req.query;
  const db = makeDb(configuration, res);

  try {
    let $sql;
    $sql = `select s.id, c.name, s.subject, cs.name, s.created, concat(u.firstname, ' ', u.lastname) created_user, s.updated
      from support s
      left join client c on c.id=s.client_id
      left join case_status cs on cs.id=s.status_id
      left join user u on u.id=s.created_user_id
      where s.client_id=${req.client_id}`;
    if(supportStatus){
      $sql +=` and s.status_id = '${supportStatus}'`
    }
    $sql +=` order by s.created desc limit 100`;

    const rows = await db.query($sql);

    const dbResponse = rows;

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.error('Error:', err)
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const Cases = {
  getCase,
};

module.exports = Cases;
