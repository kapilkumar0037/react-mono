import { Checkbox } from '@react-mono/ui-controls';
import { useEffect, useRef, useState } from 'react';

export const CheckboxesDemo = () => {
  const [childStates, setChildStates] = useState({
    option1: false,
    option2: false,
    option3: false
  });

  const parentCheckboxRef = useRef<HTMLInputElement>(null);

  // Handle individual child checkbox changes
  const handleChildChange = (option: keyof typeof childStates) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setChildStates(prev => ({
      ...prev,
      [option]: event.target.checked
    }));
  };

  // Handle parent checkbox changes
  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChildStates({
      option1: event.target.checked,
      option2: event.target.checked,
      option3: event.target.checked
    });
  };

  // Update parent checkbox state based on children
  useEffect(() => {
    if (parentCheckboxRef.current) {
      const checkedCount = Object.values(childStates).filter(Boolean).length;
      const parentCheckbox = parentCheckboxRef.current;

      if (checkedCount === 0) {
        parentCheckbox.checked = false;
        parentCheckbox.indeterminate = false;
      } else if (checkedCount === Object.keys(childStates).length) {
        parentCheckbox.checked = true;
        parentCheckbox.indeterminate = false;
      } else {
        parentCheckbox.checked = false;
        parentCheckbox.indeterminate = true;
      }
    }
  }, [childStates]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Checkboxes</h2>
        <p className="text-gray-600 mb-8">
          Checkbox components with different states and grouping.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Checkbox Group</h3>
        <div className="space-y-2">
          <div>
            <Checkbox ref={parentCheckboxRef} onChange={handleParentChange}>
              Select All Options
            </Checkbox>
          </div>
          <div className="ml-6 flex flex-col gap-4">
            <Checkbox 
              checked={childStates.option1} 
              onChange={handleChildChange('option1')}
            >
              Option 1
            </Checkbox>
            <Checkbox 
              checked={childStates.option2} 
              onChange={handleChildChange('option2')}
            >
              Option 2
            </Checkbox>
            <Checkbox 
              checked={childStates.option3} 
              onChange={handleChildChange('option3')}
            >
              Option 3
            </Checkbox>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="flex flex-col gap-4">
          <Checkbox defaultChecked={false}>Unchecked State</Checkbox>
          <Checkbox defaultChecked>Checked State</Checkbox>
          <Checkbox disabled>Disabled Unchecked</Checkbox>
          <Checkbox checked disabled>Disabled Checked</Checkbox>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Controlled Example</h3>
        <div className="space-y-2">
          <Checkbox
            checked={true}
            onChange={() => {}}
          >
            Always Checked (Controlled)
          </Checkbox>
        </div>
      </div>
    </div>
  );
};