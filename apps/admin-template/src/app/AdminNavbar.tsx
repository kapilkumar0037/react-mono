import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarSection,
  NavbarItem,
} from '@react-mono/ui-controls';

const AdminNavbar: React.FC = () => {
  return (
    <Navbar className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 h-14 flex items-center px-6 border-b border-blue-800 shadow-sm">
      <NavbarSection align="end" className="w-full flex items-center justify-end gap-4">
        <button className="text-blue-100 hover:text-blue-100 hover:bg-blue-800 font-medium px-3 py-2 rounded transition-colors duration-150">Profile</button>
        <button className="text-blue-100 hover:text-blue-100 hover:bg-blue-800 font-medium px-3 py-2 rounded transition-colors duration-150">Settings</button>
        <button className="text-blue-100 hover:text-blue-100 hover:bg-blue-800 font-medium px-3 py-2 rounded transition-colors duration-150">Logout</button>
      </NavbarSection>
    </Navbar>
  );
};

export default AdminNavbar;
