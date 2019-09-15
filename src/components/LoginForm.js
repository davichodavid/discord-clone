import React, { Component } from 'react';
import VERIFY_USER from '../Events';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      error: ''
    };
  }

  setUser = ({ user, isUser }) => {
    console.log(user);
    if (isUser) {
      this.setError('Username taken');
    } else {
      this.props.setUser(user);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { socket } = this.props;
    const { nickname } = this.state;
    socket.emit(VERIFY_USER, nickname, this.setUser);
  };

  handleChange = event => {
    this.setState({ nickname: event.target.value });
  };

  setError = error => {
    this.setState({ error });
  };

  render() {
    const { nickname, error } = this.state;
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
            placeholder={'Enter Your Username'}
          />
          <div className='error'>{error ? error : null}</div>
        </form>
      </div>
    );
  }
}
