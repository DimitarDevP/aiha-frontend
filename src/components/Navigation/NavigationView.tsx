import User from '../User/User'

function NavigationView() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="text-lg font-semibold">NavigationView</div>
      <User />
    </div>
  );
}

export default NavigationView