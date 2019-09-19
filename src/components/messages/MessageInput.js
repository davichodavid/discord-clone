import React, { Component } from 'react'

export default class MessageInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      isTyping: false,
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.sendMessage();
    this.setState({ message: '' })
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message)
  }

  componentWillUnmount() {
    this.stopCheckingTyping();
  }

  sendTyping = () => {
    this.lastUpdateTime = Date.now();
    if (!this.state.isTyping) {
      this.setState({ isTyping: true });
      this.props.sendTyping(true);
      this.startCheckingTyping();
    }
  }

  startCheckingTyping = () => {
    console.log('typing');

    this.typingInterval = setInterval(() => {
      if ((Date.now() - this.lastUpdateTime) > 300) {
        this.setState({ isTyping: false })
        this.stopCheckingTyping()
      }
    }, 300);
  }

  stopCheckingTyping = () => {
    console.log('stopped typing');

    if (this.typingInterval) {
      clearInterval(this.typingInterval)
      this.props.sendTyping(false);
    }
  }

  render() {
    const { message } = this.state;
    return (
      <div>
        <div className="message-input">
          <form onSubmit={this.handleSubmit} className='message-form'>
            <input
              type="text"
              ref={'messageinput'}
              id='message'
              className='form-control'
              value={message}
              autoComplete={'off'}
              placeholder='Type your message here'
              onKeyUp={event => event.keyCode !== 13 && this.sendTyping()}
              onChange={({ target }) => this.setState({ message: target.value })} />
            <button className="send" type="submit" disabled={message.length < 1}>
              Send
            </button>
          </form>
        </div>
      </div>
    )
  }
}
