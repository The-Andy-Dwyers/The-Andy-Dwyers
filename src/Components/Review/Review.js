import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import Print from 'rc-print';

import './Review.css';
import { getDashboard } from '../../ducks/reducers/incomeReducer';
import { getExpenses } from '../../ducks/reducers/expensesReducer';
class Review extends Component {
  state = {
    income: ''
  };
  componentDidMount() {
    this.props.getDashboard(
      moment()
        .startOf('year')
        .format('l'),
      moment().format('l')
    );
    this.props.getExpenses(
      moment()
        .startOf('year')
        .format('l'),
      moment().format('l')
    );
    this.getMonthlyIncome();
  }

  getMonthlyIncome = () => {
    axios
      .get('/api/income-monthly')

      .then(res => {
        this.setState({ income: res.data });
      });
  };

  render() {
    const { expensesbymonth, expense } = this.props.expensesReducer;
    const { income } = this.state;

    const incomeMap =
      income &&
      income.map((e, i) => {
        return (
          <div className="ex_income_map" key={i}>
            <p>{e.month}</p>
            <p>${e.sum}</p>
          </div>
        );
      });

    const incomeReduce =
      income && income.reduce((sum, e) => (sum += +e.sum), 0);

    const monthMap =
      expensesbymonth.length &&
      expensesbymonth.map((e, i) => {
        return (
          <div key={i} className="ex_map">
            <p>{e.month}</p>
            <p>${e.sum}</p>
          </div>
        );
      });
    const expenseReduce =
      expensesbymonth.length &&
      expensesbymonth.reduce((sum, e) => (sum += +e.sum), 0);

    return (
      <div className="review_main">
        <div className="settings_header review_header">
          <h1>Financial Review</h1>
        </div>
        <Print ref="test">
          <div className="financial_spreadsheet">
            <h1>Monthly Income</h1>
            <div className="spreadsheet_top" />
            <div className="spreadsheet_main">
              {incomeMap}
              <div className='review_total'>${incomeReduce}</div>
            </div>
            <h1>Monthly Expenses</h1>
            <div className="spreadsheet_sub">
              {monthMap}
              <div className='review_total'>${expenseReduce}</div>
            </div>
          </div>
        </Print>
        <div className="print_btn_holder">
          <h3
            className="print_btn btn"
            onClick={() => {
              this.refs.test.onPrint();
            }}
          >
            Print
          </h3>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { getDashboard, getExpenses }
)(Review);
