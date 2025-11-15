import { useState } from 'react';
import { Collapse } from '@react-mono/ui-controls';

export default function CollapseDemo() {
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(true);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Collapse Demo</h1>

      {/* Basic Example */}
      <section>
        <h2 className="font-semibold mb-2">Basic Collapse</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded mb-2"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="collapse-basic"
        >
          Toggle
        </button>
        <Collapse isOpen={open} id="collapse-basic" className="bg-gray-100 rounded shadow p-4">
          <div>This content can be collapsed.</div>
        </Collapse>
      </section>

      {/* Controlled Example */}
      <section>
        <h2 className="font-semibold mb-2">Controlled Collapse</h2>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded mb-2"
          onClick={() => setOpen2((v) => !v)}
          aria-expanded={open2}
          aria-controls="collapse-controlled"
        >
          {open2 ? 'Hide' : 'Show'} Details
        </button>
        <Collapse isOpen={open2} id="collapse-controlled" className="bg-green-50 rounded shadow p-4">
          <ul className="list-disc pl-6">
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </Collapse>
      </section>

      {/* Custom Content Example */}
      <section>
        <h2 className="font-semibold mb-2">Collapse with Custom Content</h2>
        <Collapse isOpen={true} className="bg-yellow-50 rounded shadow p-4">
          <div>
            <strong>Always visible:</strong> This collapse is always open.<br />
            You can put <span className="text-yellow-700">any content</span> here.
          </div>
        </Collapse>
      </section>
    </div>
  );
}
