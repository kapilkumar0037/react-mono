import React, { useState } from 'react';
import { ListGroup, ListGroupItem } from '@react-mono/ui-controls';

export const ListGroupDemo: React.FC = () => {
  const [selected, setSelected] = useState(1);
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">List Group</h2>
        <p className="text-sm text-gray-600 mb-4">Flexible list group for navigation, menus, and more.</p>

        <div className="max-w-xs">
          <h3 className="text-lg font-semibold mb-2">Basic Example</h3>
          <ListGroup>
            <ListGroupItem>Item 1</ListGroupItem>
            <ListGroupItem>Item 2</ListGroupItem>
            <ListGroupItem>Item 3</ListGroupItem>
          </ListGroup>
        </div>

        <div className="max-w-xs mt-8">
          <h3 className="text-lg font-semibold mb-2">Active & Disabled</h3>
          <ListGroup>
            <ListGroupItem active>Active item</ListGroupItem>
            <ListGroupItem>Normal item</ListGroupItem>
            <ListGroupItem disabled>Disabled item</ListGroupItem>
          </ListGroup>
        </div>

        <div className="max-w-xs mt-8">
          <h3 className="text-lg font-semibold mb-2">Selectable (controlled)</h3>
          <ListGroup>
            {[1,2,3].map(i => (
              <ListGroupItem
                key={i}
                active={selected === i}
                onClick={() => setSelected(i)}
                className="cursor-pointer"
              >
                Selectable {i}
              </ListGroupItem>
            ))}
          </ListGroup>
        </div>

        <div className="max-w-xs mt-8">
          <h3 className="text-lg font-semibold mb-2">Custom Content</h3>
          <ListGroup>
            <ListGroupItem>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Online
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-gray-400 rounded-full" />
                Offline
              </div>
            </ListGroupItem>
            <ListGroupItem>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                Away
              </div>
            </ListGroupItem>
          </ListGroup>
        </div>
      </section>
    </div>
  );
};

export default ListGroupDemo;
