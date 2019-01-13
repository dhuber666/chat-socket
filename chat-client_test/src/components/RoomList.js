import React from "react";

// user sees the list and can click on a room.
// gets ask for a username

const RoomList = ({ rooms, choseRoom }) => {
  return (
    <div>
      <h2>Welcome to the chat. Click on a room you wish to enter:</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id} onClick={e => choseRoom(room.name)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
