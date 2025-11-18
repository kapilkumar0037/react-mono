import { useState } from 'react';
import { Range } from '@react-mono/ui-controls';

export default function RangeDemo() {
  const [value, setValue] = useState(50);
  const [custom, setCustom] = useState(25);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4">Range (Slider) Demo</h1>

      {/* Basic Example */}
      <section>
        <h2 className="font-semibold mb-2">Basic Range</h2>
        <Range value={value} onChange={e => setValue(Number(e.target.value))} showValue label="Volume" />
      </section>

      {/* Custom Range */}
      <section>
        <h2 className="font-semibold mb-2">Custom Range</h2>
        <Range
          min={-50}
          max={50}
          step={5}
          value={custom}
          onChange={e => setCustom(Number(e.target.value))}
          showValue
          label="Offset"
        />
      </section>

      {/* Disabled Range */}
      <section>
        <h2 className="font-semibold mb-2">Disabled Range</h2>
        <Range value={30} min={0} max={100} disabled label="Disabled" showValue />
      </section>
    </div>
  );
}
