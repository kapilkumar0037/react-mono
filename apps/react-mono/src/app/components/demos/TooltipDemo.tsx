import React from 'react';
import { Tooltip } from '@react-mono/ui-controls';

export const TooltipDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Tooltip</h2>
        <p className="text-sm text-gray-600 mb-4">
          Accessible tooltip component with customizable placement and animation.
        </p>

        <div className="flex flex-wrap gap-8 items-center justify-center py-8">
          <Tooltip content="Tooltip on top (default)">
            <button className="px-4 py-2 bg-primary text-white rounded">Top</button>
          </Tooltip>
          <Tooltip content="Tooltip on right" placement="right">
            <button className="px-4 py-2 bg-primary text-white rounded">Right</button>
          </Tooltip>
          <Tooltip content="Tooltip on bottom" placement="bottom">
            <button className="px-4 py-2 bg-primary text-white rounded">Bottom</button>
          </Tooltip>
          <Tooltip content="Tooltip on left" placement="left">
            <button className="px-4 py-2 bg-primary text-white rounded">Left</button>
          </Tooltip>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 items-center">
          <Tooltip content="Disabled tooltip" disabled>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded cursor-not-allowed" disabled>
              Disabled
            </button>
          </Tooltip>

          <Tooltip content={"Multiline\ntooltip\ncontent"}>
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded cursor-pointer">
              Hover for multiline
            </span>
          </Tooltip>

          <Tooltip content={<span>Custom <b>JSX</b> content</span>} placement="bottom">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded cursor-pointer">
              Custom content
            </span>
          </Tooltip>
        </div>
      </section>
    </div>
  );
};

export default TooltipDemo;
