import { Button, Checkbox, Dropdown, Radio, ReactMonoUiControls } from '@react-mono/ui-controls';
import { useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleParentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Parent checkbox changed:', event.target.checked);
    setIsAllChecked(event.target.checked);
  };
  return (
    <div>
      <div data-theme="default">
        <div className="bg-background text-text">Testing</div>
        <ReactMonoUiControls />
        <Button variant="primary" size="md">
          Primary Button
        </Button>
        <Button variant="secondary" size="md">
          Secondary Button
        </Button>
        <Button variant="ghost" size="md">
          Ghost Button
        </Button>

        <div>
          <Checkbox checked={isAllChecked} onChange={handleParentChange}>
            Checkbox
          </Checkbox>
        </div>
        <div className="mt-4">
          <Dropdown defaultValue="">
            <option value="" disabled>
              Select a fruit
            </option>
            <option value="apple">Apple</option>
            <option value="banana">Banana</option>
            <option value="orange">Orange</option>
          </Dropdown>
        </div>
        <div className="mt-4">
          <div className="mb-2 font-semibold">Choose a color:</div>
          <Radio name="color" value="red">Red</Radio>
          <Radio name="color" value="green">Green</Radio>
          <Radio name="color" value="blue">Blue</Radio>
        </div>
      </div>

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </div>
  );
}

export default App;
