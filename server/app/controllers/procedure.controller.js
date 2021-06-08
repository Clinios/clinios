const { validationResult } = require("express-validator");
const { configuration, makeDb } = require("../db/db.js");
const { errorMessage, successMessage, status } = require("../helpers/status");

const getLabCompnayList = async (req, res) => {
  const db = makeDb(configuration, res);
  try {
    const dbResponse = await db.query(`select id, name from lab_company order by name limit 100`);

    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const search = async (req, res) => {
  const db = makeDb(configuration, res);
  const {
    procedureId,
    procedureDescription,
    labCompanyId,
    favorite,
    billable,
    self,
    group,
  } = req.body;
  let $sql;
  try {
    $sql = `select c.id, c.name procedure, lc.name lab_company, cc.favorite, cc.billable, cc.fee, cl.name client_name
        , cc.updated, concat(u.firstname, ' ', u.lastname) updated_name
        , group_concat(ci.quest_id order by ci.quest_id separator ", ") procedure_group
        from procedure c
        left join client_proc cc on cc.client_id=${req.client_id}
        and cc.proc_id=c.id
        left join lab_company lc on lc.id=c.lab_company_id
        left join user u on u.id=cc.updated_user_id
        left join proc_item ci on ci.proc_id=c.id
        left join client cl on cl.id=c.client_id
        where 1 \n`;
    if (procedureId) {
      $sql += `and c.id like '%${procedureId}%' \n`;
    }
    if (procedureDescription) {
      $sql += `and c.name like '%${procedureDescription}%' \n`;
    }
    if (labCompanyId) {
      $sql += `and c.lab_company_id=${labCompanyId} \n`;
    }
    if (favorite) {
      $sql += `and cc.favorite = true \n`;
    }
    if (billable) {
      $sql += `and cc.billable = true \n`;
    }
    if (self) {
      $sql += `and c.client_id=${req.client_id} \n`;
    }
    if (group) {
      $sql += `and ci.quest_id is not null \n`;
    }

    $sql += `group by c.id, lc.name, c.name, cc.favorite, cc.billable, cc.fee, cl.name
        , cc.updated, concat(u.firstname, ' ', u.lastname) \n`;
    $sql += `order by c.name \n`;
    $sql += `limit 50 \n`;

    const dbResponse = await db.query($sql);
    if (!dbResponse) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.message = "Select not not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const updateClientProcedure = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errorMessage.message = errors.array();
    return res.status(status.error).send(errorMessage);
  }
  const db = makeDb(configuration, res);
  const { procedureId, favorite, billable, fee, notes } = req.body;
  let $sql;
  try {
    $sql = `insert into client_proc (client_id, user_id, proc_id, favorite, billable, fee, notes, created, created_user_id, updated, updated_user_id )
        values (${req.client_id}, ${req.user_id
      }, '${procedureId}', ${favorite}, ${billable}, ${fee > 0 ? fee : 0
      } /*TODO if fee is "" then set fee to null*/, '${notes}', now(), ${req.user_id
      }, now(), ${req.user_id} ) 
         on duplicate key update 
            favorite=${favorite},
            billable=${billable},
            fee=${fee > 0 ? fee : 0
      },  /*TODO if fee is "" then set fee to null*/
            notes='${notes}',
            created=now(),
            created_user_id=${req.user_id},
            updated=now(),
            updated_user_id=${req.user_id}`;

    const updateResponse = await db.query($sql);

    if (!updateResponse.affectedRows) {
      errorMessage.message = "Update not not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = updateResponse;
    successMessage.message = "Update successful";
    return res.status(status.success).send(successMessage);
  } catch (error) {
    console.log(error);
    errorMessage.message = "Update not successful";
    return res.status(status.error).send(errorMessage);
  } finally {
    await db.close();
  }
};

const Procedurecodes = {
  getLabCompnayList,
  search,
  updateClientProcedure,
};
module.exports = Procedurecodes;
