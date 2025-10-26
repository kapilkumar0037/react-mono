import { Dropdown } from '@react-mono/ui-controls';

export const DropdownsDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dropdowns</h2>
        <p className="text-gray-600 mb-8">
          Dropdown select components for various use cases.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Dropdown</h3>
        <div className="max-w-xs">
          <Dropdown defaultValue="">
            <option value="" disabled>
              Select a fruit
            </option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
          </Dropdown>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled State</h3>
        <div className="max-w-xs">
          <Dropdown disabled defaultValue="">
            <option value="" disabled>
              Select an option
            </option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};