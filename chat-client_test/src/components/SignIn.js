import React, { Fragment } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:3000/chat");

class SignIn extends React.Component {
  state = {
    name: "",
    message: "",
    chats: [],
    success: null,
    error: null
  };

  componentDidMount() {
    socket.on("newUser", msg => {
      this.setState({ chats: [...this.state.chats, msg] });
    });

    socket.on("success", msg => {
      this.setState({ success: msg });
    });

    socket.on("message", msg => {
      console.log("message received");
      this.setState({ chats: [...this.state.chats, msg] });
    });

    socket.on("err", msg => this.setState({ error: msg }));
  }

  handleSubmit = e => {
    e.preventDefault();

    socket.emit("joinRoom", this.props.room, this.state.name);
  };

  renderForm = () => {
    return (
      <Fragment>
        <h4>With which user name you want to enter:</h4>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="your username"
            value={this.state.name}
            onChange={e => this.setState({ name: e.target.value })}
          />
          <button type="submit">Enter</button>
        </form>
      </Fragment>
    );
  };

  sendMessage = e => {
    e.preventDefault();
    const { message, name } = this.state;
    socket.emit("message", message, this.props.room, name);
    this.setState({ message: "" });
  };

  renderChat = () => {
    axios.get("http://localhost:3000/rooms").then(({ data }) =>
      data.forEach(room => {
        if (room.name === this.props.room) {
          const tempChats = room.chats.map(chat => chat.message);
          this.setState({ chats: tempChats });
        }
      })
    );
    const { chats } = this.state;
    // TODO: Add the user's name to every chat
    const messages = chats.map((chat, id) => <p key={id}>{chat}</p>);
    return (
      <Fragment>
        <h4>Messages:</h4>
        {messages}
        <form>
          <input
            type="text"
            placeholder="Say hello"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <input
            type="submit"
            value="Send message"
            onClick={this.sendMessage}
          />
        </form>
      </Fragment>
    );
  };

  render() {
    const { success, error } = this.state;
    return (
      <div>
        {!success && !error && this.renderForm()}
        {success && !error && this.renderChat()}
        {error && (
          <div>
            <p>{error}</p>
            <button onClick={e => this.setState({ error: null })}>
              Go back
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SignIn;
