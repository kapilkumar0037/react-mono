import { Card } from '@react-mono/ui-controls';

export const CardsDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <p className="text-gray-600 mb-8">
          Card components with different variants and sections.
        </p>
      </div>

      <div className="space-y-6">
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
            <button className="text-primary">Action</button>
            <button className="text-gray-500">Cancel</button>
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
  );
};