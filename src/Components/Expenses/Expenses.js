import React, { Component } from "react";
import { getUsers } from "../../ducks/reducers/userReducer";
import { connect } from "react-redux";

import Chart from "../Chart/Chart";
import "./Expenses.css";
import ExpensesInfo from "./ExpensesInfo";
class Expenses extends Component {
  componentDidMount() {
    this.props.getUsers();
  }
  render() {
    return (
      <div className="Expenses">
        <ExpensesInfo />
        <Chart type="expenses" />
      </div>
    );
  }
}
const mapStateToProps = state => state;
export default connect(
  mapStateToProps,
  { getUsers }
)(Expenses);
