import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ChatList = ({ openChat }) => {
  const chats = [
    {
      id: 1,
      name: "Alice",
      lastMessage: "See you tomorrow!",
      timestamp: "10:45 AM",
      profileImage: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      name: "Bob",
      lastMessage: "Thanks for the update.",
      timestamp: "Yesterday",
      profileImage: "https://via.placeholder.com/40",
    },
    {
      id: 3,
      name: "Charlie",
      lastMessage: "Got it!",
      timestamp: "Monday",
      profileImage: "https://via.placeholder.com/40",
    },
  ];

  return (
    <ul className="space-y-3">
      {chats.map((chat) => (
        <button
          onClick={() => openChat(chat.name)}
          key={chat.id}
          className="flex w-full items-center space-x-4 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
        >
          {/* Profile Image */}
          <img
            src="https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
            alt={`${chat.name}'s profile`}
            className="w-10 h-10 rounded-full"
          />

          {/* Chat Details */}
          <div className="flex-grow">
            <div className="flex justify-between">
              <h3 className="font-bold text-white">{chat.name}</h3>
              <span className="text-sm text-gray-400">{chat.timestamp}</span>
            </div>
            <p className="text-sm text-gray-300 truncate">{chat.lastMessage}</p>
          </div>
        </button>
      ))}
    </ul>
  );
};

export default ChatList;
