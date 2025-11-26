import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarSection,
  NavbarItem,
} from '@react-mono/ui-controls';

const AdminNavbar: React.FC = () => {
  return (
    <Navbar className="bg-white shadow h-16 flex items-center px-6">
      <NavbarBrand className="text-xl font-bold text-blue-600">Admin Dashboard</NavbarBrand>
      <NavbarSection className="ml-auto flex items-center gap-4">
        <NavbarItem>
          <button className="text-gray-600 hover:text-blue-500 font-medium">Profile</button>
        </NavbarItem>
        <NavbarItem>
          <button className="text-gray-600 hover:text-blue-500 font-medium">Settings</button>
        </NavbarItem>
        <NavbarItem>
          <button className="text-gray-600 hover:text-blue-500 font-medium">Logout</button>
        </NavbarItem>
      </NavbarSection>
    </Navbar>
  );
};

export default AdminNavbar;
