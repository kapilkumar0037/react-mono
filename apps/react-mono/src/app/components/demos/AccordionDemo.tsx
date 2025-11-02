import React from 'react';
import { Accordion, AccordionItem } from '@react-mono/ui-controls';

const faqData = [
  {
    id: 'what-is',
    title: 'What is React Mono?',
    content: 'React Mono is a monorepo template for building React applications with modern tools and best practices. It includes TypeScript, Tailwind CSS, and various UI components.'
  },
  {
    id: 'how-to-use',
    title: 'How do I use these components?',
    content: 'Components can be imported directly from @react-mono/ui-controls. Each component is well-documented with examples and proper TypeScript types.'
  },
  {
    id: 'customization',
    title: 'Can I customize the styles?',
    content: 'Yes! All components are built with Tailwind CSS and accept className props for easy customization. You can also modify the base theme in the tailwind config.'
  }
];

export const AccordionDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Accordion</h2>
        <p className="text-sm text-gray-600 mb-4">
          Expandable accordion component with single or multiple expansion modes.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Single Expansion</h3>
            <div className="border rounded-lg overflow-hidden">
              <Accordion>
                {faqData.map(({ id, title, content }) => (
                  <AccordionItem key={id} id={id} title={title}>
                    {content}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Multiple Expansion</h3>
            <div className="border rounded-lg overflow-hidden">
              <Accordion allowMultiple defaultExpanded={['what-is']}>
                {faqData.map(({ id, title, content }) => (
                  <AccordionItem key={id} id={id} title={title}>
                    {content}
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Custom Styling</h3>
            <Accordion className="border-2 border-primary rounded-lg overflow-hidden">
              <AccordionItem
                id="custom-1"
                title={
                  <div className="flex items-center gap-2 text-primary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Custom Header</span>
                  </div>
                }
              >
                This accordion item has custom styling and an icon in its header.
              </AccordionItem>
              <AccordionItem
                id="custom-2"
                title="Another Custom Item"
              >
                You can customize the appearance using Tailwind classes.
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AccordionDemo;