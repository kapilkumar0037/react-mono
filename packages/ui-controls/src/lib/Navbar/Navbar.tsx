import React, { useState, useEffect, useCallback } from 'react';

export interface NavbarProps {
  brand?: React.ReactNode;
  children?: React.ReactNode;
  sticky?: boolean;
  transparent?: boolean;
  className?: string;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export interface NavbarBrandProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export interface NavbarItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface NavbarSectionProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export const NavbarBrand: React.FC<NavbarBrandProps> = ({ children, href = '#', className = '' }) => (
  <a
    href={href}
    className={`flex items-center text-xl font-semibold text-gray-800 hover:text-gray-600 ${className}`}
  >
    {children}
  </a>
);

export const NavbarItem: React.FC<NavbarItemProps> = ({
  children,
  href,
  active = false,
  className = '',
  onClick,
}) => {
  const Component = href ? 'a' : 'div';
  return (
    <Component
      href={href}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md cursor-pointer
        ${active ? 'bg-gray-50 text-gray-900' : ''} ${className}`}
    >
      {children}
    </Component>
  );
};

export const NavbarSection: React.FC<NavbarSectionProps> = ({
  children,
  align = 'start',
  className = '',
}) => {
  const alignmentClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
  };

  return (
    <div className={`flex items-center ${alignmentClasses[align]} ${className}`}>
      {children}
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({
  brand,
  children,
  sticky = false,
  transparent = false,
  className = '',
  onMobileMenuToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    setHasScrolled(scrollTop > 10);
  }, []);

  useEffect(() => {
    if (sticky) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
    return undefined;
  }, [sticky, handleScroll]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    onMobileMenuToggle?.(!isOpen);
  };

  const baseClasses = `
    w-full
    ${sticky ? 'sticky top-0 left-0' : 'relative'}
    ${transparent && !hasScrolled ? 'bg-transparent' : 'bg-white shadow-sm'}
    transition-all duration-200
    z-10
  `;

  return (
    <nav className={`${baseClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="flex items-center">
            {brand && <div className="flex-shrink-0 flex items-center">{brand}</div>}
          </div>

          <div className="hidden md:flex items-center justify-between flex-1 ml-6">
            {children}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu open/closed icons */}
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-200 ease-in-out ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {children}
        </div>
      </div>
    </nav>
  );
};