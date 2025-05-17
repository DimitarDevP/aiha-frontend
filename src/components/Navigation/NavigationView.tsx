import User from '../User/User';
import { useLocation } from 'react-router-dom';

function NavigationView() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/Be-Aware') {
      return 'Be Aware';
    } else if (path === '/Chat') {
      return 'AIHA';
    } else if (path === '/Profile') {
      return 'My Profile';
    } else if (path === '/login') {
      return 'Sign In';
    } else if (path === '/register') {
      return 'Register';
    }
    
    // Return empty for Home ('/' or '/Home') and other routes
    return '';
  };

  const pageTitle = getPageTitle();

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-lg z-[100000] text-white">
      <div className="flex items-center gap-2">
        <div className="relative">
          <img 
            src="static/logo.png"
            alt="App Logo" 
            className="h-10 filter drop-shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-teal-400 rounded-full animate-pulse"></div>
        </div>
        {pageTitle && (
          <div className="flex flex-col">
            <span className="text-xs text-indigo-200 uppercase tracking-wider font-light">
              SpaceTech Health
            </span>
            <span className="text-lg font-medium tracking-wide text-white">
              {pageTitle}
            </span>
          </div>
        )}
      </div>
      <User />
    </div>
  );
}

export default NavigationView;