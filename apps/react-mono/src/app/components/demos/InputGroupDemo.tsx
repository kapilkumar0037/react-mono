import { InputGroup, InputGroupAddon, InputGroupInput } from '@react-mono/ui-controls';
import { useState } from 'react';

export default function InputGroupDemo() {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Input Group Demo</h1>

      {/* Basic Example */}
      <section>
        <h2 className="font-semibold mb-2">Basic Input Group</h2>
        <InputGroup>
          <InputGroupInput placeholder="Username" />
        </InputGroup>
      </section>

      {/* With Addon (Left) */}
      <section>
        <h2 className="font-semibold mb-2">With Addon (Left)</h2>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <InputGroupInput placeholder="Username" />
        </InputGroup>
      </section>

      {/* With Addon (Right) */}
      <section>
        <h2 className="font-semibold mb-2">With Addon (Right)</h2>
        <InputGroup>
          <InputGroupInput placeholder="Recipient's username" />
          <InputGroupAddon position="right">@example.com</InputGroupAddon>
        </InputGroup>
      </section>

      {/* Controlled Input */}
      <section>
        <h2 className="font-semibold mb-2">Controlled Input</h2>
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Amount"
            aria-label="Amount"
          />
          <InputGroupAddon position="right">.00</InputGroupAddon>
        </InputGroup>
      </section>

      {/* Custom Content */}
      <section>
        <h2 className="font-semibold mb-2">Custom Content</h2>
        <InputGroup>
          <InputGroupAddon>
            <span role="img" aria-label="search">🔍</span>
          </InputGroupAddon>
          <InputGroupInput placeholder="Search..." />
        </InputGroup>
      </section>
    </div>
  );
}
