import React, { useState } from 'react';
import { Spinner } from '@react-mono/ui-controls';

export const SpinnerDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Spinner</h2>
        <p className="text-sm text-gray-600 mb-4">Lightweight spinner component with two visual styles, perfect for buttons and inline loading states.</p>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">Border Style</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="2xs" visual="border" />
                <span className="text-xs text-gray-500">2xs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="xs" visual="border" />
                <span className="text-xs text-gray-500">xs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="sm" visual="border" />
                <span className="text-xs text-gray-500">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" visual="border" />
                <span className="text-xs text-gray-500">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" visual="border" />
                <span className="text-xs text-gray-500">lg</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Classic Style</h3>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="2xs" visual="classic" />
                <span className="text-xs text-gray-500">2xs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="xs" visual="classic" />
                <span className="text-xs text-gray-500">xs</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="sm" visual="classic" />
                <span className="text-xs text-gray-500">sm</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" visual="classic" />
                <span className="text-xs text-gray-500">md</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" visual="classic" />
                <span className="text-xs text-gray-500">lg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Button Examples</h3>
          <div className="flex flex-wrap gap-4">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="2xs" variant="white" visual="border" />
                  Loading...
                </span>
              ) : (
                'Click me'
              )}
            </button>

            <button 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled
            >
              <span className="inline-flex items-center gap-2">
                <Spinner size="2xs" variant="inherit" visual="classic" />
                Processing...
              </span>
            </button>

            <button 
              className="p-2 aspect-square bg-green-500 text-white rounded-full hover:bg-green-600"
              disabled
            >
              <Spinner size="xs" variant="white" visual="border" />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Color Variants</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-medium w-16">Border:</h4>
              <Spinner variant="primary" size="sm" visual="border" />
              <Spinner variant="muted" size="sm" visual="border" />
              <div className="bg-gray-900 p-2 rounded">
                <Spinner variant="white" size="sm" visual="border" />
              </div>
              <div className="text-blue-500">
                <Spinner variant="inherit" size="sm" visual="border" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-medium w-16">Classic:</h4>
              <Spinner variant="primary" size="sm" visual="classic" />
              <Spinner variant="muted" size="sm" visual="classic" />
              <div className="bg-gray-900 p-2 rounded">
                <Spinner variant="white" size="sm" visual="classic" />
              </div>
              <div className="text-blue-500">
                <Spinner variant="inherit" size="sm" visual="classic" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpinnerDemo;
