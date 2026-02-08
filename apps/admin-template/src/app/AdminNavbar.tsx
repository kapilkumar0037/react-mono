import React, { useState } from 'react';
import {
  Navbar,
  NavbarSection,
} from '@react-mono/ui-controls';

interface AdminNavbarProps {
  onToggleSidebar?: () => void;
  onSearch?: (query: string) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar, onSearch }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <Navbar className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 h-14 flex items-center border-b border-blue-800 shadow-sm">
      <NavbarSection align="end" className="w-full flex items-center justify-between gap-4 relative -ml-3 pr-6">
        <button
          onClick={() => onToggleSidebar?.()}
          className="text-blue-100 hover:text-blue-100 hover:bg-blue-800 font-medium px-2 py-2 rounded transition-colors duration-150 hidden md:flex items-center"
          title="Toggle Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Search Bar */}
        <div className="flex-1 max-w-xs hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-3 py-2 bg-blue-800 text-white text-sm placeholder-blue-300 rounded focus:outline-none focus:bg-blue-700 transition-colors"
            />
            <svg className="absolute right-3 top-2.5 w-4 h-4 text-blue-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-blue-100 hover:text-blue-100 hover:bg-blue-800 font-medium px-3 py-2 rounded transition-colors duration-150 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Admin User</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 last:rounded-b-lg transition-colors border-t border-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        </div>
      </NavbarSection>
    </Navbar>
  );
};

export default AdminNavbar;
