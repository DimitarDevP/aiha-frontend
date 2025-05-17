import React from 'react'
import User from '../User/User'
import { IonToolbar } from '@ionic/react'

function NavigationView() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 shadow z-[100000]">
      <div className="text-lg font-semibold">NavigationView</div>
      <User />
    </div>
  );
}

export default NavigationView