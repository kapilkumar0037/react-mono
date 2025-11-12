import React from 'react';
import { Popover } from '@react-mono/ui-controls';

export const PopoverDemo: React.FC = () => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Popover</h2>
        <p className="text-sm text-gray-600 mb-4">Lightweight popover supporting click/hover/focus triggers and placements.</p>

        <div className="flex items-center gap-6">
          <Popover content={<div>Simple click popover content</div>} trigger="click">
            <button className="px-4 py-2 bg-primary text-white rounded">Click me</button>
          </Popover>

          <Popover content={<div>Hover popover</div>} trigger="hover" placement="top">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded">Hover me</button>
          </Popover>

          <Popover content={<div>Focus popover</div>} trigger="focus" placement="right">
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded">Focus me</button>
          </Popover>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Interactive content</h3>
          <Popover
            content={<div className="w-48"> 
              <div className="text-sm font-medium mb-2">Actions</div>
              <button className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded">Edit</button>
              <button className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded">Duplicate</button>
              <button className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded text-red-600">Delete</button>
            </div>}
            trigger="click"
          >
            <button className="px-4 py-2 bg-gray-100 rounded">Open actions</button>
          </Popover>
        </div>
      </section>
    </div>
  );
};

export default PopoverDemo;