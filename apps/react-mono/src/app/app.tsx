import { Button, Card, Checkbox, Datetime, Dropdown, Radio, Textarea } from '@react-mono/ui-controls';
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
        <div className="mt-4">
          <Textarea rows={4} placeholder="Type your message here...">
            Message
          </Textarea>
        </div>
        <div className="mt-4">
          <Datetime value="2025-10-22T15:30" onChange={(value) => console.log('New datetime:', value)}>
            Select Date and Time
          </Datetime>
        </div>

        <div className="mt-8 space-y-6">
          <Card variant="default">
            <Card.Header>
              <h3 className="text-lg font-semibold">Default Card</h3>
            </Card.Header>
            <Card.Content>
              <p>This is a default card with a header. It uses the standard background and no border.</p>
            </Card.Content>
          </Card>

          <Card variant="bordered">
            <Card.Header>
              <h3 className="text-lg font-semibold">Bordered Card</h3>
            </Card.Header>
            <Card.Content>
              <p>This card has a border and shows how to use the bordered variant.</p>
            </Card.Content>
            <Card.Footer>
              <Button variant="primary" size="sm">Action</Button>
              <Button variant="ghost" size="sm">Cancel</Button>
            </Card.Footer>
          </Card>

          <Card variant="elevated">
            <Card.Content>
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p>This is an elevated card that shows content without header or footer sections.</p>
            </Card.Content>
          </Card>
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
