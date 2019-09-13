import React, { Component } from 'react';

export default class LoginForm extends Component {
  render(props) {
    return (
      <div className='login'>
        <form onSubmit={this.handleSubmit} className='login-form'>
          <label htmlFor='nickname'>
            <h2>Got a nickname?</h2>
          </label>
          <input
            type='text'
            ref={input => (this.input = input)}
            id='nickname'
            value={nickname}
            onChange={this.handleChange}
            placeholder={'MyCoolUsername'}
          />
        </form>
      </div>
    );
  }
}
