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
    } else if (path === '/Vault') {
      return 'User Vault';
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
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="flex items-center gap-2">
        <img 
          src="static/logo.png"
          alt="App Logo" 
          className="h-14"
        />
        {pageTitle && (
          <span className="text-lg font-semibold">
            {pageTitle}
          </span>
        )}
      </div>
      <User />
    </div>
  );
}

export default NavigationView;