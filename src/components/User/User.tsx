import React, { useState } from 'react';

function User() {
  const [isOpen, setIsOpen] = useState(false);

  const initials = "JD"; // You could pass this as a prop later

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div
        onClick={toggleMenu}
        className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center cursor-pointer font-bold"
      >
        {initials}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">User Profile</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">My Activity</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</button>
        </div>
      )}
    </div>
  );
}
export default User;