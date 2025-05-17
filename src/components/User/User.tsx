import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { manualLogout } from '../../redux/userAuth/userAuthSlice';
import { personCircleOutline, logOutOutline, personOutline, pulseOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

function User() {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);
  const userName = useSelector((state: RootState) => state.userAuth.user.name);
  
  const getInitials = () => {
    if (!userName) return '?';
    const names = userName.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}` 
      : `${names[0][0]}`;
  };

  const handleLogout = () => {
    dispatch(manualLogout());
    setIsOpen(false);
    history.push('/login');
  };

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => history.push('/login')}
        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-colors"
      >
        <IonIcon icon={personCircleOutline} className="text-xl" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer font-bold hover:bg-indigo-700 transition-colors"
      >
        {getInitials()}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-[1000] ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
              <p className="font-medium">Welcome back</p>
              <p className="truncate">{userName || 'User'}</p>
            </div>
            
            <NavLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <IonIcon icon={personOutline} className="mr-2 text-gray-500" />
              My Profile
            </NavLink>
            
            <NavLink
              to="/activity"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <IonIcon icon={pulseOutline} className="mr-2 text-gray-500" />
              My Activity
            </NavLink>
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <IonIcon icon={logOutOutline} className="mr-2 text-gray-500" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;