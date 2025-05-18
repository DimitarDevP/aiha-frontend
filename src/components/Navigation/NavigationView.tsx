import User from '../User/User';
import { useLocation, useHistory } from 'react-router-dom';

function NavigationView() {
  const location = useLocation();
  const history = useHistory();
  
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
    
    return '';
  };

  const pageTitle = getPageTitle();

  const handleLogoClick = () => {
    history.push('/Home');
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 shadow-lg z-[100000] text-white">
      <div className="flex items-center gap-2">
        <img 
          src="static/logo.png"
          alt="App Logo" 
          className="h-10 w-10 rounded-full object-cover filter drop-shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        />
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