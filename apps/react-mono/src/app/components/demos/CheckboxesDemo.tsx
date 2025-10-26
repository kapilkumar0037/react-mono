import { Checkbox } from '@react-mono/ui-controls';
import { useState } from 'react';

export const CheckboxesDemo = () => {
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAllChecked(event.target.checked);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Checkboxes</h2>
        <p className="text-gray-600 mb-8">
          Checkbox components with different states and grouping.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Checkboxes</h3>
        <div className="space-y-2">
          <div>
            <Checkbox checked={isAllChecked} onChange={handleParentChange}>
              Parent Checkbox
            </Checkbox>
          </div>
          <div className="ml-6 space-y-2">
            <Checkbox checked={isAllChecked}>Child Option 1</Checkbox>
            <Checkbox checked={isAllChecked}>Child Option 2</Checkbox>
            <Checkbox checked={isAllChecked}>Child Option 3</Checkbox>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="space-y-2">
          <Checkbox>Default Checkbox</Checkbox>
          <Checkbox checked>Checked Checkbox</Checkbox>
          <Checkbox disabled>Disabled Checkbox</Checkbox>
          <Checkbox checked disabled>Checked Disabled</Checkbox>
        </div>
      </div>
    </div>
  );
};