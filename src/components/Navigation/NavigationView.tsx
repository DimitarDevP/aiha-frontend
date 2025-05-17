import User from '../User/User';
import { useLocation } from 'react-router-dom';

function NavigationView() {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/Home') {
      return 'Home';
    } else if (path === '/Be-Aware') {
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
    
    // Default fallback for unknown routes
    return 'Health App';
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="text-lg font-semibold">{getPageTitle()}</div>
      <User />
    </div>
  );
}

export default NavigationView;
