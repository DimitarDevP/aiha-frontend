import User from '../User/User'
import { useState } from 'react';
function NavigationView() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="text-lg font-semibold">NavigationView</div>
      {isLoggedIn && <User />} {/* Only show User component when logged in */}
    </div>
  );
}

export default NavigationView;