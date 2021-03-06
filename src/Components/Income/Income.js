import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import DatePicker from 'react-custom-date-picker';

import './Income.css';
import {
  updateAmount,
  updateDate,
  updateTitle,
  getDashboard,
  reset
} from '../../ducks/reducers/incomeReducer';
import { getUser } from '../../ducks/reducers/userReducer';
import { getExpenses } from '../../ducks/reducers/expensesReducer';

class Income extends Component {
  state = {
    edit: false,
    incomeTotal: 0,
    month: true
  };

  componentDidMount() {
    this.props.getUser();
  }

  handleDateChange = date => {
    this.props.updateDate(date);
  };

  handleDelete = id => {
    axios.delete(`/api/delete-income/${id}`).then(() => {
      this.props.getDashboard(this.props.start, this.props.end);
      this.setState({ edit: false });
    });
  };

  handleEdit = id => {
    let { amount, title, date } = this.props.incomeReducer;
    var find = this.props.incomeReducer.dashboard.sources.find(
      e => e.id === id
    );
    axios
      .put(`/api/edit-income/${id}`, {
        title: title ? title : find.title,
        amount: amount ? amount : find.amount,
        date: date ? date : find.date
      })
      .then(() => {
        this.setState({ edit: false });
        this.props.getDashboard(
          moment()
            .startOf('month')
            .format('l'),
          moment()
            .endOf('month')
            .format('l')
        );
        this.props.reset();
      });
  };

  render() {
    const { updateAmount, updateTitle } = this.props;
    const { users } = this.props.userReducer;
    const find =
      users.length && users.find(e => e.id === this.props.userReducer.id);

    const map = this.props.incomeReducer.dashboard.sources.map(e => {
      return !this.state.edit ? (
        <div key={e.id} className="income_map">
          <p>{e.title}</p>
          <p className="im_amount">
            <mark>${e.amount.toLocaleString()}</mark>
          </p>
          <p>{moment.utc(e.date).format('ddd, MMM D')}</p>
        </div>
      ) : (
        <div key={e.id} className="income_map">
          <ContentEditable
            className="income_content"
            html={e.title}
            onChange={e => updateTitle(e.target.value)}
          />
          <ContentEditable
            className="income_content"
            html={String(e.amount)}
            onChange={e => updateAmount(e.target.value)}
          />
          <div className="income_map_bottom">
            <DatePicker
              className="income_content"
              date={moment.utc(e.date).format('MM/DD/YYYY')}
              placeholder={moment.utc(e.date).format('MM/DD/YYYY')}
              handleDateChange={this.handleDateChange}
            />
            <div
              className="income_btn_holder"
              onClick={id => this.handleEdit(e.id)}
            >
              <div className="checkbox_container">
                <div className="check_main c_left" />
                <div className="check_main c_right" />
              </div>
              <div
                className="x_container btn"
                onClick={id => this.handleDelete(e.id)}
              >
                <div className="x_div x1" />
                <div className="x_div x2" />
              </div>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="income_container">
        <div className="income">
          <div className="income_display">
            <div>
              <h2>
                {find && find.name}
                's Income
              </h2>
            </div>

            {map}

            <div className="income_edit_holder">
              {!this.state.edit &&
                this.props.incomeReducer.dashboard.sources.length !== 0 && (
                  <div>
                    <div className="fake_line" />
                    <img
                      onClick={() => this.setState({ edit: true })}
                      className="edit_icon btn"
                      src="https://image.flaticon.com/icons/svg/149/149307.svg"
                      alt="Edit btn"
                    />
                  </div>
                )}
            </div>
          </div>
          <div className="income_total">
            {this.props.month ? (
              <p>
                Total:
                <mark>
                  $
                  {this.props.incomeReducer.dashboard.incomesum.toLocaleString()}
                </mark>
              </p>
            ) : (
              <p>
                {' '}
                Total:
                <mark>
                  $
                  {this.props.incomeReducer.dashboard.incomesum.toLocaleString()}
                </mark>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  {
    getUser,
    updateAmount,
    updateDate,
    updateTitle,
    getExpenses,
    getDashboard,
    reset
  }
)(Income);
