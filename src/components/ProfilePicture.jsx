import React, { useState } from "react";

const ProfilePicture = ({ setShowModal }) => {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);

  console.log(image);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-96 shadow-lg space-y-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          Change Profile Picture
        </h3>
        <input
          type="file"
          onChange={handleImage}
          accept="image/*"
          className="block w-full text-gray-300 bg-gray-700 rounded-lg border border-gray-600 cursor-pointer focus:outline-none"
        />
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-600 rounded-lg text-gray-200 hover:bg-gray-500"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicture;
