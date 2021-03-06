import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import ContentEditable from 'react-contenteditable';
import swal from 'sweetalert2';

import './Setup.css';
import { getGoals } from '../../ducks/reducers/expensesReducer';
import { getUsers, getUser } from '../../ducks/reducers/userReducer';
import Modal from '../Modal/Modal';

class Setup extends Component {
  state = {
    name: '',
    email: '',
    savings: ''
  };

  componentDidMount() {
    this.props.getUsers();
    this.props.getGoals();
  }

  editUser = () => {
    const { users } = this.props.userReducer;
    const find =
      users.length && users.find(e => e.id === this.props.userReducer.id);
    const { name, email } = this.state;

    axios
      .put('/api/edit-user', {
        name: name ? name : find.name,
        email: email ? email : find.email
      })
      .then(() => {
        swal({
          position: 'top-end',
          title: 'Info edited',
          background: 'rgb(204,204,204)',
          showConfirmButton: false,
          timer: 1500
        });
        this.setState({ name: '', email: '', savings: '' });
      });
  };

  editGoal = () => {
    const { savings } = this.state;
    const { id } = this.props.expensesReducer.goals[0];

    axios.put('/api/edit-goal', {
      id,
      savings
    });
  };

  render() {
    const { users, id, name, email } = this.props.userReducer;
    const find = users.length && users.find(e => e.id === id);

    return (
      <div className="setup">
        <div className="setup_container">
          <h1>Thank you for using BudgetUs</h1>
          {name || email ? (
            <div className="setup_sub_cont">
              <h2>Click to edit info</h2>
              <div>
                <p>Name:</p>
                <ContentEditable
                  className="profile_content"
                  html={find && find.name}
                  onChange={e => this.setState({ name: e.target.value })}
                  onBlur={() => this.editUser()}
                />
              </div>
              <div>
                <p>Email:</p>
                <ContentEditable
                  className="profile_content"
                  html={find && find.email}
                  onChange={e => this.setState({ email: e.target.value })}
                  onBlur={() => this.editUser()}
                />
              </div>
            </div>
          ) : (
            <div className="setup_sub_cont">
              <h2>Let's get started!</h2>
              <input
                type="text"
                value={this.state.name}
                placeholder="Tell us your name"
                onChange={e => this.setState({ name: e.target.value })}
              />
              <input
                type="text"
                value={this.state.email}
                placeholder="What is your email"
                onChange={e => this.setState({ email: e.target.value })}
              />
              <h3 className="setup_btn btn" onClick={() => this.editUser()}>
                Submit
              </h3>
            </div>
          )}
        </div>

        <div className="setup_container modal">
          <Modal type="goals" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { getGoals, getUsers, getUser }
)(Setup);
