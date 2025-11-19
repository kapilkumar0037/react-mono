import { Nav, NavItem, Tabs } from '@react-mono/ui-controls';
import { useState } from 'react';

export default function NavsTabsDemo() {
  const [active, setActive] = useState('home');
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Navs & Tabs Demo</h1>

      {/* Navs Example */}
      <section>
        <h2 className="font-semibold mb-2">Navs (Underline)</h2>
        <Nav variant="underline">
          <NavItem active={active === 'home'} onClick={() => setActive('home')}>Home</NavItem>
          <NavItem active={active === 'profile'} onClick={() => setActive('profile')}>Profile</NavItem>
          <NavItem active={active === 'contact'} onClick={() => setActive('contact')}>Contact</NavItem>
          <NavItem disabled>Disabled</NavItem>
        </Nav>
        <div className="mt-4">Active: {active}</div>
      </section>

      {/* Tabs Example */}
      <section>
        <h2 className="font-semibold mb-2">Tabs</h2>
        <Tabs
          tabs={[
            { label: 'Tab 1', content: <div>Tab 1 content</div> },
            { label: 'Tab 2', content: <div>Tab 2 content</div> },
            { label: 'Tab 3', content: <div>Tab 3 content</div>, disabled: true },
          ]}
        />
      </section>
    </div>
  );
}
