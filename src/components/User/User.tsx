import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { manualLogout } from '../../redux/userAuth/userAuthSlice';
import { 
  personOutline, 
  logOutOutline, 
  homeOutline,
  personCircleOutline, 
  pulseOutline, 
  menuOutline,
  chatbubbleOutline,
  alertCircleOutline,
  planetOutline,
  logInOutline,
  closeOutline
} from 'ionicons/icons';
import { IonIcon } from '@ionic/react';

function User() {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => state.userAuth.isAuthenticated);
  const userName = useSelector((state: RootState) => state.userAuth.user.name);

  const handleLogout = () => {
    dispatch(manualLogout());
    setIsOpen(false);
    history.push('/login');
  };

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <div className="relative flex items-center space-x-2">
      {!isAuthenticated && (
        <>
          <button
            onClick={() => history.push('/login')}
            className="flex items-center space-x-1 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-md transition-all duration-200 text-sm font-medium"
          >
            <IonIcon icon={logInOutline} className="text-lg" />
            <span>Sign In</span>
          </button>

          <button
            onClick={toggleMenu}
            className="w-9 h-9 bg-indigo-700 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-md text-white relative"
          >
            <IonIcon icon={menuOutline} className="text-lg" />
            {isAuthenticated && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse ring-2 ring-white"></div>
            )}
          </button>
        </>
      )}

      {isAuthenticated && (
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="w-9 h-9 bg-gradient-to-br from-teal-400 to-indigo-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {userName ? (
              <span className="font-medium text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
            ) : (
              <IonIcon 
                icon={personOutline} 
                className="text-lg" 
                aria-hidden="true"
              />
            )}
          </button>
          {isAuthenticated && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-pulse ring-2 ring-white"></div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="absolute right-0 top-11 w-56 bg-white backdrop-filter backdrop-blur-lg bg-opacity-95 rounded-xl shadow-xl z-[1000] ring-1 ring-indigo-100 focus:outline-none overflow-hidden border border-white/20">
          <div className="flex justify-between items-center py-2 px-3 border-b border-indigo-100">
            <h3 className="text-indigo-900 font-medium text-sm">Space Health Navigator</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              <IonIcon icon={closeOutline} className="text-lg" />
            </button>
          </div>
          
          <div className="py-1">
            <NavLink
              to="/Home"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 w-full text-left transition-colors duration-200 text-sm"
              activeClassName="bg-indigo-50 text-indigo-800"
            >
              <div className="bg-indigo-100 p-1.5 rounded-lg mr-2 text-indigo-600">
                <IonIcon icon={homeOutline} className="text-base" />
              </div>
              <span>Home</span>
            </NavLink>
            
            {isAuthenticated && (
              <NavLink
                to="/Profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 w-full text-left transition-colors duration-200 text-sm"
                activeClassName="bg-indigo-50 text-indigo-800"
              >
                <div className="bg-teal-100 p-1.5 rounded-lg mr-2 text-teal-600">
                  <IonIcon icon={personOutline} className="text-base" />
                </div>
                <span>My Profile</span>
                {isAuthenticated && (
                  <div className="ml-auto w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                )}
              </NavLink>
            )}
            
            <NavLink
              to="/Chat"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 w-full text-left transition-colors duration-200 text-sm"
              activeClassName="bg-indigo-50 text-indigo-800"
            >
              <div className="bg-purple-100 p-1.5 rounded-lg mr-2 text-purple-600">
                <IonIcon icon={chatbubbleOutline} className="text-base" />
              </div>
              <span>AIHA Chat</span>
            </NavLink>
            
            <NavLink
              to="/Be-Aware"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 w-full text-left transition-colors duration-200 text-sm"
              activeClassName="bg-indigo-50 text-indigo-800"
            >
              <div className="bg-amber-100 p-1.5 rounded-lg mr-2 text-amber-600">
                <IonIcon icon={alertCircleOutline} className="text-base" />
              </div>
              <span>Be Aware</span>
            </NavLink>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700 w-full text-left border-t border-indigo-100 mt-1 transition-colors duration-200 text-sm"
              >
                <div className="bg-red-100 p-1.5 rounded-lg mr-2 text-red-500">
                  <IonIcon icon={logOutOutline} className="text-base" />
                </div>
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default User;