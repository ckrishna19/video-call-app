import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userListAction } from "../redux/action/userAction";
import { userListApi } from "../redux/api";

const UserList = ({ openChat, onlineUser }) => {
  const { userList } = useSelector((state) => state?.user || {});
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userListAction(userListApi));
  }, [dispatch]);

  // Filter to exclude the current user

  return (
    <div className="space-y-3 h-[90%] overflow-auto">
      {userList?.length > 0 &&
        userList?.map((user) => {
          const onlineStatus = onlineUser?.includes(user._id);
          const loggedInUser = JSON.parse(localStorage?.getItem("user"));
          const roomId = [user._id, loggedInUser?._id]
            .join("")
            .split("")
            .sort()
            .join("");
          const chatList = useSelector(
            (state) => state?.chat?.chatMap[roomId] || []
          );
          //  const { userProfile } = useSelector((state) => state?.user || {});
          const [msg, setMsg] = useState();

          useEffect(() => {
            const sortedMessages = [...chatList].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setMsg(sortedMessages[0]);
          }, []);
          return (
            <button
              onClick={() => openChat(user?._id)}
              key={user?._id}
              className="flex p-1 bg-gray-700 rounded-lg hover:bg-gray-600 w-full gap-x-2"
            >
              {/* Profile Image */}
              <div className=" w-8 aspect-square relative">
                <img
                  src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  alt={`${user?.name}'s profile`}
                  className="w-full aspect-square rounded-full"
                />
                {onlineStatus && (
                  <span className="w-2 aspect-square rounded-full bg-green-500 absolute right-0 bottom-1" />
                )}
              </div>

              {/* User Info */}
              <div className=" block">
                <p className=" text-white text-sm">
                  {user?.firstName + " " + user?.lastName}
                </p>
                <p className="text-xs font-light text-left">{msg?.text}</p>
              </div>

              {/* Chat Now Button */}
              <p className="ml-auto text-xs font-light">12:07 pm</p>
            </button>
          );
        })}
    </div>
  );
};

export default UserList;
