import React, { Component } from "react";
import RoomList from "./components/RoomList";
import io from "socket.io-client";
import "./App.css";
import axios from "axios";
import SignIn from "./components/SignIn";

const socket = io("http://localhost:3000");

socket.on("chat", message => console.log(message));

class App extends Component {
  state = {
    rooms: [],
    chosenRoom: null
  };

  renderContent = () => {
    const { rooms, chosenRoom } = this.state;

    if (chosenRoom) {
      return <SignIn room={this.state.chosenRoom} />;
    }
    return <RoomList rooms={rooms} choseRoom={this.choseRoom} />;
  };

  choseRoom = room => {
    this.setState({ chosenRoom: room });
  };

  componentDidMount() {
    axios
      .get("http://localhost:3000/rooms")
      .then(({ data }) => this.setState({ rooms: data }));
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default App;
