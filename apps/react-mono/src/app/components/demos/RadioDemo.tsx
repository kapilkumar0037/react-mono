import { Radio } from '@react-mono/ui-controls';
import { useState } from 'react';

export const RadioDemo = () => {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedFruit, setSelectedFruit] = useState<string>('apple');
  const [selectedSize, setSelectedSize] = useState<string>('medium');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Radio Buttons</h2>
        <p className="text-gray-600 mb-8">
          Radio button components for single selection options.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <div className="space-y-2">
          <div className="mb-2">
            <span className="font-semibold">Selected color: </span>
            <span className="text-primary">{selectedColor || 'None'}</span>
          </div>
          <div className="flex flex-col gap-4">
            <Radio 
              name="colors" 
              value="red"
              checked={selectedColor === 'red'}
              onChange={e => setSelectedColor(e.target.value)}
            >
              Red
            </Radio>
            <Radio 
              name="colors" 
              value="green"
              checked={selectedColor === 'green'}
              onChange={e => setSelectedColor(e.target.value)}
            >
              Green
            </Radio>
            <Radio 
              name="colors" 
              value="blue"
              checked={selectedColor === 'blue'}
              onChange={e => setSelectedColor(e.target.value)}
            >
              Blue
            </Radio>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">With Default Value</h3>
        <div className="space-y-2">
          <div className="mb-2">
            <span className="font-semibold">Selected size: </span>
            <span className="text-primary">{selectedSize}</span>
          </div>
          <div className="flex flex-col gap-4">
            <Radio 
              name="sizes" 
              value="small"
              checked={selectedSize === 'small'}
              onChange={e => setSelectedSize(e.target.value)}
            >
              Small
            </Radio>
            <Radio 
              name="sizes" 
              value="medium"
              checked={selectedSize === 'medium'}
              onChange={e => setSelectedSize(e.target.value)}
            >
              Medium
            </Radio>
            <Radio 
              name="sizes" 
              value="large"
              checked={selectedSize === 'large'}
              onChange={e => setSelectedSize(e.target.value)}
            >
              Large
            </Radio>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different States</h3>
        <div className="flex flex-col gap-4">
          <Radio 
            name="states-1" 
            value="enabled"
          >
            Normal State
          </Radio>
          <Radio 
            name="states-2" 
            value="checked"
            defaultChecked
          >
            Initially Checked
          </Radio>
          <Radio 
            name="states-3" 
            value="disabled"
            disabled
          >
            Disabled Unchecked
          </Radio>
          <Radio 
            name="states-4" 
            value="disabled-checked"
            defaultChecked
            disabled
          >
            Disabled Checked
          </Radio>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form Example</h3>
        <form 
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Selected fruit: ${selectedFruit}`);
          }}
        >
          <div className="mb-2">
            <span className="font-semibold">Selected fruit: </span>
            <span className="text-primary">{selectedFruit}</span>
          </div>
          <div className="flex flex-col gap-4">
            <Radio 
              name="fruit" 
              value="apple"
              checked={selectedFruit === 'apple'}
              onChange={e => setSelectedFruit(e.target.value)}
            >
              Apple
            </Radio>
            <Radio 
              name="fruit" 
              value="banana"
              checked={selectedFruit === 'banana'}
              onChange={e => setSelectedFruit(e.target.value)}
            >
              Banana
            </Radio>
            <Radio 
              name="fruit" 
              value="orange"
              checked={selectedFruit === 'orange'}
              onChange={e => setSelectedFruit(e.target.value)}
            >
              Orange
            </Radio>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};