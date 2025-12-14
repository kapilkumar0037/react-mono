import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarSection,
  NavbarItem,
} from '@react-mono/ui-controls';

const AdminNavbar: React.FC = () => {
  return (
    <Navbar className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 h-14 flex items-center px-6 border-b border-blue-900 shadow-sm">
      <NavbarBrand className="flex items-center gap-2 text-lg font-bold text-blue-100 tracking-wide">
        <img src='/logo192.png' alt='Logo' className='h-5 w-5 rounded-full shadow-sm' />
        AdminPro
      </NavbarBrand>
      <NavbarSection className="ml-auto flex items-center gap-4">
        <NavbarItem>
          <button className="text-blue-100 hover:text-white font-medium px-2 py-1 rounded transition-colors duration-150">Profile</button>
        </NavbarItem>
        <NavbarItem>
          <button className="text-blue-100 hover:text-white font-medium px-2 py-1 rounded transition-colors duration-150">Settings</button>
        </NavbarItem>
        <NavbarItem>
          <button className="text-blue-100 hover:text-white font-medium px-2 py-1 rounded transition-colors duration-150">Logout</button>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
};

export default AdminNavbar;
