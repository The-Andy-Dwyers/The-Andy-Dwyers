var moment = require("moment");
const month = moment()
  .startOf("month")
  .format("l");
// const end = moment()
//   .endOf("month")
//   .format("l");
const year = moment()
  .startOf("year")
  .format("l");
const yearend = moment()
  .endOf("month")
  .format("l");

const getDashboard = (req, res) => {
  const db = req.app.get("db");
  const { start, end } = req.query;
  db.income
    .get_income([req.user.id, start, end])
    .then(sources =>
      db.income.get_income_sum([req.user.id, start, end]).then(incomesum =>
        db.expenses
          .get_expense_sum([req.user.id, start, end])
          .then(expensesum =>
            db
              .get_all_months([req.user.id, year, moment().format("l")])
              .then(months => {
                res.status(200).send({
                  months,
                  sources,
                  incomesum: +incomesum[0]["sum"],
                  expensesum: +expensesum[0]["sum"]
                });
              })
          )
      )
    )
    // .then(response => {
    //   res.status(200).send(response);
    // })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

const getIncomeById = (req, res) => {
  const db = req.app.get("db");

  db.income
    .get_income_by_id([req.params.id])
    .then(response => {
      const modifiedResponse = response.map(e => {
        return { ...e, date: JSON.stringify(e.date).substring(1, 11) };
      });
      res.status(200).send(modifiedResponse);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

const addIncome = (req, res) => {
  const db = req.app.get("db");
  const { amount, title, date, id } = req.body;

  db.income
    .add_income([amount, title, date, req.user.id])
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

const deleteIncome = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;

  db.income
    .delete_income([req.user.id, id])
    .then(response => res.status(200).send(response))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

const editIncome = (req, res) => {
  const db = req.app.get("db");
  const { title, amount, date } = req.body;

  db.income
    .edit_income([req.params.id, title, amount, date])
    .then(response => res.status(200).send(response))
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

const getIncomeMonthly = (req, res) => {
  const db = req.app.get("db");
  db.income
    .get_income_by_month(req.user.id, year, yearend)
    .then(totals => {
      res.status(200).send(totals);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
};

module.exports = {
  getDashboard,
  addIncome,
  deleteIncome,
  editIncome,
  getIncomeById,
  getIncomeMonthly
};
