import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Modal from 'react-modal';

import './Goals.css';
import { getDashboard } from '../../ducks/reducers/incomeReducer';
import {getGoals} from '../../ducks/reducers/expensesReducer';

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

class Goals extends Component {
  state = {
    modalIsOpen: false,
    savings: '',
    goal: ''
  };

  componentDidMount() {
    this.props.getGoals()
  }

  // getGoal = () => {
  //   axios.get('/api/goal').then(res => {
  //     res.data.length &&
  //     this.setState({ goal: res.data[0].savings });
  //   });
  // };

  addGoal = () => {
    axios.post('/api/add-goal', {
      savings: this.state.savings
    });
  };

  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    const { expensesum, incomesum } = this.props.incomeReducer.dashboard;
    const {goals} = this.props.expensesReducer;

    const remaining = incomesum - expensesum;
    const remainder = remaining - (goals.length && goals[0].savings);

console.log(goals)
    console.log(remainder)
    return (
      <div className="goals">
        <h3 className="income_input_btn btn" onClick={this.openModal}>
          Monthly Goal
        </h3>

        {remainder && remainder > 0 ? (
          <p>
            You've saved a total of ${remaining.toLocaleString()} this month.{' '}
            <br />
            You are ${remainder.toLocaleString()} above from your goal of $
            {goals.length && goals[0].savings.toLocaleString()}!
          </p>
        ) : (
          <p>
            You are ${Math.abs(remainder).toLocaleString()} under your savings
            goal for this month.
            <br />
            Watch your spending!
          </p>
        )}
        <Modal
          isOpen={this.state.modalIsOpen}
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
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { getDashboard, getGoals }
)(Goals);
