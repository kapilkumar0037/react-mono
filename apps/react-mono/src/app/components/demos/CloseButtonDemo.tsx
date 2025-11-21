import { useState } from 'react';
import { CloseButton } from '@react-mono/ui-controls';

export default function CloseButtonDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Close Button Demo</h1>

      {/* Basic Example */}
      <section>
        <h2 className="font-semibold mb-2">Basic Close Button</h2>
        <CloseButton onClick={() => alert('Closed!')} />
      </section>

      {/* Sizes */}
      <section>
        <h2 className="font-semibold mb-2">Sizes</h2>
        <div className="flex gap-4 items-center">
          <CloseButton size="sm" />
          <CloseButton size="md" />
          <CloseButton size="lg" />
        </div>
      </section>

      {/* Dismissible Example */}
      <section>
        <h2 className="font-semibold mb-2">Dismissible Example</h2>
        {visible && (
          <div className="relative bg-blue-100 border border-blue-200 rounded p-4 pr-10">
            <span>This is a dismissible alert.</span>
            <span className="absolute top-2 right-2">
              <CloseButton size="sm" onClick={() => setVisible(false)} />
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
