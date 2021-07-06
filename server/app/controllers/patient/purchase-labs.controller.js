const Stripe = require("stripe");
const db = require("../../db");
const {
  errorMessage,
  successMessage,
  status,
} = require("../../helpers/status");

const getPurchaseLabs = async (req, res) => {
  try {
    const $sql = `select pc.id patient_procedure_id, c.id procedure_id, c.name procedure_name, c.price, pc.created, lc.name lab_company_name
    from patient_proc pc
    left join tranc t on t.id = pc.tranc_id
    left join proc c on c.id=pc.proc_id
    left join lab_company lc on lc.id=c.lab_company_id
    where pc.patient_id=${req.user_id}
    and pc.tranc_id is null
    order by c.name
    limit 100
    `;

    const dbResponse = await db.query($sql);

    if (!dbResponse.rows) {
      errorMessage.message = "None found";
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse.rows;
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log(err)
    errorMessage.message = "Select not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const createPurchaseLabs = async (req, res) => {
  const formData = req.body.data;
  const trancData = {
    client_id: req.client_id,
    patient_id: req.user_id,
    type_id: 1,
    dt: new Date(),
    created: new Date(),
    amount: formData.amount * -1,
    payment_method_id: formData.payment_method_id,
  };

  try {
    const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

    // if customer_id is null then create a customer
    if (!formData.customer_id) {
      const getPatientDetails = await db.query(
        `select id, email, firstname, lastname, gender from patient where id=${req.user_id}`
      );
      const existingPatient = getPatientDetails[0];

      const customer = await stripe.customers.create({
        email: existingPatient.email,
        name: existingPatient.firstname + existingPatient.lastname,
      });
      formData.customer_id = customer.id;
      // When patient initially signs up, a stripe customer id is created instantly for the doctor.
      // When patient buys a lab, only then is a stripe corp customer id created for AvonEHR, David May 2021.
      await db.query(
        `update patient set corp_stripe_customer_id='${customer.id}' where id=${req.user_id}`
      );
      console.log("customer:", customer);
    }
    // Attach payment method to a customer for client(Doctor) account
    await stripe.paymentMethods.attach(
      formData.corp_stripe_payment_method_token,
      {
        customer: formData.customer_id,
      }
    );

    const intentData = {
      payment_method: formData.corp_stripe_payment_method_token,
      customer: formData.customer_id,
      description: `${JSON.stringify(formData.patient_procedure_ids)}; patient_id: ${req.user_id
        }`,
      amount: Number(formData.amount) * 100, // it accepts cents
      currency: "usd",
      confirmation_method: "manual",
      confirm: true,
    };

    const intent = await stripe.paymentIntents.create(intentData);

    if (intent.status === "succeeded") {
      trancData.pp_status = 1;
      trancData.pp_return = JSON.stringify(intent);
    } else {
      console.log("error:", intent);
      trancData.pp_status = -1;
      trancData.pp_return = JSON.stringify(intent);
    }

    const insertResponse = await db.query(`insert into tranc set $1 RETURNING id`, [
      trancData,
    ]);

    if (!insertResponse.rowCount) {
      errorMessage.message = "Insert not successful";
      return res.status(status.notfound).send(errorMessage);
    }
    if (insertResponse.rows[0].id) {
      const trancDetailsData = {
        tranc_id: insertResponse.insertId,
        // procedure_id: formData.procedure_ids,
      };
      if (formData.selectedLabs.length > 0) {
        formData.selectedLabs.map(async (lab) => {
          trancDetailsData.proc_id = lab.procedure_id;
          trancDetailsData.patient_proc_id = lab.patient_procedure_id;
          await db.query(`insert into tranc_detail set $1`, [trancDetailsData]);
        });
      }

      await db.query(`update patient_proc set tranc_id=${insertResponse.insertId} 
      where id in (${formData.patient_procedure_ids})`);
    }
    successMessage.data = insertResponse;
    successMessage.message = "Insert successful";
    return res.status(status.created).send(successMessage);
  } catch (err) {
    console.log("err", err);
    errorMessage.message = "Insert not successful";
    return res.status(status.error).send(errorMessage);
  }
};

const PurchaseLabs = {
  getPurchaseLabs,
  createPurchaseLabs,
};

module.exports = PurchaseLabs;
