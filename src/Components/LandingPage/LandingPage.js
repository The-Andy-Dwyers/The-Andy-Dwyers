import React, { Component } from 'react';
import $ from 'jquery';

import './LandingPage.css';
import coins from './coins.svg';

export default class LandingPage extends Component {
  componentDidMount() {
    $(window).scroll(function() {
      var scrollh = $(this).scrollTop();

      if (scrollh < 60 || scrollh === 0) {
        $('.landing_header').css({
          display: 'none'
        });
        $('.login_btn').css({
          'background-color': '#fff',
          color: '#fff',
          'z-index': '9999'
        });
        $('.landing_logo2').css({
          display: 'none'
        });
        $('.landing_logo').css({
          display: 'block'
        });
      } else {
        $('.landing_header').css({
          display: 'block',
          'background-color': '#fff',
          'z-index': '9'
        });
        $('.login_btn').css({
          'background-color': '#f6f6f6',
          'z-index': '9999'
        });
        $('.landing_logo2').css({
          display: 'block',
          'z-index': '99999'
        });
        $('.landing_logo').css({
          display: 'none'
        });
      }
    });
  }
  render() {
    return (
      <div className="landing">
        <div className="landing_header">
          <img
            className="landing_logo2"
            src="https://image.flaticon.com/icons/svg/134/134597.svg"
            alt="Coinslogo"
          />
        </div>
        <div className="landing_content">
          <div>Budget</div>
          <div>
            <span>Us</span>
          </div>
        </div>
        <a className="login_btn" href={process.env.REACT_APP_LOGIN}>
          <h1 className="login_link">Login</h1>
        </a>
        <img className="landing_logo" src={coins} alt="Logo" />

        <div className="landing_sub">
          <div>
            <h2>Create Budget</h2>
            <p>
              Easily plan a budget to fit your needs, and keep track of your
              income and expenses.
            </p>
            <img
              src="https://image.flaticon.com/icons/svg/214/214285.svg"
              alt="Graph icon"
            />
          </div>
          <div>
            <h2>Manage Bills</h2>
            <p>Successfully maintain all your finances in one location. </p>
            <img
              src="https://image.flaticon.com/icons/svg/438/438051.svg"
              alt="Paying bills"
            />
          </div>
          <div>
            <h2>Track Savings</h2>
            <p>
              Keep track of the amount of income you save. Every little cent
              counts!
            </p>
            <img
              src="https://image.flaticon.com/icons/svg/858/858699.svg"
              alt="Savings tracker"
            />
          </div>
        </div>
        <div className="landing_sub1">
          <div>
            <div>
              <h3 className='landing_title title1'>Add Bills on the go</h3>
              <p>Check your progress at your own convenience.</p>
            </div>
            <img
              className="iphone_img"
              src="https://www.mint.com/sites/default/files/styles/mint_half_width/public/billsmodule%402x_1.png?itok=Z7UZtlau&timestamp=1535430201"
              alt="Iphone"
            />
          </div>
        </div>
        <div className="landing_sub2">
          <img
            className="ipad_image"
            src="http://icon-park.com/imagefiles/ipad_air_2_silver.png"
            alt=""
          />
          <div>
            <h3 className='landing_title title2'>Set monthly goals</h3>
            <p>Dynamically compare your monthly spending with your goals</p>
          </div>
        </div>
        <div className="landing_sub3" />
        <div className="landing_sub4">
          <div className="landing_sub22">
            <h2>Sign up for BudgetUs now!</h2>
            <p>
              Sign up today to take control of your finances, once and for all.{' '}
              <br />
            </p>
            <div>
              <a
                className="login_signup btn"
                href={process.env.REACT_APP_LOGIN}
              >
                <h1 className="login_link">Sign up</h1>
              </a>
              <a
                className="login_btn_bottom btn"
                href={process.env.REACT_APP_LOGIN}
              >
                <h1 className="login_link">Login</h1>
              </a>
            </div>
            <p className="footer_text">
              This is a ficticious project made by a team of student developers
              at Dev Mountain Dallas.
            </p>
          </div>
        </div>
        <div className="landing_footer">
          <h3>© 2018 Andy Dwyer Productions</h3>
        </div>
      </div>
    );
  }
}
