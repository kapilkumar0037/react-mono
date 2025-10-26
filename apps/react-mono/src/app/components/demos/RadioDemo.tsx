import { Radio } from '@react-mono/ui-controls';

export const RadioDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Radio Buttons</h2>
        <p className="text-gray-600 mb-8">
          Radio button components for single selection options.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Radio Group</h3>
        <div className="space-y-2">
          <div className="mb-2 font-semibold">Choose a color:</div>
          <Radio name="color" value="red">Red</Radio>
          <Radio name="color" value="green">Green</Radio>
          <Radio name="color" value="blue">Blue</Radio>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="space-y-2">
          <Radio name="states" value="default">Default Radio</Radio>
          <Radio name="states" value="checked" defaultChecked>Checked Radio</Radio>
          <Radio name="states" value="disabled" disabled>Disabled Radio</Radio>
          <Radio name="states" value="disabled-checked" defaultChecked disabled>Checked Disabled</Radio>
        </div>
      </div>
    </div>
  );
};