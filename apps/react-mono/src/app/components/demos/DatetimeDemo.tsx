import { Datetime } from '@react-mono/ui-controls';

export const DatetimeDemo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">DateTime</h2>
        <p className="text-gray-600 mb-8">
          DateTime input component for date and time selection.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic DateTime</h3>
        <div className="max-w-xs">
          <Datetime 
            value="2025-10-22T15:30" 
            onChange={(value) => console.log('New datetime:', value)}
          >
            Select Date and Time
          </Datetime>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">States</h3>
        <div className="max-w-xs space-y-4">
          <Datetime value="2025-10-22T15:30" disabled>
            Disabled DateTime
          </Datetime>
          <Datetime value="2025-10-22T15:30" readOnly>
            Read-only DateTime
          </Datetime>
        </div>
      </div>
    </div>
  );
};