import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

function User() {
  const [isOpen, setIsOpen] = useState(false);

  const initials = "JD"; // You could pass this as a prop later

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <div
        onClick={toggleMenu}
        className="w-10 h-10 bg-gray-700 text-white rounded-full flex items-center justify-center cursor-pointer font-bold 100"
      >
        {initials}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[1000]">
          <NavLink to="/tab1" className="block text-black w-full text-left px-4 py-2 hover:bg-gray-100">User Profile</NavLink>
          <NavLink to="/tab2" className="block text-black w-full text-left px-4 py-2 hover:bg-gray-100">My Activity</NavLink>
          <NavLink to="/tab3" className="block text-black w-full text-left px-4 py-2 hover:bg-gray-100">Log Out</NavLink>
        </div>
      )}
    </div>
  );
}
export default User;