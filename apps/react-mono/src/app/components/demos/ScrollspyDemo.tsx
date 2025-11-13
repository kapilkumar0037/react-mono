import React from 'react';
import { Scrollspy } from '@react-mono/ui-controls';

const sections = [
  { id: 'section-1', label: 'Introduction' },
  { id: 'section-2', label: 'Features' },
  { id: 'section-3', label: 'Usage' },
  { id: 'section-4', label: 'Examples' },
  { id: 'section-5', label: 'Conclusion' },
];

export const ScrollspyDemo: React.FC = () => {
  return (
    <div className="flex gap-8">
      <aside className="sticky top-8 h-fit min-w-[180px]">
        <Scrollspy
          sections={sections}
          offset={16}
          navClassName="space-y-2"
          linkClassName="block px-3 py-2 rounded text-gray-600 hover:bg-gray-100"
          activeLinkClassName="bg-primary/10 text-primary font-semibold"
        />
      </aside>
      <main className="flex-1 space-y-24">
        <section id="section-1" className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <p className="text-gray-700 mb-2">Scrollspy automatically updates navigation based on scroll position, highlighting the current section in view. This is useful for documentation, long pages, and dashboards.</p>
          <p className="text-gray-500">Scroll down to see the nav update as you move through sections.</p>
        </section>
        <section id="section-2" className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Highlights nav link for visible section</li>
            <li>Smooth scroll to section on nav click</li>
            <li>Customizable offset for sticky headers</li>
            <li>Custom nav rendering supported</li>
            <li>Accessible with keyboard navigation</li>
          </ul>
        </section>
        <section id="section-3" className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Usage</h2>
          <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto">
{`<Scrollspy
  sections={[
    { id: 'section-1', label: 'Intro' },
    { id: 'section-2', label: 'Features' },
    // ...
  ]}
  offset={16}
/>`}
          </pre>
        </section>
        <section id="section-4" className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Examples</h2>
          <div className="space-y-4">
            <div className="h-32 bg-primary/10 rounded flex items-center justify-center text-primary font-bold">Section Example 1</div>
            <div className="h-32 bg-blue-100 rounded flex items-center justify-center text-blue-700 font-bold">Section Example 2</div>
            <div className="h-32 bg-green-100 rounded flex items-center justify-center text-green-700 font-bold">Section Example 3</div>
          </div>
        </section>
        <section id="section-5" className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Conclusion</h2>
          <p className="text-gray-700">Scrollspy is a simple way to keep navigation in sync with page content. Try resizing or scrolling quickly to test its responsiveness.</p>
        </section>
      </main>
    </div>
  );
};

export default ScrollspyDemo;
