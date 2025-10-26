import { Badge, Button } from '@react-mono/ui-controls';

export const BadgesDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <p className="text-gray-600 mb-8">
          Badge components for status indicators and counters.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rounded Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary" rounded>Primary</Badge>
          <Badge variant="secondary" rounded>Secondary</Badge>
          <Badge variant="success" rounded>Success</Badge>
          <Badge variant="danger" rounded>Danger</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Badge Sizes</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Badge variant="primary" size="sm">Small</Badge>
          <Badge variant="primary" size="md">Medium</Badge>
          <Badge variant="primary" size="lg">Large</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dot Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="success" dot>Online</Badge>
          <Badge variant="danger" dot>Offline</Badge>
          <Badge variant="warning" dot>Away</Badge>
          <Badge variant="info" dot>Processing</Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Counter Badges</h3>
        <div className="flex flex-wrap gap-4">
          <Badge variant="primary" counter>1</Badge>
          <Badge variant="secondary" counter>12</Badge>
          <Badge variant="danger" counter rounded>99+</Badge>
          <Button variant="primary" size="md">
            Notifications
            <Badge variant="secondary" counter rounded className="ml-2">5</Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};