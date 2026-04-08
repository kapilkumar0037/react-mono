import React from 'react';

interface AdminTableSortHeaderProps {
  label: string;
  isActive: boolean;
  direction?: 'asc' | 'desc';
  align?: 'left' | 'right';
  isDarkMode?: boolean;
  onClick: () => void;
}

const AdminTableSortHeader: React.FC<AdminTableSortHeaderProps> = ({
  label,
  isActive,
  direction,
  align = 'left',
  isDarkMode = false,
  onClick,
}) => {
  const textAlign = align === 'right' ? 'justify-end text-right' : 'justify-start text-left';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-1 font-semibold ${textAlign} ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
    >
      <span>{label}</span>
      <span className={`text-[10px] ${isActive ? (isDarkMode ? 'text-blue-300' : 'text-blue-600') : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
        {isActive ? (direction === 'asc' ? '▲' : '▼') : '↕'}
      </span>
    </button>
  );
};

export default AdminTableSortHeader;
