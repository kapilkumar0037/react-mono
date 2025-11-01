import React from 'react';
import { Spinner } from '@react-mono/ui-controls';

export const SpinnerDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Spinner</h2>
        <p className="text-sm text-gray-600 mb-4">Simple spinner component with sizes and color variants.</p>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xs" />
            <span className="text-xs text-gray-500">xs</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-xs text-gray-500">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-gray-500">md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-gray-500">lg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="xl" />
            <span className="text-xs text-gray-500">xl</span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Color variants</h3>
          <div className="flex items-center gap-4">
            <Spinner variant="primary" />
            <Spinner variant="muted" />
            <div className="bg-black p-2 rounded">
              <Spinner variant="white" />
            </div>
            <Spinner variant="black" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Inline usage</h3>
        <p>
          Button with spinner:
          <span className="ml-3 inline-flex items-center">
            <Spinner size="sm" className="mr-2" />
            Loading...
          </span>
        </p>
      </section>
    </div>
  );
};

export default SpinnerDemo;
