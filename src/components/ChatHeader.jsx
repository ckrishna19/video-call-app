import React from "react";
import { FaPhoneAlt, FaVideo, FaTimes } from "react-icons/fa";

const ChatHeader = ({ handleCallUser, userName, userProfile, closeChat }) => {
  return (
    <div className="flex items-center justify-between  p-2 shadow-md">
      {/* Profile Section */}
      <div className="flex items-center space-x-3">
        <img
          src="https://i.pravatar.cc/150?img=3"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-gray-300 capitalize ">
            {userProfile?.firstName} {userProfile?.lastName}
          </p>
          <p className="text-sm text-gray-500">{userProfile?.email} </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          className="text-blue-500 hover:text-blue-700"
          title="Audio Call"
        >
          <FaPhoneAlt size={18} />
        </button>

        <button
          className="text-green-500 hover:text-green-700"
          title="Video Call"
          onClick={() => handleCallUser(userProfile?._id)}
        >
          <FaVideo size={20} />
        </button>

        <button
          onClick={closeChat}
          className="text-red-500 hover:text-red-700"
          title="Close Chat"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
