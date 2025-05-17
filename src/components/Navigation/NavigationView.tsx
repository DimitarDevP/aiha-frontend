import User from '../User/User';

function NavigationView() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="flex items-center gap-2">
        <img src="/static/aiha.logo.png" alt="Logo" className="h-14 w-auto" />
      </div>
      <User />
    </div>
  );
}

export default NavigationView;
