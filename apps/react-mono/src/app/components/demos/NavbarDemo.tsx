import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarItem,
  NavbarSection,
} from '@react-mono/ui-controls';
import { Button } from '@react-mono/ui-controls';

export const NavbarDemo = () => {
  const [activeItem, setActiveItem] = useState('home');
  
  return (
    <div className="space-y-12 py-6">
      {/* Basic Navbar */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Basic Navbar</h2>
        <div className="border rounded-lg overflow-hidden h-[200px] relative">
          <Navbar
            brand={
              <NavbarBrand>
                <svg
                  className="h-8 w-8 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Brand</span>
              </NavbarBrand>
            }
          >
            <NavbarSection>
              <NavbarItem href="#" active={activeItem === 'home'} onClick={() => setActiveItem('home')}>
                Home
              </NavbarItem>
              <NavbarItem href="#" active={activeItem === 'features'} onClick={() => setActiveItem('features')}>
                Features
              </NavbarItem>
              <NavbarItem href="#" active={activeItem === 'pricing'} onClick={() => setActiveItem('pricing')}>
                Pricing
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        </div>
      </section>

      {/* Navbar with Sections */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Navbar with Multiple Sections</h2>
        <div className="border rounded-lg overflow-hidden h-[200px] relative">
          <Navbar
            brand={
              <NavbarBrand>
                <span>MyApp</span>
              </NavbarBrand>
            }
          >
            <NavbarSection>
              <NavbarItem href="#">Products</NavbarItem>
              <NavbarItem href="#">Solutions</NavbarItem>
              <NavbarItem href="#">Resources</NavbarItem>
            </NavbarSection>
            <NavbarSection align="end">
              <NavbarItem>
                <Button variant="secondary">Sign In</Button>
              </NavbarItem>
              <NavbarItem>
                <Button>Get Started</Button>
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        </div>
      </section>

      {/* Transparent Sticky Navbar */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Transparent Sticky Navbar</h2>
        <div className="border rounded-lg overflow-hidden h-[300px] relative">
          <Navbar
            sticky
            transparent
            brand={
              <NavbarBrand>
                <span>Transparent</span>
              </NavbarBrand>
            }
          >
            <NavbarSection align="center">
              <NavbarItem href="#">About</NavbarItem>
              <NavbarItem href="#">Services</NavbarItem>
              <NavbarItem href="#">Contact</NavbarItem>
            </NavbarSection>
          </Navbar>
          <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
            Scroll to see navbar effect
          </div>
        </div>
      </section>

      {/* Custom Styled Navbar */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Custom Styled Navbar</h2>
        <div className="border rounded-lg overflow-hidden h-[200px] relative">
          <Navbar
            className="bg-gray-800"
            brand={
              <NavbarBrand className="text-white">
                <span>Dark Theme</span>
              </NavbarBrand>
            }
          >
            <NavbarSection>
              <NavbarItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                Dashboard
              </NavbarItem>
              <NavbarItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                Team
              </NavbarItem>
              <NavbarItem className="text-gray-300 hover:text-white hover:bg-gray-700">
                Projects
              </NavbarItem>
            </NavbarSection>
            <NavbarSection align="end">
              <NavbarItem className="text-gray-300">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                  <span className="ml-2">John Doe</span>
                </div>
              </NavbarItem>
            </NavbarSection>
          </Navbar>
        </div>
      </section>
    </div>
  );
};