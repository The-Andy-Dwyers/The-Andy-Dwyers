import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import DatePicker from 'react-custom-date-picker';
import moment from 'moment';
import axios from 'axios';

import './Navbar.css';
import { getUsers } from '../../ducks/reducers/userReducer';
import {
  updateAmount,
  updateDate,
  updateTitle,
  getDashboard
} from '../../ducks/reducers/incomeReducer';
import { getGoals } from '../../ducks/reducers/expensesReducer';
import menu from './icons/menu.svg';
import home from './icons/home.svg';
import calendar from './icons/calendar.svg';
import settings from './icons/settings.svg';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: 'Lato, sans-serif'
  }
};

Modal.setAppElement(document.getElementById('root'));

class Navbar extends Component {
  state = {
    modalIsOpen: false,
    modal1IsOpen: false,
    month: true,
    savings: ''
  };

  componentDidMount() {
    // this.props.getUsers().then(() => {
    //   !this.props.userReducer.auth_id && window.location.assign('/');
    // });
    this.props.getGoals();
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  openModal1 = () => {
    this.setState({ modal1IsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false, modal1IsOpen: false });
  };

  handleDateChange = date => {
    this.props.updateDate(date);
  };

  submitIncome = e => {
    let { amount, title, date } = this.props.incomeReducer;
    let { id } = this.props.userReducer;

    axios
      .post('/api/setup-income', {
        amount,
        title,
        date,
        id
      })
      .then(() => {
        this.props.getDashboard(this.state.month ? 'month' : 'year');
        this.closeModal();
      });
  };

  addGoal = () => {
    axios
      .post('/api/add-goal', {
        savings: this.state.savings
      })
      .then(() => {
        this.props.getGoals();
      });
  };

  render() {
    const { updateAmount, updateTitle } = this.props;

    const day = moment().format('MM/DD/YYYY');

    const dashboardDate =
      this.props.incomeReducer.dashboard.length &&
      this.props.incomeReducer.dashboard.sources.date;

    return (
      <div className="navbar">
        <div className="ham_container">
          <img className="hamburger" src={menu} alt="Hamburger menu" />
        </div>
        <div className="navbar_logo_container">
          <img
            className="navbar_logo"
            src="https://image.flaticon.com/icons/svg/134/134597.svg"
            alt="Logo"
          />
        </div>
        <div className="navbar_sub">
          <Link className="link" to="/dashboard">
            <img className="navbar_icon btn" src={home} alt="Home icon" />
          </Link>
          <Link className="link" to="/calendar">
            <img
              className="navbar_icon btn"
              src={calendar}
              alt="Calendar icon"
            />
          </Link>
          <Link className="link" to="/settings">
            <img
              className="navbar_icon btn"
              src={settings}
              alt="Settings icon"
            />
          </Link>
          <a className="link" href={process.env.REACT_APP_LOGOUT}>
            <h1 className="link">Logout</h1>
          </a>

          <h1 className="income_input_btn btn" onClick={this.openModal}>
            Add Income
          </h1>
          <h3 className="income_input_btn btn" onClick={this.openModal1}>
            Monthly Goal
          </h3>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
          >
            <div className="income_modal">
              <h2>Let's add your Income!</h2>
              <br />
              <div className="income_sub">
                <p>Source:</p>
                <input
                  autoFocus
                  onChange={e => updateTitle(e.target.value)}
                  type="text"
                />
              </div>
              <div className="income_sub">
                <p>Amount:</p>
                <input
                  onChange={e => updateAmount(e.target.value)}
                  type="text"
                  placeholder="$"
                />
              </div>
              <div className="income_sub">
                <p>Payday:</p>
                <DatePicker
                  date={dashboardDate}
                  placeholder={day}
                  handleDateChange={this.handleDateChange}
                />
              </div>
              <h3
                className="income_btn btn"
                onClick={e => this.submitIncome(e)}
              >
                Submit
              </h3>
            </div>
          </Modal>

          <Modal
            isOpen={this.state.modal1IsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
          >
            <h1>Savings Goal!</h1>
            <h3>What is your monthly Goal?</h3>
            <input
              type="text"
              onChange={e => this.setState({ savings: e.target.value })}
            />
            <h3 onClick={() => this.addGoal()}>Submit</h3>
          </Modal>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  {
    getUsers,
    getGoals,
    updateAmount,
    updateDate,
    updateTitle,
    getDashboard
  }
)(Navbar);
