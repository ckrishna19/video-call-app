import React, { useState } from "react";
import { Mail, User, Camera, Edit3, MapPin, Calendar } from "lucide-react";
import ProfilePicture from "./ProfilePicture";

// ProfilePage.jsx
// Beautiful dark mode profile page with Tailwind + lucide-react icons

export default function ProfilePage({ handleLogout }) {
  const [showModal, setShowModal] = useState(false);
  const profile = {
    name: "Krishna Chalise",
    email: "krishna@example.com",
    location: "St. John's, Canada",
    joined: "March 2024",
    avatar: "https://i.pravatar.cc/150?img=47",
    cover: "https://picsum.photos/1000/300?random=5",
    bio: "Industrial Millwright | MERN Developer | Lifelong learner and explorer of new technologies.",
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-gray-100 antialiased">
        {/* Cover */}
        <div className="relative w-full h-56 md:h-72 bg-gray-800">
          <img
            src={profile.cover}
            alt="cover"
            className="w-full h-full object-cover"
          />
          <button className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/40 hover:bg-black/60 text-white">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="max-w-4xl mx-auto px-4 -mt-20">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl border border-white/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="relative w-32 h-32">
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover"
                />
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-2 right-2 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white shadow-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {profile.name}
                </h1>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {profile.email}
                </p>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </p>
                <p className="text-gray-400 mt-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Joined {profile.joined}
                </p>
              </div>

              {/* Edit button */}
              <div className="flex gap-x-2">
                <button className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-medium shadow hover:opacity-90">
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-medium shadow hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <h2 className="text-lg font-semibold mb-2">About</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xl font-bold">245</p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xl font-bold">180</p>
                <p className="text-xs text-gray-400">Following</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xl font-bold">32</p>
                <p className="text-xs text-gray-400">Posts</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow hover:opacity-90">
                Message
              </button>
              <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-medium shadow hover:opacity-90">
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>
      {showModal && <ProfilePicture setShowModal={setShowModal} />}
    </>
  );
}
