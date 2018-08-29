require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const massive = require("massive");
const session = require("express-session");
const passport = require("passport");
const axios = require("axios");

const port = process.env.PORT || 3001;

const strategy = require("./strategy");

const { login, logout, getUser, getUsers } = require("./Ctrl/userCtrl");
const {
  getExpenses,
  addExpenses,
  getExpensesByCategory,
  deleteExpense,
  editExpense
} = require("./Ctrl/expensesCtrl");
const {
  getIncome,
  addIncome,
  deleteIncome,
  editIncome,
  incomeSum,
  getYearlyIncome,
  incomeYearlySum,
  getIncomeById
} = require("./Ctrl/incomeCtrl");

const app = express();
app.use(bodyParser.json());

app.use(express.static(`${__dirname}/../build`));

massive(process.env.CONNECTION_STRING)
  .then(db => {
    app.set("db", db);
  })
  .catch(err => {
    console.log(err);
  });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 2
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser((user, done) => {
  const db = app.get("db");

  db.users
    .get_user_by_id(user.id)
    .then(response => {
      if (!response[0]) {
        db.users
          .add_user([user.displayName, user.id])
          .then(res => done(null, res[0]))
          .catch(err => done(err, null));
      } else {
        return done(null, response[0]);
      }
    })
    .catch(err => done(err, null));
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

//user endpoints
app.get("/login", login);
app.get("/logout", logout);
app.get("/api/me", getUser);
app.get("/api/users", getUsers);

//expenses endpoints
app.get("/api/expenses", getExpenses);
app.get("/api/expenses_by_cat", getExpensesByCategory);
app.post("/api/add-expenses", addExpenses);
app.delete("/api/delete-expense/:id", deleteExpense);
app.put("/api/edit-expense/:id", editExpense);

//income endpoints
app.get("/api/income", getIncome);
app.post("/api/setup-income", addIncome);
app.delete("/api/delete-income/:id", deleteIncome);
app.put("/api/edit-income/:id", editIncome);
app.get("/api/income-sum", incomeSum);
app.get("/api/yearly-income", getYearlyIncome);
app.get("/api/yearly-income-sum", incomeYearlySum);
app.get("/api/income/:id", getIncomeById);

// run build
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
